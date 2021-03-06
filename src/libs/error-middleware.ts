/**
 * Modification of middy/http-error-handler package
 * @param response
 * @returns
 */

const normalizeHttpResponse = (response) => {
  let _response$headers, _response;

  // May require updating to catch other types
  if (response === undefined) {
    response = {};
  } else if (
    Array.isArray(response) ||
    typeof response !== "object" ||
    response === null
  ) {
    response = {
      body: response,
    };
  }

  response.headers =
    (_response$headers =
      (_response = response) === null || _response === void 0
        ? void 0
        : _response.headers) !== null && _response$headers !== void 0
      ? _response$headers
      : {};
  return response;
}; // smaller version of `http-errors`
const jsonSafeParse = (string, reviver?: any) => {
  if (typeof string !== "string") return string;
  const firstChar = string[0];
  if (firstChar !== "{" && firstChar !== "[" && firstChar !== '"')
    return string;

  try {
    return JSON.parse(string, reviver);
  } catch (e) {}

  return string;
};
const defaults = {
  logger: console.error,
  fallbackMessage: null,
};
///modified http-error-handler
export const errorMiddleware = (opts = {}) => {
  const options = { ...defaults, ...opts };
  const httpErrorHandlerMiddlewareOnError = async (request) => {
    let _request$error,
      _request$error2,
      _request$error3,
      _request$error4,
      _request$error5;

    if (typeof options.logger === "function") {
      options.logger(request.error);
    } // Set default expose value, only passes in when there is an override

    if (
      (_request$error = request.error) !== null &&
      _request$error !== void 0 &&
      _request$error.statusCode &&
      ((_request$error2 = request.error) === null || _request$error2 === void 0
        ? void 0
        : _request$error2.expose) === undefined
    ) {
      request.error.expose = request.error.statusCode < 500;
    } // Non-http error OR expose set to false

    if (
      options.fallbackMessage &&
      (!(
        (_request$error3 = request.error) !== null &&
        _request$error3 !== void 0 &&
        _request$error3.statusCode
      ) ||
        !(
          (_request$error4 = request.error) !== null &&
          _request$error4 !== void 0 &&
          _request$error4.expose
        ))
    ) {
      request.error = {
        statusCode: 500,
        message: options.fallbackMessage,
        expose: true,
      };
    }

    if (
      (_request$error5 = request.error) !== null &&
      _request$error5 !== void 0 &&
      _request$error5.expose
    ) {
      let _request$error6, _request$error7;

      request.response = normalizeHttpResponse(request.response);
      request.response.statusCode =
        (_request$error6 = request.error) === null || _request$error6 === void 0
          ? void 0
          : _request$error6.statusCode;
      request.response.body =
        (_request$error7 = request.error) === null || _request$error7 === void 0
          ? void 0
          : JSON.stringify({
              status: "error",
              errors: _request$error7.details.map((error) => ({
                detail: error.message,
                meta: error.params,
              })),
            });
      request.response.headers["Content-Type"] =
        typeof jsonSafeParse(request.response.body) === "string"
          ? "text/plain"
          : "application/json";
      return request.response;
    }
  };

  return {
    onError: httpErrorHandlerMiddlewareOnError,
  };
};
