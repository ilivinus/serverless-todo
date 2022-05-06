export default {
  type: "object",
  properties: {
    label: { type: "string" },
  },
  required: ["label"],
} as const;
// id: string<uuid>, label: string, completed: boolean, createdAt: string<date>, updatedAt: string<date>
