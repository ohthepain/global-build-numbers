aws dynamodb put-item --table-name build-numbers --item '{"product-id": {"S": "My Product"}, "VERSION": {"N": "1"} }'

aws dynamodb put-item --table-name build-numbers --item "'{"product-id": {"S": "my game"}, "VERSION": {"N": "1"} }'"