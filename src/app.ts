import express from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

import healthRoutes from "./routes/healthRoutes";

class App {
  app = express();

  startServer(): void {
    this.app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}...`);
    });
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes(): void {
    this.app.use("/", healthRoutes);
  }
}

const app = new App();

app.startServer();
