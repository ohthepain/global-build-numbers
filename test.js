
const dynamoTableName = "build-numbers"
const dynamoPartitionKey = "product-id"
const productId = "my game"
const awsCommand = `aws dynamodb put-item --table-name ${dynamoTableName} --item '{"${dynamoPartitionKey}": {"S": "${productId}"}, "VERSION": {"N": "1"} }'`;
console.log(`${awsCommand}`);
