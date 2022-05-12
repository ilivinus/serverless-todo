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
        updatedAt: timestamp.toISOString(),
        createdAt: timestamp.toISOString(),
      },
      ReturnValues: "ALL_OLD",
    };
    await this.dynamoDb.put(params).promise();
    return <Todo>params.Item;
  }
  async list() {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.DB_TABLE,
      ScanIndexForward: false,
    };
    let scanResults: Todo[] = [];
    let todos: any;

    do {
      todos = await this.dynamoDb.scan(params).promise();
      todos.Items.forEach((item: any) => scanResults.push(item as Todo));
      params.ExclusiveStartKey = todos.LastEvaluatedKey;
    } while (typeof todos.LastEvaluatedKey != "undefined");

    //sort
    return scanResults.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
  async delete(id: string) {
    const params: DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: this.DB_TABLE,
      Key: {
        id,
      },
    };
    return this.dynamoDb.delete(params).promise();
  }
  async find(id: string) {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.DB_TABLE,
      Key: { id },
    };
    const todo = await this.dynamoDb.get(params).promise();
    return <Todo>todo.Item;
  }
  /**
   * Can update completed or label or both attributes
   * @param id
   * @param completed
   * @param label
   * @returns
   */
  async update(
    id: string,
    completed: boolean | undefined,
    label: string | undefined
  ) {
    let expressionAttributeValues: { [key: string]: string | boolean } = {};
    let expressionAttributeNames: { [key: string]: string } = {};
    const updateExpression = [];
    if (completed !== undefined) {
      updateExpression.push("#completed = :c");
      expressionAttributeValues = { ":c": completed };
      expressionAttributeNames = { "#completed": "completed" };
    }
    if (label !== undefined) {
      expressionAttributeValues = { ...expressionAttributeValues, ":l": label };
      expressionAttributeNames = {
        ...expressionAttributeNames,
        "#label": "label",
      };
      updateExpression.push("#label = :l");
    }

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.DB_TABLE,
      Key: { id },
      UpdateExpression: `set #updatedAt = :u, ${updateExpression.join(",")}`,
      ExpressionAttributeNames: {
        ...expressionAttributeNames,
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":u": new Date().toISOString(),
        ...expressionAttributeValues,
      },
      ReturnValues: "ALL_NEW",
    };
    const updatedTodo = await this.dynamoDb.update(params).promise();
    return <Todo>updatedTodo.Attributes;
  }
}
