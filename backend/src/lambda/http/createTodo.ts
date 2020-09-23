import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'


const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const todoId = uuid.v4()
  const createdAt = new Date().getTime().toString()


  const newItem = {
    userId,
    createdAt,
    todoId,
    done : false,
    ...newTodo,
  }
  console.log('Storing new item: ', newItem)

  await docClient.put({
      TableName: todosTable,
      Item: newItem
    }).promise()

    console.log("create todo: " + newItem);
    return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "item": newItem
        })
  }
}