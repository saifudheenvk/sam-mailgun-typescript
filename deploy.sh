#!/bin/bash

source constants.properties
./npm-install.sh

if [ ! -d output ]; then
  mkdir output
fi

cp swagger.yaml output/swagger.yaml
sed -ie 's/SWREGION/'${SWREGION}'/g' output/swagger.yaml


aws cloudformation package          \
    --s3-bucket $BucketName             \
    --template-file template.yaml    \
    --region $SWREGION               \
    --output-template-file output/output.yaml 

aws cloudformation deploy \
  --s3-bucket $BucketName       \
  --template-file output/output.yaml \
  --region $SWREGION  \
  --stack-name WebhookStack \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides TopicName=$TopicName   \
  TableName=$TableName \
  StageName=$StageName \
  Email=$Email
