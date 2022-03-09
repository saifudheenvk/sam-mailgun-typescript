#!/bin/bash

TopicName="$1"
SWREGION="$2"
TableName="$3"
StageName="$4"
Email="$5"
BucketName="$6"
# yaml2json swagger.yaml | jq . > output/swagger_json.json
# sed -ie 's/SWREGION/'${SWREGION}'/g' output/swagger_json.json

aws cloudformation package          \
    --s3-bucket $BucketName             \
    --template-file template.yaml    \
    --region $SWREGION               \
    --output-template-file output/output.yaml 

aws cloudformation deploy \
  --s3-bucket $BucketName       \
  --template-file output/output.yaml \
  --stack-name WorkshopStack \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides TopicName=$TopicName \
  TableName=$TableName \
  StageName=$StageName \
  Email=$Email
