import { Injectable, Logger } from "@nestjs/common";
import { type Prisma } from "generated/prisma/client";
import { env } from "src/shared/config/env";
import { ListingsRepository } from "src/shared/database/repositories/listings.repositories";
import { UsersRepository } from "src/shared/database/repositories/users.repositories";
import { RecommendationListingsQueryDto } from "./dto/recommendation-listings-query.dto";

const DEFAULT_MODEL = "google/gemma-2-9b-it:free";
const DEFAULT_USER_PROMPT = "usuario gostaria de ver livros";
const DEFAULT_SYSTEM_PROMPT = `
Você é um sistema de recomendação de anúncios para um marketplace universitário.

Intenção do usuário: "${DEFAULT_USER_PROMPT}"

Pesos:
- title = 70%
- category = 25%
- description = 5%

Exemplo:
Usuário: "quero livros"

Anúncios:
- "Computador Gamer" | categoria: "Livros"
- "Livro de Engenharia de Software" | categoria: "Livros"
- "Livro de Física" | categoria: "Livros"

Ordem correta:
1. Livro de Engenharia de Software
2. Livro de Física
3. Computador Gamer

Motivo:
Mesmo estando na categoria "Livros", "Computador Gamer" não é um livro e deve ser penalizado.

Regras:
- Priorize fortemente o title.
- Penalize títulos incompatíveis com a intenção do usuário.
- Não coloque um anúncio em primeiro apenas porque a category coincide.
- Utilize apenas IDs existentes.

Responda SOMENTE JSON válido:
{"orderedListingIds":["id1","id2"],"reason":"motivo curto"}
`;
const OPENROUTER_TIMEOUT_MS = 30_000;
const OPENROUTER_ERROR_BODY_MAX_LENGTH = 1_000;
const OPENROUTER_RESPONSE_LOG_MAX_LENGTH = 2_000;

