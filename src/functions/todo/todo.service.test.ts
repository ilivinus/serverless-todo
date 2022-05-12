import * as assert from "assert";
import * as sinon from "sinon";
import { AWSError, DynamoDB, Request } from "aws-sdk";
import { TodoService } from "./todo.service";
import { TodoRepository } from "./todo.repository";
import { Todo } from "./dto/todo.dto";
const dbReturnValue = (returnValue: any) => {
  return {
    promise() {
      return returnValue;
    },
  } as unknown as Request<DynamoDB.GetItemOutput, AWSError>;
};
const getItemFixture: { Item: Todo } = {
  Item: {
    id: "never_say_never",
    label: "Check out ASCII",
    completed: true,
    updatedAt: new Date(2022, 2, 28),
    createdAt: new Date(2022, 2, 28),
  },
};
const listItemFixture: { Items: Todo[] } = {
  Items: [
    {
      id: "never_say_never",
      label: "Check out ASCII",
      completed: true,
      updatedAt: new Date(2022, 2, 28),
      createdAt: new Date(2022, 2, 28),
    },
    {
      id: "say_never_never",
      label: "Check out EBCDIC",
      completed: true,
      updatedAt: new Date(2022, 2, 28),
      createdAt: new Date(2022, 2, 28),
    },
    {
      id: "never_never_say",
      label: "Check out UTF8",
      completed: true,
      updatedAt: new Date(2022, 2, 28),
      createdAt: new Date(2022, 2, 28),
    },
  ],
};
const updateFixture: { Attributes: Todo } = { Attributes: getItemFixture.Item };

describe("Todo", () => {
  const dynamoDB = new DynamoDB.DocumentClient();
  const TableName = "test-table";
  let todoService = new TodoService(new TodoRepository(dynamoDB, TableName));

  let sinonSandbox: sinon.SinonSandbox;
  let updateSpy: sinon.SinonSpy<
    [
      params: DynamoDB.DocumentClient.UpdateItemInput,
      callback?: (
        err: AWSError,
        data: DynamoDB.DocumentClient.UpdateItemOutput
      ) => void
    ],
    Request<DynamoDB.DocumentClient.UpdateItemOutput, AWSError>
  >;
  beforeEach(() => {
    sinonSandbox = sinon.createSandbox();

    sinonSandbox
      .stub(DynamoDB.DocumentClient.prototype, "put")
      .returns(dbReturnValue(getItemFixture));

    sinonSandbox
      .stub(DynamoDB.DocumentClient.prototype, "get")
      .withArgs({ Key: { id: "never_say_never" }, TableName: TableName })
      .returns(dbReturnValue(getItemFixture));
    sinonSandbox
      .stub(DynamoDB.DocumentClient.prototype, "scan")
      .returns(dbReturnValue(listItemFixture));

    updateSpy = sinonSandbox
      .stub(DynamoDB.DocumentClient.prototype, "update")
      .returns(dbReturnValue(updateFixture));

    sinonSandbox
      .stub(DynamoDB.DocumentClient.prototype, "delete")
      .returns(dbReturnValue(getItemFixture));
  });
  afterEach(() => {
    sinonSandbox.restore();
    updateSpy.restore();
  });
  describe("#find(id:string)", () => {
    it("should return item when called with existing id", async () => {
      const todo = await todoService.find("never_say_never");
      assert.strictEqual(todo, getItemFixture.Item);
    });
  });
  describe("#list()", () => {
    it("should return 3 items ", async () => {
      const todos = await todoService.list();

      assert.strictEqual(todos.length, 3);
    });
  });
  describe("#newTodo(label:string)", () => {
    it("should return todo with same label on creation", () => {
      const actual = "go to moon";
      todoService.newTodo(actual).then((todo) => {
        assert.strictEqual(todo.label, actual);
        assert.strictEqual(todo.completed, true);
      });
    });
  });
  describe("#remove(id:string)", () => {
    it("should delete item and return response", async () => {
      const response = await todoService.remove("never_say_never");
      assert.strictEqual(response, getItemFixture);
    });
  });
  describe("#update(id:string,label:string|undefined,completed:boolean|undefined)", () => {
    it("Should return appropriate arguement without label", async () => {
      await todoService.update("never_say_never", true);
      const expectedArg: DynamoDB.DocumentClient.UpdateItemInput = {
        ExpressionAttributeNames: {
          "#completed": "completed",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":c": true,
        },
        Key: { id: "never_say_never" },
        ReturnValues: "ALL_NEW",
        TableName: TableName,
        UpdateExpression: `set #updatedAt = :u, #completed = :c`,
      };
      //remove since new date is always created in update repo
      delete expectedArg.ExpressionAttributeValues[":u"];
      delete updateSpy.args[0][0].ExpressionAttributeValues[":u"];

      assert.strictEqual(updateSpy.calledOnce, true);
      assert.deepStrictEqual(updateSpy.args[0][0], expectedArg);
    });
    it("Should return appropriate arguement", async () => {
      const todo = await todoService.update(
        "never_say_never",
        undefined,
        "new note"
      );
      const expectedArg: DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: TableName,
        Key: { id: "never_say_never" },
        UpdateExpression: `set #updatedAt = :u, #label = :l`,
        ExpressionAttributeNames: {
          "#label": "label",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":u": todo.updatedAt,
          ":l": "new note",
        },
        ReturnValues: "ALL_NEW",
      };
      //remove since new date is always created in update repo
      delete expectedArg.ExpressionAttributeValues[":u"];
      delete updateSpy.args[0][0].ExpressionAttributeValues[":u"];

      assert.strictEqual(updateSpy.calledOnce, true);
      assert.deepStrictEqual(updateSpy.args[0][0], expectedArg);
    });
  });
});
