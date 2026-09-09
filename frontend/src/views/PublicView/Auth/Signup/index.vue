<script setup lang="ts">
defineOptions({ name: 'PublicAuthSignin' })

import axios from 'axios'
import { z } from 'zod'
import { useRouter } from 'vue-router'

import { useToast } from 'primevue/usetoast'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Card from 'primevue/card'

import { useAuthStore } from '@/stores/auth'
import type AuthSignupReqInterface from '@/domain/auth/types/req/AuthSignupReqInterface'
import REGEX_EMAIL from '@/helpers/regex/email'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const resolver = zodResolver(
  z.object({
    name: z.string().nonempty({ error: 'Nome é obrigatório' }),
    email: z.string().nonempty({ error: 'Email é obrigatório' }).regex(REGEX_EMAIL, {
      error: 'O email precisa ser institucional da UTFPR (utfpr.edu.br)',
    }),
    password: z
      .string()
      .nonempty({ error: 'Senha é obrigatória' })
      .min(6, { error: 'A senha deve conter no mínimo 6 caracteres' }),
    course: z.string().nonempty({ error: 'Curso é obrigatório' }),
    campus: z.string().nonempty({ error: 'Campus é obrigatório' }),
    avatarUrl: z.url({ error: 'A URL do avatar deve ser válida' }),
    bio: z
      .string()
      .min(25, { error: 'Biografia deve ter no mínimo 25 caracteres' })
      .max(200, { error: 'Biografia deve ter no máximo 200 caracteres' }),
  }),
)

async function signup(data: AuthSignupReqInterface) {
  try {
    await authStore.actSignup(data)
    toast.add({ severity: 'success', summary: 'Cadastro realizado com sucesso.', life: 3000 })

    router.replace('/app')
  } catch (err) {
    if (!axios.isAxiosError(err)) return
    const errorMessage = err.response?.data?.message || 'Erro desconhecido'
    toast.add({
      severity: 'error',
      summary: 'Erro ao realizar cadastro.',
      detail: errorMessage,
      life: 3000,
    })
  }
}

function onFormSubmit({ valid, values }: FormSubmitEvent) {
  if (!valid) return
  signup(values as AuthSignupReqInterface)
}
</script>

<template>
  <Card class="w-full max-w-md shadow-lg">
    <template #header>
      <Button
        severity="info"
        size="small"
        link
        label="Voltar"
        class="w-3"
        icon="pi pi-arrow-left"
        @click="$router.push({ name: 'public.auth.signin' })"
      />
    </template>

    <template #title>
      <h2 class="text-2xl font-bold text-slate-900 text-center">Cadastro</h2>
      <h5 class="text-lg font-semibold text-slate-700 text-center">UTF-Store Admin Dashboard</h5>
    </template>

    <template #content>
      <Form :resolver @submit="onFormSubmit" class="flex w-full max-w-md flex-col gap-4 mt-4">
        <FormField v-slot="$field" asChild name="name" initialValue="" class="flex flex-col gap-2">
          <section class="flex flex-col gap-2">
            <InputText type="text" placeholder="Nome" class="w-full" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </section>
        </FormField>
        <FormField v-slot="$field" asChild name="email" initialValue="" class="flex flex-col gap-2">
          <section class="flex flex-col gap-2">
            <InputText accept="email" type="email" placeholder="E-mail" class="w-full" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </section>
        </FormField>
        <FormField v-slot="$field" asChild name="password" initialValue="">
          <section class="flex flex-col gap-2">
            <Password
              type="password"
              placeholder="Senha"
              :feedback="false"
              toggleMask
              fluid
              class="w-full"
            />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </section>
        </FormField>
        <FormField v-slot="$field" asChild name="course" initialValue="">
          <section class="flex flex-col gap-2">
            <InputText type="text" placeholder="Curso" class="w-full" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </section>
        </FormField>
        <FormField v-slot="$field" asChild name="campus" initialValue="">
          <section class="flex flex-col gap-2">
            <InputText type="text" placeholder="Campus" class="w-full" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </section>
        </FormField>
        <FormField v-slot="$field" asChild name="avatarUrl" initialValue="">
          <section class="flex flex-col gap-2">
            <InputText type="url" placeholder="URL do avatar" class="w-full" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </section>
        </FormField>
        <FormField v-slot="$field" asChild name="bio" initialValue="">
          <section class="flex flex-col gap-2">
            <Textarea placeholder="Biografia" class="w-full" rows="4" autoResize />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </section>
        </FormField>

        <Button type="submit" severity="success" label="Cadastrar" class="w-full" />
      </Form>
    </template>
  </Card>
</template>
