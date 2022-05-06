export default {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["completed", "label", "id"],
  anyOf: [
    {
      properties: {
        completed: { type: "boolean" },
      },
      required: ["completed"],
    },
    {
      properties: {
        label: { type: "string" },
      },
      required: ["label"],
    },
  ],
} as const;
