const { exec } = require('@actions/exec')
const core = require('@actions/core');

async function increment(dynamoTableName, dynamoPartitionKey, productId) {
    try {
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
            if (core.getInput('CREATE_PRODUCT_ID')) {
                console.log(`Error: maybe productId=${productId} doesn't exist. Try setting it to 0`);
                await set(dynamoTableName, dynamoPartitionKey, productId, 0);
            } else {
                console.log(`Error: maybe productId=${productId} doesn't exist. Exit.`);
                core.setFailed(error.message); // Properly log the error message and fail the action
            }
        } else {
            console.log('Failed to increment');
        }
    }
}

async function get(dynamoTableName, dynamoPartitionKey, productId) {
    try {
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

async function set(dynamoTableName, dynamoPartitionKey, productId, value) {
    try {
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
    const dynamoTableName = core.getInput('DYNAMO_TABLE_NAME');
    const dynamoPartitionKey = core.getInput('DYNAMO_PARTITION_KEY');
    const productId = core.getInput('PRODUCT_ID');

    const op = core.getInput('OPERATION');
    switch (op) {
        case "increment":
            await increment(dynamoTableName, dynamoPartitionKey, productId);
            break;
        case "get":
            await get(dynamoTableName, dynamoPartitionKey, productId);
            break;
        case "set":
            const value = core.getInput('VALUE');
            await set(dynamoTableName, dynamoPartitionKey, productId, value);
            break;
        default:
            core.setFailed("OPERATION must be one of [set | increment]")
    }
}

async function mainDebug() {
    const dynamoTableName = "build-numbers"
    const dynamoPartitionKey = "product-id"
    const productId = "My New Product"
    // const value = "77";

    increment(dynamoTableName, dynamoPartitionKey, productId);
}

main();

module.exports = { increment, get, set, main };
