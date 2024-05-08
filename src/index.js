import * as core from '@actions/core';
import * as github from '@actions/github';
import {exec} from '@actions/exec'

async function increment() {
    try {
        // const awsAccessKeyId = core.getInput('AWS_ACCESS_KEY_ID');
        // const awsSecretAccessKey = core.getInput('AWS_SECRET_ACCESS_KEY');
        // const awsDefaultRegion = core.getInput('AWS_DEFAULT_REGION');
        const dynamoTableName = core.getInput('DYNAMO_TABLE_NAME');
        const dynamoPartitionKey = core.getInput('DYNAMO_PARTITION_KEY');
        const productId = core.getInput('PRODUCT_ID');
        // const dynamoTableName = "version-numbers"
        // const dynamoPartitionKey = "product-id"
        // const productId = "My Product"

        let stdout = '';
        let stderr = '';

        const options = {
            listeners: {
                stdout: (data) => {
                    stdout += data.toString();
                },
                stderr: (data) => {
                    stderr += data.toString();
                }
            }
        };
        
        const key = `{\"${dynamoPartitionKey}\" : {"S" : \"${productId}\"}}`

        const item = `{\"${dynamoPartitionKey}\": {"S": \"${productId}\"}, "VERSION": {"N": "11"} }`
        // console.log(item);
        const tableName = `${dynamoTableName}`;
        // console.log(tableName)
        const incrExpression = `{":incr":{"N":"1"}}`;
        // console.log(incrExpression);

        await exec("aws", [
            "dynamodb", 
            "update-item", 
            "--table-name",
            tableName,
            "--key",
            key,
            "--update-expression",
            "SET VERSION = VERSION + :incr",
            "--expression-attribute-values",
            incrExpression,
            "--return-values",
            "UPDATED_NEW",
            "--output",
            "text",
        ], options);

        // console.log(`stdOutResults ${stdout}, stdErrResults ${stderr}`)

        const result = stdout.match(/\w+\s+(\d+)/)[1];
        console.log(`result ${result}`)
        core.setOutput("result", result);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message); // Properly log the error message and fail the action
        } else {
            console.log('Failed to increment');
        }
    }
}

async function set() {
    try {
        // const awsAccessKeyId = core.getInput('AWS_ACCESS_KEY_ID');
        // const awsSecretAccessKey = core.getInput('AWS_SECRET_ACCESS_KEY');
        // const awsDefaultRegion = core.getInput('AWS_DEFAULT_REGION');
        const dynamoTableName = core.getInput('DYNAMO_TABLE_NAME');
        const dynamoPartitionKey = core.getInput('DYNAMO_PARTITION_KEY');
        const productId = core.getInput('PRODUCT_ID');
        // const dynamoTableName = "version-numbers"
        // const dynamoPartitionKey = "product-id"
        // const productId = "My Product"
        const value = core.getInput('VALUE');

        let stdout = '';
        let stderr = '';
    
        const options = {
            listeners: {
                stdout: (data) => {
                    console.log('got stdout stuff')
                    stdout += data.toString();
                },
                stderr: (data) => {
                    stderr += data.toString();
                }
            }
        };    

        const item = `{\"${dynamoPartitionKey}\": {"S": \"${productId}\"}, "VERSION": {"N": "${value}"} }`
        console.log(item);
        const tableName = `${dynamoTableName}`;
        console.log(tableName)
        var returnValue = await exec("aws", [
            "dynamodb", 
            "put-item", 
            "--table-name",
            tableName,
            "--item",
            item
        ], options);
        console.log(`returnValue ${returnValue} stdOutResults ${stdout}, stdErrResults ${stderr}`)

        core.setOutput("result", value);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message); // Properly log the error message and fail the action
        } else {
            console.log('Failed to set');
        }
    }
}

set();

export default { set, increment };

