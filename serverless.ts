import type { AWS } from "@serverless/typescript";
import { handlerPath } from "@libs/handler-resolver";

const serverlessConfiguration: AWS = {
  org: "ilivinus",
  app: "aws-todo-http-api",
  service: "aws-todo-http-api",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      DYNAMODB_TODO_TABLE: "${self:service}-${sls:stage}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Scan",
              "dynamodb:Query",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource:
              "arn:aws:dynamodb:${aws:region}:*:table/${self:provider.environment.DYNAMODB_TODO_TABLE}",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    createTodo: {
      handler: `${handlerPath(__dirname)}/src/todo/todo.handler.create`,
      events: [
        {
          httpApi: {
            method: "post",
            path: "todo",
          },
        },
      ],
    },
    getTodo: {
      handler: `${handlerPath(__dirname)}/src/todo/todo.handler.get`,
      events: [
        {
          httpApi: {
            method: "get",
            path: "todo/{id}",
          },
        },
      ],
    },
    updateTodo: {
      handler: `${handlerPath(__dirname)}/src/todo/todo.handler.update`,
      events: [
        {
          httpApi: {
            method: "update",
            path: "todo",
          },
        },
      ],
    },
    deleteTodo: {
      handler: `${handlerPath(__dirname)}/src/todo/todo.handler.remove`,
      events: [
        {
          httpApi: {
            method: "delete",
            path: "todo/{id}",
          },
        },
      ],
    },
    listTodo: {
      handler: `${handlerPath(__dirname)}/src/todo/todo.handler.list`,
      events: [
        {
          httpApi: {
            method: "get",
            path: "todo",
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      TodoTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.DYNAMODB_TODO_TABLE}",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
            {
              AttributeName: "updatedAt",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            { AttributeName: "id", KeyType: "HASH" },
            { AttributeName: "updatedAt", KeyType: "RANGE" },
          ],
          ProvisionedThroughput: {
            WriteCapacityUnits: 1,
            ReadCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
