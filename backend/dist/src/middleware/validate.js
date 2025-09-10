"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse({ ...req.params, ...req.body, ...req.query });
            next();
        }
        catch (err) {
            return res.status(400).json({
                error: {
                    code: "BAD_REQUEST",
                    message: err.errors?.[0]?.message || err.message,
                },
            });
        }
    };
}
//# sourceMappingURL=validate.js.map