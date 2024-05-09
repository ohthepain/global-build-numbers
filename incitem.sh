aws dynamodb update-item --table-name build-numbers --key '{"product-id":{"S":"My Product"}}' \
    --update-expression "SET VERSION = VERSION + :incr" \
    --expression-attribute-values '{":incr":{"N":"1"}}' \
    --return-values UPDATED_NEW --region eu-central-1 --output text | awk '{print $2}'

