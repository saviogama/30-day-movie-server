import axios from 'axios';
import express, { Request, Response } from 'express';

const router = express.Router();
const BASE_URL = 'https://api.themoviedb.org/3';

interface SearchQuery {
  query: string;
  language: string;
}

router.get(
  '/search',
  async (req: Request<any, {}, {}, SearchQuery>, res: Response) => {
    const { query, language } = req.query;

    if (!query) {
      res.status(400).json({ error: 'Missing query parameter' });
      return;
    }

    const response = await axios.get(
      'https://api.themoviedb.org/3/search/movie',
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query,
          language,
        },
      }
    );

    res.json(response.data.results);
  }
);

interface WatchProviderParams {
  movieId: string;
}

interface WatchProviderQuery {
  language: string;
}

router.get(
  '/watch-provider/:movieId',
  async (
    req: Request<WatchProviderParams, {}, {}, WatchProviderQuery>,
    res: Response
  ) => {
    const { movieId } = req.params;
    const { language } = req.query;

    if (!movieId || !language || typeof language !== 'string') {
      res.status(400).json({ error: 'Missing movieId or language' });
      return;
    }

    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/watch/providers`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      }
    );

    const providers = response.data.results[language];

    if (providers?.flatrate?.length) {
      const list = providers.flatrate
        .map((p: any) => p.provider_name)
        .join(', ');

      res.json({ providers: list });
      return;
    }

    res.json({ providers: '--' });
  }
);

export default router;
