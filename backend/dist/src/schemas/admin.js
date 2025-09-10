"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionSchema = exports.createClassSchema = void 0;
const zod_1 = require("zod");
// Create Class
exports.createClassSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Class name is required"),
});
// Create Session
exports.createSessionSchema = zod_1.z.object({
    dateTime: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid dateTime",
    }),
    capacity: zod_1.z.number().int().positive("Capacity must be positive"),
});
//# sourceMappingURL=admin.js.map