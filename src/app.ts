import express from "express";
import dotenv from "dotenv";

dotenv.config();

import "./config/env";

import healthRoutes from "./routes/healthRoutes";
import userRoutes from "./routes/userRoutes";
import barberRoutes from "./routes/barberRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import adminRoutes from "./routes/adminRoutes";

import errorHandler from "./middlewares/errorHandler";

class App {
  app = express();

  startServer(): void {
    this.middlewares();
    this.routes();
    this.errorHandler();
  }

  middlewares(): void {
    this.app.use(express.json());
  }

  routes(): void {
    this.app.use("/", healthRoutes);
    this.app.use("/users", userRoutes);
    this.app.use("/barbers", barberRoutes);
    this.app.use("/appointments", appointmentRoutes);
    this.app.use("/admin", adminRoutes);
  }

  errorHandler(): void {
    this.app.use(errorHandler);
  }
}

const appServer = new App();
const app = appServer.app;

appServer.startServer();

export default app;
