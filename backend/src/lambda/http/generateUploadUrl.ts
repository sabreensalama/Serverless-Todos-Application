import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { getUserId } from '../utils'


const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET

const docClient = new AWS.DynamoDB.DocumentClient()


const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const imageId = uuid.v4()
  const userId = getUserId(event)

  const todoId = event.pathParameters.todoId


  const url = s3.getSignedUrl('putObject',{
    Bucket: bucketName,
    Key: imageId,
    Expires: 300

  })

  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`


await docClient.update({
    TableName: todosTable,
    Key: { "todoId": todoId  , "userId" : userId},
    UpdateExpression: "set attachmentUrl = :url",
    ExpressionAttributeValues:{
    ":url": imageUrl
    },
    ReturnValues:"UPDATED_NEW"
}).promise()

  return {
      statusCode: 201,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          imageUrl: imageUrl,
          uploadUrl: url
      })
  }
}