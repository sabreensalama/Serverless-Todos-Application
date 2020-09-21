import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)


  // TODO: Remove a TODO item by id
  const result = await docClient.delete({
    TableName :  todosTable,
    Key: {
      todoId,
      userId
   },

}).promise()

console.log(result)
return {
  statusCode: 200,
  headers: {
      "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify({})
}
}
