# Overview

This is an assessment on simple todo list application using serverless framework.
This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Test your service

### Unit test Locally

Run either of the following to run the unit test

- `yarn test`
- `npm run test`

## e2e test

Run either of the following locally to run the e2e test after deployment

- `yarn test:e2e`
- `npm run test:e2e`

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

From the last deployment the deployed application can be tested at the endpoints

- POST - https://l2m0pgjq77.execute-api.us-east-1.amazonaws.com/todo
- GET - https://l2m0pgjq77.execute-api.us-east-1.amazonaws.com/todo/{id}
- PATCH - https://l2m0pgjq77.execute-api.us-east-1.amazonaws.com/todo
- DELETE - https://l2m0pgjq77.execute-api.us-east-1.amazonaws.com/todo/{id}
- GET - https://l2m0pgjq77.execute-api.us-east-1.amazonaws.com/todo

### Retionale for project structure decision

- The project structure was adopted to enhance smooth unit testing
- The project structure also introduces modularity which will lead to clarity as the project scales.
