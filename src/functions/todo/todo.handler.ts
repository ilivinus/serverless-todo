import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

import createSchema from "./schema/create.schema";
import querySchema from "./schema/query.schema";
import updateSchema from "./schema/update.schema";
import { TodoRepository } from "./todo.repository";
import { TodoService } from "./todo.service";

/**
 * CRUD operation on todo
 * @param event
 * @returns
 */
const dynamoDB = new DynamoDB.DocumentClient();
const todoRepository = new TodoRepository(
  dynamoDB,
  process.env.DYNAMODB_TODO_TABLE
);
const todoService = new TodoService(todoRepository);

const createHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof createSchema
> = async (event) => {
  const todo = await todoService.newTodo(event.body.label);
  return formatJSONResponse({
    todo,
    event,
  });
};

export const create = middyfy(createHandler);

const getHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof querySchema
> = async (event) => {
  const todo = await todoService.newTodo(event.pathParameters.id);
  return formatJSONResponse({
    todo,
    event,
  });
};

export const get = middyfy(getHandler);

const updateHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof updateSchema
> = async (event) => {
  const todo = await todoService.update(
    event.body.id,
    event.body.completed ? (event.body.completed as boolean) : undefined,
    event.body.label ? (event.body.label as string) : undefined
  );
  return formatJSONResponse({
    todo,
    event,
  });
};
export const update = middyfy(updateHandler);

const deleteHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof querySchema
> = async (event) => {
  const todo = await todoService.remove(event.pathParameters.id);
  return formatJSONResponse({
    todo,
    event,
  });
};
export const remove = middyfy(deleteHandler);

const listHandler = async (event: APIGatewayProxyEvent) => {
  const todos = await todoService.list();
  return formatJSONResponse({
    todos,
    event,
  });
};
export const list = middyfy(listHandler);
