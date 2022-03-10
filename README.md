# SAM Mailgun Typescript

When we send an email with mailgun we will be getting some events like delivered,opened,clicked etc.. We can handle those events by webhooks from mailgun.
- Here I have added a lambda function(will be triggered by an api named **webhook-api** )
- SNS topic to publish the event from webhook to subscribers (For demo purpose I have added asubscriber)
- DynamoDB to store whole data from webhook

## Code
- I am using **typescript** for development so I have added all the basic configuration for typescript. **npm run compile** will make build files inside build folder
- **template.yaml** file will help me to creating required resources. And this file is expecting **TopicName**,     **TableName**(DynamoDB table), **StageName**(For Api gateway), **Email**(For topic subscriber)
- **constants.properties** file will help us to set my parameters and region for deployment
- Inside **deploy .sh** file I'm installing all the dependencies and updated **swagger.yaml** file for APIs 

