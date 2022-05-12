const createSchema = {
  type: "object",
  properties: {
    label: { type: "string", minLength: 3 },
  },
  required: ["label"],
} as const;

export default createSchema;

export const createValidationSchema = {
  type: "object",
  properties: {
    body: createSchema,
  },
};
