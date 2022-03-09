import { Handler, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { IWebHookPayLoad } from "./types";
import * as AWS from 'aws-sdk';

const sns = new AWS.SNS({ apiVersion: '2012-11-05' })
var docClient = new AWS.DynamoDB.DocumentClient();

type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>

export const handler: ProxyHandler = async (event, context) => {

    let responseBody: string = "";
    let statusCode: number = 0;
    try {
        const payload: IWebHookPayLoad = JSON.parse(event.body)
        const dbParams = {
            TableName: process.env.Webhook_Table,
            Item: {
                id:payload["event-data"].id,
                ...payload
            },
        };

        await docClient.put(dbParams).promise();
        const snsParams = {
            Message: `email ${payload["event-data"].event}`,
            Subject: 'Mailgun',
            timestamp: payload["event-data"].timestamp,
            TopicArn: process.env.TopicArn,
            MessageAttributes: {
                'timestamp': {
                    'DataType': 'String',
                    'StringValue': payload["event-data"].timestamp.toString()
                }
            }
        }
        const result = await sns.publish(snsParams).promise()
        console.log(result)
        responseBody = "Successfull";
        statusCode = 200
    } catch (error) {
        console.log(error);
        responseBody = "Unable publish message";
        statusCode = 400
    }

    return {
        statusCode: statusCode,
        body: responseBody,
        headers: {
            "Content-Type": "application/json",
            "access-control-allow-origin": "*",
        },
    };
};
