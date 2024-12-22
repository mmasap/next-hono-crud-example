import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const tasksTable = sqliteTable('tasks', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  status: text({ enum: ['todo', 'backlog', 'in progress', 'done', 'canceled'] }).notNull(),
  labels: text({ mode: 'json' }).default('[]'),
  priority: text({ enum: ['low', 'medium', 'high'] }).notNull(),
})
