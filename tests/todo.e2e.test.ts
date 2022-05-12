import * as assert from "assert";
import { getApiGatewayUrl } from "serverless-plugin-test-helper";
import * as supertest from "supertest";

const DEPLOYED_API_URL = getApiGatewayUrl();

describe("Todo e2e Tests", function () {
  //increase timeout each run takes average of 2000ms which is above the default timeout
  this.timeout(5000);

  const request = supertest.agent(DEPLOYED_API_URL);

  it("#Create Todo:  /todo  POST | should create the todo when payload is good", function () {
    const testTodo = "new test todo";
    return request
      .post("/todo")
      .send({ label: testTodo })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body }) => {
        assert.strictEqual(body.data.todo.label, testTodo);
      });
  });

  it("#Create Todo:  /todo  POST | should fail to create if incorrect payload is passed", function () {
    return request
      .post("/todo")
      .send({ labelQ: "new test todo" })
      .expect("Content-Type", /json/)
      .expect(400)
      .expect(({ body }) => {
        assert.strictEqual(body.status, "error");
      });
  });

  it("#Get Todo:  /todo  GET | should get all todos", function () {
    return request
      .get("/todo")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body }) => {
        assert.strictEqual(body.status, "success");
      });
  });

  it("#GET Todo:  /todo/{id}  GET | should get a specific todo item", async function () {
    const todos = await request
      .get("/todo")
      .then(({ body }) => body.data.todos);

    return request
      .get(`/todo/${todos[0].id}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body }) => {
        assert.strictEqual(body.data.todo.id, todos[0].id);
        //assert.deepStrictEqual(body.data.todo, todos[0]);
      });
  });

  it("#Delete Todo:  /todo/{id}  DELETE | should delete a specific todo item", async function () {
    const todos = await request
      .get("/todo")
      .then(({ body }) => body.data.todos);

    return request
      .delete(`/todo/${todos[0].id}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body }) => {
        assert.deepStrictEqual(body.data.todo, {});
      });
  });

  it("#Update Todo:  /todo  PATCH | should update a specific todo item label", async function () {
    const todos = await request
      .get("/todo")
      .then(({ body }) => body.data.todos);
    const newLabel = "e2e new label";
    return request
      .patch("/todo")
      .send({ id: todos[0].id, label: newLabel })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body }) => {
        assert.strictEqual(body.status, "success");
        assert.strictEqual(body.data.todo.id, todos[0].id);
        assert.deepStrictEqual(body.data.todo.label, newLabel);
        assert.notStrictEqual(body.data.todo.updatedAt, todos[0].updatedAt);
      });
  });

  it("#Update Todo:  /todo  PATCH | should update a specific todo item completed attribute", async function () {
    const todos = await request
      .get("/todo")
      .then(({ body }) => body.data.todos);
    const newCompleted = true;
    return request
      .patch("/todo")
      .send({ id: todos[0].id, completed: newCompleted })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body }) => {
        assert.strictEqual(body.status, "success");
        assert.strictEqual(body.data.todo.id, todos[0].id);
        assert.deepStrictEqual(body.data.todo.completed, newCompleted);
        assert.notStrictEqual(body.data.todo.updatedAt, todos[0].updatedAt);
      });
  });

  it("#Update Todo:  /todo  PATCH | should update  label and completed attribute on a specific todo item", async function () {
    const todos = await request
      .get("/todo")
      .then(({ body }) => body.data.todos);
    const newCompleted = true;
    const newLabel = "Label and completed updating";
    return request
      .patch("/todo")
      .send({ id: todos[0].id, completed: newCompleted, label: newLabel })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body }) => {
        assert.strictEqual(body.status, "success");
        assert.strictEqual(body.data.todo.id, todos[0].id);
        assert.deepStrictEqual(body.data.todo.completed, newCompleted);
        assert.strictEqual(body.data.todo.label, newLabel);
        assert.notStrictEqual(body.data.todo.updatedAt, todos[0].updatedAt);
      });
  });

  it("#Update Todo:  /todo  PATCH | should fail on supplying payload with only attribute for todo update", async function () {
    const todos = await request
      .get("/todo")
      .then(({ body }) => body.data.todos);

    return request
      .patch("/todo")
      .send({ id: todos[0].id })
      .expect("Content-Type", /json/)
      .expect(400)
      .expect(({ body }) => {
        assert.strictEqual(body.status, "error");
      });
  });
});
