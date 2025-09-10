"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionIdParamSchema = void 0;
const zod_1 = require("zod");
// Validate sessionId in route params
exports.sessionIdParamSchema = zod_1.z.object({
    sessionId: zod_1.z.string().regex(/^\d+$/, "sessionId must be a number"),
});
//# sourceMappingURL=booking.js.map