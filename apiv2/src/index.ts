import express from 'express';
import { config } from 'dotenv';
import router from './routes';
import errorHandler from './middleware/errorHandler';

config({ override: true });

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
});

