import { Handler, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { IWebHookPayLoad } from "./types";
const AWS = require('aws-sdk')

const sns = new AWS.SNS({ apiVersion: '2012-11-05' })
var docClient = new AWS.DynamoDB.DocumentClient();

type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>

export const handler: ProxyHandler = async (event, context) => {

    let responseBody: string = "";
    let statusCode: number = 0;
    try {
        const payload: IWebHookPayLoad = JSON.parse(event.body)
        const dbParams = {
            TableName: process.env.Product_Table,
            Item: {
                id:payload["event-data"].id,
                ...payload
            },
        };

        const data = await docClient.put(dbParams).promise();
        if (data.Item) {
            const snsParams = {
                Message: `email ${payload["event-data"].event}`,
                Subject: 'Mailgun',
                timestamp: payload["event-data"].timestamp,
                MessageAttributes: {
                    'AWS.MM.SMS.OriginationNumber': {
                        'DataType': 'String',
                        'StringValue': process.env.tenDLC
                    }
                }
            }
            const result = await sns.publish(snsParams).promise()
            console.log(result)
        }else{
            responseBody = "Couldn't add data to DB";
            statusCode = 400
        }
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
