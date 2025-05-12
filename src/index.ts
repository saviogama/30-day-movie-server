import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
import openaiRoutes from './routes/openai';
import tmdbRoutes from './routes/tmdb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', tmdbRoutes);
app.use(
  '/api',
  openaiRoutes,
  rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too much requests. Try again soon.',
  })
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
