"use-strict";
import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid";
import { Todo } from "./dto/todo.dto";
import { ITodoRepository } from "./interface/todo-repository.interface";
/**
 * new TodoRepository(
  new DynamoDB.DocumentClient(),
  process.env.DYNAMODB_TODO_TABLE
);
 */
export class TodoRepository implements ITodoRepository {
  private dynamoDb: DynamoDB.DocumentClient;

  private DB_TABLE: string;
  constructor(dynamo: DynamoDB.DocumentClient, table: string) {
    this.dynamoDb = dynamo;
    this.DB_TABLE = table;
  }
  async create(label: string) {
    const timestamp = new Date();
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.DB_TABLE,
      Item: {
        id: uuid.v4(),
        completed: false,
        label,
        updatedAt: timestamp,
        createdAt: timestamp,
      },
      ReturnValues: "ALL_NEW",
    };
    await this.dynamoDb.put(params).promise();
    return params.Item as Todo;
  }
  async list() {
    const param = {
      TableName: this.DB_TABLE,
    };
    const todos = await this.dynamoDb.query(param).promise();
    return todos.Items as Todo[];
  }
  delete(id: string) {
    const params = {
      TableName: this.DB_TABLE,
      Key: {
        id,
      },
    };
    return this.dynamoDb.delete(params).promise();
  }
  async find(id: string) {
    const params = {
      TableName: this.DB_TABLE,
      Key: {
        id,
      },
    };
    const todo = await this.dynamoDb.get(params).promise();
    return todo.Item as Todo;
  }
  async update(id: string, completed: boolean) {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.DB_TABLE,
      Key: { id },
      UpdateExpression: "SET completed = :c,  updatedAt = :u",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {
        ":c": completed,
        // ":l": label,
        ":u": new Date(),
      },
      ReturnValues: "ALL_NEW",
    };
    const updatedTodo = await this.dynamoDb.update(params).promise();
    return updatedTodo.Attributes as Todo;
  }
}
