# global-build-numbers

A GitHub Action to bump/store/retrieve build numbers. They are stored in DynamoDB and can be retrieved from any workflow.

Sometimes you need version numbers to be unique across multiple branches and forks. For example, we build configurations that need to have globally unique ids across all of our games and branches.

You can manage multiple version sequences by giving them your own product id strings.
