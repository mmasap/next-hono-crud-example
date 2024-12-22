import { hc } from 'hono/client'
import type { AppType } from '@next-hono-crud-example/backend/app'

export const client = hc<AppType>(`${getBaseURL()}/api`)

export function getBaseURL() {
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
  const url = isProd ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL

  return url ? `https://${url}` : `http://localhost:${process.env.PORT || 3000}`
}
