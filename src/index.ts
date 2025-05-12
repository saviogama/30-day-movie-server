import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { checkApiKey } from './middlewares/checkAPIKey';
import { checkOrigin } from './middlewares/checkOrigin';
import { errorHandler } from './middlewares/errorHandler';
import openaiRoutes from './routes/openai';
import tmdbRoutes from './routes/tmdb';
import { limiter } from './utils/rateLimit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', checkOrigin, checkApiKey, limiter, tmdbRoutes);
app.use('/api', checkOrigin, checkApiKey, limiter, openaiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
