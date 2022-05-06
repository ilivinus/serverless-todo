export default {
  type: "object",
  properties: {
    id: { type: "string" },
    completed: { type: "boolean" },
    label: { type: "string" },
  },
  required: ["completed", "label", "id"],
} as const;
