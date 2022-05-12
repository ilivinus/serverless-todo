"use strict";
import type {
  ValidatedGetEventAPIGatewayProxyEvent,
  ValidatedPostEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import {
  formatJSONOkResponse,
  formatJSONErrorResponse,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import validator from "@middy/validator";
import createSchema, { createValidationSchema } from "./schema/create.schema";
import querySchema, { queryValidationSchema } from "./schema/query.schema";
import updateSchema, { updateValidationSchema } from "./schema/update.schema";
import { TodoRepository } from "./todo.repository";
import { TodoService } from "./todo.service";
import { errorMiddleware } from "@libs/error-middleware";

/**
 * CRUD operation on todo
 * @param event
 * @returns
 */
//===================================
// Initialization of repo and service
//===================================
const dynamoDB = new DynamoDB.DocumentClient();
const todoRepository = new TodoRepository(
  dynamoDB,
  process.env.DYNAMODB_TODO_TABLE
);
const todoService = new TodoService(todoRepository);
//===================================
// End
//===================================

const createHandler: ValidatedPostEventAPIGatewayProxyEvent<
  typeof createSchema
> = async (event) => {
  try {
    const todo = await todoService.newTodo(event.body.label);
    return formatJSONOkResponse({ todo });
  } catch (e) {
    return formatJSONErrorResponse(e.message);
  }
};

export const create = middyfy(createHandler)
  .use(validator({ inputSchema: createValidationSchema }))
  .use(errorMiddleware());

const getHandler: ValidatedGetEventAPIGatewayProxyEvent<
  typeof querySchema
> = async (event) => {
  try {
    const todo = await todoService.find(event.pathParameters.id);
    return formatJSONOkResponse({ todo });
  } catch (e) {
    return formatJSONErrorResponse(e.message);
  }
};

export const get = middyfy(getHandler)
  .use(validator({ inputSchema: queryValidationSchema }))
  .use(errorMiddleware());

const updateHandler: ValidatedPostEventAPIGatewayProxyEvent<
  typeof updateSchema
> = async (event) => {
  try {
    const todo = await todoService.update(
      event.body.id,
      event.body.completed ? (event.body.completed as boolean) : undefined,
      event.body.label ? (event.body.label as string) : undefined
    );
    return formatJSONOkResponse({ todo });
  } catch (e) {
    return formatJSONErrorResponse(e.message);
  }
};
export const update = middyfy(updateHandler)
  .use(validator({ inputSchema: updateValidationSchema }))
  .use(errorMiddleware());

const deleteHandler: ValidatedGetEventAPIGatewayProxyEvent<
  typeof querySchema
> = async (event) => {
  try {
    const todo = await todoService.remove(event.pathParameters.id);
    return formatJSONOkResponse({ todo });
  } catch (e) {
    return formatJSONErrorResponse(e.message);
  }
};
export const remove = middyfy(deleteHandler)
  .use(validator({ inputSchema: queryValidationSchema }))
  .use(errorMiddleware());

const listHandler = async () => {
  try {
    const todos = await todoService.list();
    return formatJSONOkResponse({ todos });
  } catch (e) {
    return formatJSONErrorResponse(e.message);
  }
};
export const list = middyfy(listHandler);
