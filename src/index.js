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

        // const dynamoTableName = "build-numbers"
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

        const keyJson = { [dynamoPartitionKey]: { "S": `${productId}` } };        
        const key = JSON.stringify(keyJson);
        const tableName = `${dynamoTableName}`;
        const incrExpression = {":incr":{"N":"1"}};
        const incrJson = JSON.stringify(incrExpression);

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
            incrJson,
            "--return-values",
            "UPDATED_NEW",
            "--output",
            "text",
        ], options);

        // console.log(`stdOutResults ${stdout}, stdErrResults ${stderr}`)

        const result = stdout.match(/\w+\s+(\d+)/)[1];
        // console.log(`result ${result}`)
        core.setOutput("result", result);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message); // Properly log the error message and fail the action
        } else {
            console.log('Failed to increment');
        }
    }
}

async function get() {
    try {
        // const dynamoTableName = core.getInput('DYNAMO_TABLE_NAME');
        // const dynamoPartitionKey = core.getInput('DYNAMO_PARTITION_KEY');
        // const productId = core.getInput('PRODUCT_ID');

        const dynamoTableName = "build-numbers"
        const dynamoPartitionKey = "product-id"
        const productId = "My Product"

        const keyJson = { [dynamoPartitionKey]: { "S": `${productId}` } };        
        const key = JSON.stringify(keyJson);

        let value;
        const command = `aws dynamodb get-item --table-name ${dynamoTableName} --key`
        // console.log(command);
        await exec(command, [key], {
            listeners: {
                stdout: (data) => {
                    const output = data.toString();
                    // console.log(output)
                    value = JSON.parse(output).Item.VERSION.N;
                    // console.log(value)
                },
                stderr: (data) => {
                    console.error(data.toString());
                }
            }
        });
        core.setOutput("result", value);
        return value;
    } catch (error) {
        console.error("Error getting value from DynamoDB item:", error);
        return null;
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
        const value = core.getInput('VALUE');
        // const dynamoTableName = "build-numbers"
        // const dynamoPartitionKey = "product-id"
        // const productId = "My Product"
        // const value = "77";

        let stdout = '';
        let stderr = '';
    
        const options = {
            listeners: {
                stdout: (data) => {
                    console.log(`stdout: <${data.toString()}>`)
                    stdout += data.toString();
                },
                stderr: (data) => {
                    console.log(`stderr: <${data.toString()}>`)
                    stderr += data.toString();
                }
            }
        };    

        // const item = `{"${dynamoPartitionKey}": {"S": "${productId}"}, "VERSION": {"N": "${value}"} }`
        // const tableName = `${dynamoTableName}`;
        // var returnValue = await exec("aws", [
        //     "dynamodb", 
        //     "put-item", 
        //     "--table-name",
        //     tableName,
        //     "--item",
        //     item
        // ], options);
        // console.log(`returnValue ${returnValue} stdOutResults ${stdout}, stdErrResults ${stderr}`)

        const item = {
            [dynamoPartitionKey]: { "S": `${productId}` }, // Use productId as the value
            "VERSION": { "N": `${value}` }
        };
        const itemJson = JSON.stringify(item);
        // console.log(`itemJson ${itemJson}`);

        const awsCommand = `aws dynamodb put-item --table-name ${dynamoTableName} --item `;
        // console.log(`${awsCommand}`);
        var returnValue = await exec(awsCommand, [itemJson], options);
        // console.log(`returnValue ${returnValue} stdOutResults ${stdout}, stdErrResults ${stderr}`)

        core.setOutput("result", value);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message); // Properly log the error message and fail the action
        } else {
            console.log('Failed to set');
        }
    }
}

async function main() {
    const op = core.getInput('OPERATION');
    switch (op) {
        case "increment":
            await increment();
            break;
        case "get":
            await get();
            break;
        case "set":
            await set();
            break;
        default:
            core.setFailed("OPERATION must be one of [set | increment]")
    }
}

main();

export default { increment, get, set, main };
