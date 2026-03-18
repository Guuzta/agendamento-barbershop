import express from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

import healthRoutes from "./routes/healthRoutes";
import userRoutes from "./routes/userRoutes";

import errorHandler from "./middlewares/errorHandler";

class App {
  app = express();

  startServer(): void {
    this.app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}...`);
    });
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
  }

  errorHandler(): void {
    this.app.use(errorHandler);
  }
}

const app = new App();

app.startServer();
