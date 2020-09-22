import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todos'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('auth')

const todoAccess = new TodoAccess()


export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Generating uuid...')

  const todoId = uuid.v4()
  const createdAt = new Date().getTime().toString()

  return await todoAccess.createTodo({
    userId,
    todoId,
    createdAt,
    done: false,
    ...createTodoRequest,
  })

}

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getTodos(userId)
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
) {
  return await todoAccess.updateTodo(userId, todoId, updatedTodo)
}

export async function deleteTodo(userId: string, todoId: string) {
  return await todoAccess.deleteTodo(userId, todoId)
}
