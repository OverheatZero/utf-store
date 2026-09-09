import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

/**
 * Escala de superfície do Design System.
 * Os tons em destaque correspondem às cores da paleta oficial:
 *   - 50  -> Light background        (#F7F9FC)
 *   - 100 -> Primary text dark bg    (#F1F5F9)
 *   - 400 -> Second text dark bg     (#94A3B8)
 *   - 500 -> Second text light bg    (#64748B)
 *   - 800 -> Primary text light bg   (#1E293B)
 *   - 900 -> Dark background         (#0F172A)
 */
const surface = {
  0: '#ffffff',
  50: '#f7f9fc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
} as const

/**
 * Preset base do Design System.
 *
 * A identidade é monocromática (navy/slate): a cor primária deriva da própria
 * escala de superfície, ficando escura sobre fundo claro e clara sobre fundo
 * escuro para garantir contraste em ambos os esquemas.
 */
export const AppPreset = definePreset(Aura, {
  semantic: {
    primary: surface,
    colorScheme: {
      light: {
        surface,
        primary: {
          color: '{surface.900}',
          contrastColor: '{surface.50}',
          hoverColor: '{surface.800}',
          activeColor: '{surface.950}',
        },
        text: {
          color: '{surface.800}', // Primary text light background
          mutedColor: '{surface.500}', // Second text light background
        },
        content: {
          background: '{surface.50}', // Light background
        },
      },
      dark: {
        surface,
        primary: {
          color: '{surface.100}',
          contrastColor: '{surface.900}',
          hoverColor: '{surface.200}',
          activeColor: '{surface.50}',
        },
        text: {
          color: '{surface.100}', // Primary text dark background
          mutedColor: '{surface.400}', // Second text dark background
        },
        content: {
          background: '{surface.900}', // Dark background
        },
      },
    },
  },
})

export default AppPreset