const listingInclude = {
  seller: {
    select: {
      id: true,
      name: true,
      email: true,
      course: true,
      campus: true,
      avatarUrl: true,
      bio: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  category: true,
  images: {
    orderBy: [{ isCover: "desc" }, { position: "asc" }, { createdAt: "asc" }],
  },
} satisfies Prisma.ListingInclude;

type ListingWithDetails = Prisma.ListingGetPayload<{
  include: typeof listingInclude;
}>;

type RecommendationListing = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  categorySlug: string;
  price: string;
  condition: string;
  type: string;
  location: string | null;
};

type RecommendationRanking = {
  orderedListingIds?: string[];
  reason?: string | null;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(
    private readonly listingsRepo: ListingsRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async findListings(userId: string, query: RecommendationListingsQueryDto) {
    const user = await this.usersRepo.findUnique({
      where: { id: userId },
      select: { defaultUserPrompt: true },
    });
    const prompt =
      query.prompt?.trim() ||
      user?.defaultUserPrompt?.trim() ||
      DEFAULT_USER_PROMPT;
    const listings = (await this.listingsRepo.findMany({
      where: { status: "ACTIVE" },
      include: listingInclude,
      orderBy: { createdAt: "desc" },
    })) as ListingWithDetails[];

    this.logger.log(
      `Gerando recomendacoes. Prompt: "${prompt}". Anuncios ativos enviados para IA: ${listings.length}.`,
    );

    const ranking = await this.getRecommendationRanking(prompt, listings);
    const orderedListings = this.orderListingsByRecommendation(
      listings,
      ranking,
    );

    this.logger.log(
      `Ordem final de recomendacoes: ${this.formatOrderedListingsLog(orderedListings)}.`,
    );

    return {
      listings: orderedListings,
    };
  }

  private async getRecommendationRanking(
    prompt: string,
    listings: ListingWithDetails[],
  ): Promise<RecommendationRanking | null> {
    if (!env.openRouterApiKey) {
      return null;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const model = env.openRouterModel || DEFAULT_MODEL;

    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.openRouterApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  env.recommendationsSystemPrompt || DEFAULT_SYSTEM_PROMPT,
              },
              {
                role: "user",
                content: JSON.stringify({
                  prompt,
                  listings: listings.map((listing) =>
                    this.mapListingToRecommendationListing(listing),
                  ),
                }),
              },
            ],
            temperature: 0.1,
            max_tokens: 1000,
          }),
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        const errorBody = await this.readOpenRouterErrorBody(response);
        this.logger.warn(
          `OpenRouter respondeu com status ${response.status} para o modelo ${model}. Body: ${errorBody}`,
        );
        return null;
      }

      const data = (await response.json()) as OpenRouterResponse;
      const content = data.choices?.[0]?.message?.content;
      this.logger.log(
        `Resposta bruta da IA (${model}): ${this.truncateLog(content || "sem conteudo", OPENROUTER_RESPONSE_LOG_MAX_LENGTH)}`,
      );

      return this.parseRecommendationRanking(content);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        this.logger.warn(
          `OpenRouter excedeu o tempo limite de ${OPENROUTER_TIMEOUT_MS}ms para o modelo ${model}. Usando fallback local.`,
        );
      } else {
        this.logger.warn(
          `OpenRouter indisponivel para o modelo ${model}. Erro: ${this.formatErrorMessage(error)}. Usando fallback local.`,
        );
      }
      return null;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  private mapListingToRecommendationListing(
    listing: ListingWithDetails,
  ): RecommendationListing {
    return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category.name,
      categorySlug: listing.category.slug,
      price: listing.price.toString(),
      condition: listing.condition,
      type: listing.type,
      location: listing.location,
    };
  }

  private async readOpenRouterErrorBody(response: Response) {
    try {
      const body = await response.text();

      if (!body) {
        return "sem corpo de resposta";
      }

      return body.length > OPENROUTER_ERROR_BODY_MAX_LENGTH
        ? `${body.slice(0, OPENROUTER_ERROR_BODY_MAX_LENGTH)}...`
        : body;
    } catch (error) {
      return `nao foi possivel ler o corpo de erro: ${this.formatErrorMessage(error)}`;
    }
  }

  private formatErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }

  private parseRecommendationRanking(
    content?: string,
  ): RecommendationRanking | null {
    if (!content) {
      return null;
    }

    const trimmedContent = content.trim();
    const fencedMatch = trimmedContent.match(
      /^```(?:json)?\s*([\s\S]*?)\s*```\s*$/i,
    );
    const cleanedContent = (
      fencedMatch ? fencedMatch[1] : trimmedContent
    ).trim();

    try {
      const parsed = JSON.parse(cleanedContent) as RecommendationRanking;
      const ranking = {
        orderedListingIds: Array.isArray(parsed.orderedListingIds)
          ? parsed.orderedListingIds.filter(
              (listingId) => typeof listingId === "string",
            )
          : [],
        reason: typeof parsed.reason === "string" ? parsed.reason : null,
      };

      this.logger.log(
        `Ranking interpretado da IA. IDs: ${ranking.orderedListingIds.join(", ") || "nenhum"}. Motivo: ${ranking.reason || "nao informado"}.`,
      );

      return ranking;
    } catch {
      this.logger.warn(
        `Nao foi possivel interpretar JSON da IA. Conteudo limpo: ${this.truncateLog(cleanedContent, OPENROUTER_RESPONSE_LOG_MAX_LENGTH)}`,
      );
      return null;
    }
  }

  private orderListingsByRecommendation(
    listings: ListingWithDetails[],
    ranking: RecommendationRanking | null,
  ) {
    const orderedListingIds = ranking?.orderedListingIds;

    if (!orderedListingIds?.length) {
      return listings;
    }

    const listingById = new Map(
      listings.map((listing) => [listing.id, listing] as const),
    );
    const usedListingIds = new Set<string>();
    const orderedListings: ListingWithDetails[] = [];

    for (const listingId of orderedListingIds) {
      const listing = listingById.get(listingId);

      if (!listing || usedListingIds.has(listingId)) {
        continue;
      }

      usedListingIds.add(listingId);
      orderedListings.push(listing);
    }

    const remainingListings = listings.filter(
      (listing) => !usedListingIds.has(listing.id),
    );

    return [...orderedListings, ...remainingListings];
  }

  private formatOrderedListingsLog(listings: ListingWithDetails[]) {
    if (listings.length === 0) {
      return "nenhum anuncio";
    }

    return listings
      .slice(0, 20)
      .map(
        (listing, index) =>
          `${index + 1}. ${listing.id} | ${listing.title} | ${listing.category.name}`,
      )
      .join(" ; ");
  }

  private truncateLog(value: string, maxLength: number) {
    return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
  }
}
