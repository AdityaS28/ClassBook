"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = exports.metrics = void 0;
const express_1 = require("express");
exports.metrics = {
    requestCount: 0,
};
const metricsMiddleware = (req, res, next) => {
    exports.metrics.requestCount++;
    next();
};
exports.metricsMiddleware = metricsMiddleware;
const router = (0, express_1.Router)();
router.get("/metrics", (req, res) => {
    res.json(exports.metrics);
});
exports.default = router;
//# sourceMappingURL=metrics.js.map