'use client'

import { Button } from '@/components/ui/button'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

import { labels, priorities, statuses } from '../_components/data/data'
import { Checkbox } from '@/components/ui/checkbox'
import { taskSchema } from '@next-hono-crud-example/backend/schemas'
import { createTask, updateTask, deleteTask } from '@/actions/tasks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createContext, useState, PropsWithChildren } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'

type TaskDialogProps = {
  mode: 'create' | 'edit' | 'delete'
  original?: z.infer<typeof taskSchema>
}

export const TaskDialogContext = createContext<{
  openCreateDialog: (original?: z.infer<typeof taskSchema>) => void
  openEditDialog: (original: z.infer<typeof taskSchema>) => void
  openDeleteDialog: (original: z.infer<typeof taskSchema>) => void
}>({
  openCreateDialog: () => {},
  openEditDialog: () => {},
  openDeleteDialog: () => {},
})

export const TaskDialogProvider = ({ children }: PropsWithChildren) => {
  const [taskDialog, setTaskDialog] = useState<TaskDialogProps>()

  function handleClose() {
    setTaskDialog(undefined)
  }

  function handleCreateDialog(original?: z.infer<typeof taskSchema>) {
    setTaskDialog({ mode: 'create', original })
  }

  function handleEditDialog(original: z.infer<typeof taskSchema>) {
    setTaskDialog({ mode: 'edit', original })
  }

  function handleDeleteDialog(original: z.infer<typeof taskSchema>) {
    setTaskDialog({ mode: 'delete', original })
  }

  const contextValue = {
    openCreateDialog: handleCreateDialog,
    openEditDialog: handleEditDialog,
    openDeleteDialog: handleDeleteDialog,
  }

  return (
    <TaskDialogContext value={contextValue}>
      {children}
      {(taskDialog?.mode === 'create' || taskDialog?.mode === 'edit') && (
        <TaskFormDialog mode={taskDialog.mode} original={taskDialog.original} close={handleClose} />
      )}
      {taskDialog?.mode === 'delete' && (
        <TaskDeleteDialog original={taskDialog.original} close={handleClose} />
      )}
    </TaskDialogContext>
  )
}

function TaskFormDialog({ mode, original, close }: TaskDialogProps & { close: () => void }) {
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: original?.title ?? '',
      status: original?.status ?? undefined,
      labels: original?.labels ?? [],
      priority: original?.priority ?? undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    const action = mode === 'create' ? createTask : updateTask.bind(null, String(original?.id))
    await action(values)
    close()
  }

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {mode === 'create' && <DialogTitle>Create task</DialogTitle>}
          {mode === 'edit' && <DialogTitle>Edit task</DialogTitle>}
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex w-[100px] items-center">
                            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex w-[100px] items-center">
                            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="labels"
              render={() => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  {labels.map((label) => (
                    <FormField
                      key={label.value}
                      control={form.control}
                      name="labels"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={label.value}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(label.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, label.value])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== label.value)
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{label.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {mode === 'create' && <Button type="submit">Create</Button>}
              {mode === 'edit' && <Button type="submit">Update</Button>}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function TaskDeleteDialog({
  original,
  close,
}: Omit<TaskDialogProps, 'mode'> & { close: () => void }) {
  const priority = priorities.find((priority) => priority.value === original?.priority)
  const status = statuses.find((status) => status.value === original?.status)
  async function handleDeleteClick() {
    await deleteTask(String(original?.id))
    close()
  }

  return (
    <AlertDialog open onOpenChange={close}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this task?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-cols-4 gap-4">
          <div>ID</div>
          <div className="col-span-3">{original?.id}</div>
          <div>Title</div>
          <div className="col-span-3">{original?.title}</div>
          {status && (
            <>
              <div>Status</div>
              <div className="col-span-3 flex items-center">
                {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                <span>{status.label}</span>
              </div>
            </>
          )}
          {priority && (
            <>
              <div>Priority</div>
              <div className="col-span-3 flex items-center">
                {priority.icon && <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                <span>{priority.label}</span>
              </div>
            </>
          )}
          <div>Labels</div>
          <div className="col-span-3 space-x-1">
            {original?.labels.map((label) => (
              <Badge key={label}>{label}</Badge>
            ))}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/80"
            onClick={handleDeleteClick}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
