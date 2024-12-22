import { Hono } from 'hono'
import { tasksTable } from '../drizzle/schema'
import { db } from '../drizzle/db'
import { zValidator } from '@hono/zod-validator'
import { taskSchema } from '../schemas/tasks'
import { eq } from 'drizzle-orm'

const app = new Hono()
  .get('/', async (c) => {
    const tasks = await db.select().from(tasksTable)
    return c.json(tasks)
  })
  .post(
    '/',
    zValidator('json', taskSchema, (result, c) => {
      if (!result.success) {
        console.log(result.error)
        return c.json({ message: 'validation error' }, 400)
      }
    }),
    async (c) => {
      const task = c.req.valid('json')
      await db.insert(tasksTable).values(task)
      return c.json({ message: 'success' })
    }
  )
  .put(
    '/:id',
    zValidator('json', taskSchema, (result, c) => {
      if (!result.success) {
        console.log(result.error)
        return c.json({ message: 'validation error' }, 400)
      }
    }),
    async (c) => {
      const task = c.req.valid('json')
      const id = +c.req.param('id')
      if (isNaN(id)) {
        return c.json({ message: 'invalid id' }, 400)
      }
      await db.update(tasksTable).set(task).where(eq(tasksTable.id, id))
      return c.json({ message: 'success' })
    }
  )
  .delete('/:id', async (c) => {
    const id = +c.req.param('id')
    if (isNaN(id)) {
      return c.json({ message: 'invalid id' }, 400)
    }
    await db.delete(tasksTable).where(eq(tasksTable.id, id))
    return c.json({ message: 'success' })
  })

export default app
