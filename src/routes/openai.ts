import { Request, Response, Router } from 'express';
import { OpenAI } from 'openai';

const router = Router();

interface RecommendationsBody {
  movieTitles: string[];
  language: string;
}

router.post(
  '/recommendations',
  async (req: Request<{}, {}, RecommendationsBody>, res: Response) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { movieTitles, language } = req.body;

    if (!Array.isArray(movieTitles) || typeof language !== 'string') {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    const prompt = `
Baseado nestes filmes: ${JSON.stringify(
      movieTitles
    )}, gere um array JSON com 30 filmes semelhantes.
Sem explicações. Apenas o array. ${
      language === 'en' ? 'Respond in English.' : 'Responda em Português.'
    }
  `.trim();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
    });

    const content = response.choices[0].message?.content ?? '[]';
    const match = content.match(/\[.*\]/s);
    const recommendations = match ? JSON.parse(match[0]) : [];

    res.json({ recommendations });
  }
);

export default router;
