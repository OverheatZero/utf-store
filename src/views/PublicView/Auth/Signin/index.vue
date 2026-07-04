<script setup lang="ts">
defineOptions({ name: 'PublicAuthSignin' })

import axios from 'axios'
import { z } from 'zod'
import { useRouter } from 'vue-router'

import { useToast } from 'primevue/usetoast'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Card from 'primevue/card'

import { useAuthStore } from '@/stores/auth'
import type AuthSigninReqInterface from '@/domain/auth/types/req/AuthSigninReqInterface'
import REGEX_EMAIL from '@/helpers/regex/email'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const resolver = zodResolver(
  z.object({
    email: z.string().nonempty({ error: 'Email é obrigatório' }).regex(REGEX_EMAIL, {
      error: 'O email precisa ser institucional da UTFPR (utfpr.edu.br)',
    }),
    password: z
      .string()
      .nonempty({ error: 'Senha é obrigatória' })
      .min(6, { error: 'A senha deve conter no mínimo 6 caracteres' }),
  }),
)

async function signin(data: AuthSigninReqInterface) {
  try {
    await authStore.actSignin(data)
    toast.add({ severity: 'success', summary: 'Login efetuado com sucesso.', life: 3000 })

    router.replace('/app')
  } catch (err) {
    if (!axios.isAxiosError(err)) return
    const errorMessage = err.response?.data?.message || 'Erro desconhecido'
    toast.add({
      severity: 'error',
      summary: 'Erro ao realizar login.',
      detail: errorMessage,
      life: 3000,
    })
  }
}

function onFormSubmit({ valid, values }: FormSubmitEvent) {
  if (!valid) return
  signin(values as AuthSigninReqInterface)
}
</script>

<template>
  <Card class="w-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-none rounded-2xl p-4">
    <template #title>
      <div class="mb-4">
        <h2 class="text-2xl font-bold text-slate-900 text-center tracking-tight">Admin Login</h2>
        <h5 class="text-sm font-medium text-slate-500 text-center mt-1">
          UTF-Store Admin Dashboard
        </h5>
      </div>
    </template>

    <template #content>
      <Form :resolver @submit="onFormSubmit" class="flex w-full max-w-md flex-col gap-4 mt-4">
        <FormField
          v-slot="$field"
          as="section"
          name="email"
          initialValue=""
          class="flex flex-col gap-2"
        >
          <InputText accept="email" type="email" placeholder="E-mail" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
            $field.error?.message
          }}</Message>
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
        <Button
          type="submit"
          label="Acessar"
          class="w-full bg-slate-900 hover:bg-slate-800 border-none text-white rounded-xl py-3 mt-4"
        />
      </Form>
    </template>
  </Card>
</template>
