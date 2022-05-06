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
            path: "todo",
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
            path: "todo",
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
            path: "todos",
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
};

module.exports = serverlessConfiguration;
