const updateSchema = {
  type: "object",
  anyOf: [
    {
      properties: {
        id: { type: "string" },
        completed: { type: "boolean" },
      },
      required: ["id", "completed"],
    },
    {
      properties: {
        id: { type: "string" },
        label: { type: "string", minLength: 3 },
      },
      required: ["id", "label"],
    },
    {
      properties: {
        id: { type: "string" },
        completed: { type: "boolean" },
        label: { type: "string", minLength: 3 },
      },
      required: ["id", "completed", "label"],
    },
  ],
} as const;
export default updateSchema;
export const updateValidationSchema = {
  type: "object",
  properties: {
    body: updateSchema,
  },
} as const;
