import { Metadata } from 'next'

import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { client } from '@/lib/client'
import { TaskDialogProvider } from './_provider/task-dialog-provider'

export const metadata: Metadata = {
  title: 'Todos',
  description: 'A task and issue tracker build using Tanstack Table.',
}

export default async function TaskPage() {
  const tasks = await getTasks()

  return (
    <TaskDialogProvider>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <DataTable data={tasks} columns={columns} />
      </div>
    </TaskDialogProvider>
  )
}

async function getTasks() {
  const res = await client.tasks.$get()
  if (!res.ok) {
    throw new Error()
  }
  return await res.json()
}
