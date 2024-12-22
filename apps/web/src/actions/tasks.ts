'use server'

import { taskSchema } from '@next-hono-crud-example/backend/schemas'

import { client } from '@/lib/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function createTask(unsafeData: z.infer<typeof taskSchema>) {
  const validatedFields = taskSchema.safeParse(unsafeData)

  if (!validatedFields.success) {
    return {
      validateErrors: validatedFields.error.flatten().fieldErrors,
      resultError: undefined,
    }
  }

  const response = await client.tasks.$post({ json: validatedFields.data })

  if (!response.ok) {
    return {
      validateErrors: undefined,
      resultError: 'Failed to create user',
    }
  }

  revalidatePath('/')
  return {
    validateErrors: undefined,
    resultError: undefined,
  }
}

export async function updateTask(id: string, unsafeData: z.infer<typeof taskSchema>) {
  const validatedFields = taskSchema.safeParse(unsafeData)

  if (!validatedFields.success) {
    return {
      validateErrors: validatedFields.error.flatten().fieldErrors,
      resultError: undefined,
    }
  }

  const response = await client.tasks[':id'].$put({ param: { id }, json: validatedFields.data })

  if (!response.ok) {
    return {
      validateErrors: undefined,
      resultError: 'Failed to create user',
    }
  }

  revalidatePath('/')
  return {
    validateErrors: undefined,
    resultError: undefined,
  }
}

export async function deleteTask(id: string) {
  const response = await client.tasks[':id'].$delete({ param: { id } })

  if (!response.ok) {
    return {
      resultError: 'Failed to delete task',
    }
  }
  revalidatePath('/')
  return {
    validateErrors: undefined,
    resultError: undefined,
  }
}
