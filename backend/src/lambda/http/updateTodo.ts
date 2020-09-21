import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  const result = await docClient.update({
    TableName :  todosTable,
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
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({
    "item": result
  })
}
}
