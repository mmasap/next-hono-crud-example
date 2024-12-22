import { z } from 'zod'

export const taskSchema = z.object({
  id: z.number().optional(),
  title: z.string().nonempty(),
  status: z.enum(['todo', 'backlog', 'in progress', 'done', 'canceled']),
  labels: z.array(z.enum(['bug', 'feature', 'documentation'])).transform((labels) => labels.sort()),
  priority: z.enum(['low', 'medium', 'high']),
})

export type Task = z.infer<typeof taskSchema>
