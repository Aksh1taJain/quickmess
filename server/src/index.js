import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import adminRoutes from './routes/admin.js';
import menuRoutes from './routes/menu.js';
import ticketRoutes from './routes/tickets.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'QuickMess API' });
});

app.use('/api/menu', menuRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`QuickMess API running on port ${env.port}`);
});
