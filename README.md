<p align="center">
  <a href="https://github.com:ohthepain/action-install-aws-cli"><img alt="GitHub Actions status" src="https://github.com/ohthepain/action-install-aws-cli/workflows/master%20builds/badge.svg"></a>
</p>

# global-build-numbers

A GitHub Action to bump/store/retrieve build numbers. They are stored in DynamoDB and can be retrieved from any workflow.

Sometimes you need version numbers to be unique across multiple branches and forks. For example, we build configurations that need to have globally unique ids across all of our games and branches.

You can manage multiple version sequences by giving them your own product id strings.

## Supported Platforms
- windows-latest
- macos-latest
- ubuntu-latest

To considering adding: ubuntu-16.04, windows-2016, windows-2019, macOS-10.14, ubuntu-18.04

## Usage

Example
````yaml
name: Bump Version Test

on:
  push
jobs:
  buildSomething:
    runs-on: ubuntu-latest
    steps:
      - uses: ohthepain/global-build-numbers@main
      # All commands after this point have access to the AWS CLI
      - run: aws s3 ls
        env:
            AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
            AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
            AWS_DEFAULT_REGION: ${{ secrets.AWS_DEFAULT_REGION }}
            DYNAMO_TABLE_NAME: "global-build-numbers"
            DYNAMO_KEY_NAME: "project-name"
            PRODUCT_ID: "yoga-config-number"
````
