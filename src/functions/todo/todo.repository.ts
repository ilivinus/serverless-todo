"use-strict";
import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid";
/**
 * new TodoRepository(
  new DynamoDB.DocumentClient(),
  process.env.DYNAMODB_TODO_TABLE
);
 */
export class TodoRepository {
  private dynamoDb: DynamoDB.DocumentClient;

  private DB_TABLE: string;
  constructor(dynamo: DynamoDB.DocumentClient, table: string) {
    this.dynamoDb = dynamo;
    this.DB_TABLE = table;
  }
  create(label: string) {
    const timestamp = new Date();
    const params = {
      TableName: this.DB_TABLE,
      Item: {
        id: uuid.v4(),
        completed: false,
        label,
        updatedAt: timestamp,
        createdAt: timestamp,
      },
    };
    return this.dynamoDb.put(params).promise();
  }
  list() {
    const param = {
      TableName: this.DB_TABLE,
    };
    return this.dynamoDb.query(param).promise();
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
  find(id: string) {
    const params = {
      TableName: this.DB_TABLE,
      Key: {
        id,
      },
    };
    return this.dynamoDb.get(params).promise();
  }
  update(id: string, label: string, completed: boolean) {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.DB_TABLE,
      Key: { id },
      UpdateExpression: "SET completed = :c, label = :l, updatedAt = :u",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {
        ":c": completed,
        ":l": label,
        ":u": new Date(),
      },
    };
    return this.dynamoDb.update(params).promise();
  }
}
