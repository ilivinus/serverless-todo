import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedPostAPIGatewayProxyEvent<S> = Omit<
  APIGatewayProxyEvent,
  "body"
> & {
  body: FromSchema<S>;
};
type ValidatedGetAPIGatewayProxyEvent<S> = Omit<
  APIGatewayProxyEvent,
  "pathParameters"
> & {
  pathParameters: FromSchema<S>;
};
export type ValidatedGetEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedGetAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;
export type ValidatedPostEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedPostAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;
const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
};
export const formatJSONOkResponse = (response: Record<string, unknown>) =>
  formatJSONResponse({ status: "success", data: response });
export const formatJSONErrorResponse = (message: string) => ({
  statusCode: 500,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    status: "error",
    message,
  }),
});
