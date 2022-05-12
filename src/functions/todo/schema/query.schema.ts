const querySchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
} as const;
export default querySchema;

export const queryValidationSchema = {
  type: "object",
  properties: {
    path: querySchema,
  },
};
