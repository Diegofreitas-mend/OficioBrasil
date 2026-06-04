// Serverless function da Vercel: reexporta o app Express como handler.
// Todas as rotas /api/* são roteadas pra cá via rewrite no vercel.json.
import app from '../backend/app.js';

export default app;
