import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ error: { message: 'Admin token required' } });
  }

  try {
    req.admin = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: { message: 'Invalid or expired admin token' } });
  }
}
