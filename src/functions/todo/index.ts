import { handlerPath } from "@libs/handler-resolver";

export default {
  createTodo: {
    handler: `${handlerPath(__dirname)}/todo.handler.create`,
    events: [
      {
        httpApi: {
          method: "post",
          path: "/todo",
        },
      },
    ],
  },
  getTodo: {
    handler: `${handlerPath(__dirname)}/todo.handler.get`,
    events: [
      {
        httpApi: {
          method: "get",
          path: "/todo/{id}",
        },
      },
    ],
  },
  updateTodo: {
    handler: `${handlerPath(__dirname)}/todo.handler.update`,
    events: [
      {
        httpApi: {
          method: "patch",
          path: "/todo",
        },
      },
    ],
  },
  deleteTodo: {
    handler: `${handlerPath(__dirname)}/todo.handler.remove`,
    events: [
      {
        httpApi: {
          method: "delete",
          path: "/todo/{id}",
        },
      },
    ],
  },
  listTodo: {
    handler: `${handlerPath(__dirname)}/todo.handler.list`,
    events: [
      {
        httpApi: {
          method: "get",
          path: "/todo",
        },
      },
    ],
  },
};
