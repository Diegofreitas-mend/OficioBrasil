import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

router.get('/', (_req, res) => {
  const reviews = JSON.parse(readFileSync(join(__dirname, '../data/reviews.json'), 'utf-8'));
  res.json(reviews);
});

export { router };
