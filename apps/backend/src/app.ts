import { Hono } from 'hono'
import tasks from './routes/tasks'

const app = new Hono()

const routes = app.route('/tasks', tasks)

export type AppType = typeof routes

export { app }
