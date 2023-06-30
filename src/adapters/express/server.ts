import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { userRoutes } from "./routes";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.use(userRoutes);

const { PORT } = process.env;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`);
});
