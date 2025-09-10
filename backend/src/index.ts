import express from "express";
import cors from "cors"; // ✅ import cors
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import healthRouter from "./routes/health";
import metricsRouter, { metricsMiddleware } from "./routes/metrics";
import { logRequests } from "./middleware/logger";
import { apiLimiter } from "./middleware/rateLimit";

export function createApp() {
  const app = express();
  app.use(express.json());

  // ✅ Add CORS before your routes
  app.use(
    cors({
      origin: ["http://localhost:8080"], // frontend dev server (Vite)
      credentials: true, // allow cookies/authorization headers
    })
  );

  app.use(logRequests);
  app.use(apiLimiter);
  app.use(metricsMiddleware);

  app.use("/auth", authRouter);
  app.use("/admin", adminRouter);
  app.use("/user", userRouter);
  app.use("/", healthRouter);
  app.use("/", metricsRouter);

  return app;
}

// Only start if run directly
if (require.main === module) {
  const app = createApp();
  app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
  });
}
