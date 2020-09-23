import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly Index = process.env.INDEX_NAME
     ) {}

  // async createTodo(todo: TodoItem): Promise<TodoItem> {
  //   await this.docClient.put({
  //       TableName: this.todosTable,
  //        Item : todo
  //     })
  //     .promise()

  //   return todo
  // }

  async getTodos(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.Index,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()


    const items = result.Items

    return items as TodoItem[]
  }

  async updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
    await this.docClient.update({
        TableName :  this.todosTable,
        Key: {
          "userId": userId,
          "todoId": todoId,
       },
       UpdateExpression: "set #name = :n , #Date = :du , #done = :do",
          ExpressionAttributeValues: {
            ':n': updatedTodo.name,
            ':du' : updatedTodo.dueDate,
            ':do' : updatedTodo.done
        },
        ExpressionAttributeNames: {
          '#name': 'name',
          '#Date': 'dueDate',
          '#done': 'done'
      }
    }).promise()
  }

  async deleteTodo(userId: string, todoId: string) {
    await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      })
      .promise()

  }
}