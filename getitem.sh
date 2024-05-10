# aws dynamodb put-item --table-name build-numbers --item "'{"product-id": {"S": "my game"}, "VERSION": {"N": "1"} }'"
aws dynamodb get-item --table-name build-numbers --key '{"product-id": {"S": "my game"}}'
aws dynamodb get-item --table-name build-numbers --key '{"product-id": {"S": "My Product"}}'