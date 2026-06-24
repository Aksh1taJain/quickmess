import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { pool } from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';
import { TicketProvider } from '../providers/TicketProvider.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const router = Router();
const ticketProvider = new TicketProvider();

const loginSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(1),
});

async function findOrCreateEnvAdmin(username) {
  const existing = await pool.query('select * from admins where username = $1', [username]);
  if (existing.rows[0]) return existing.rows[0];

  const passwordHash = hashPassword(env.adminPassword);
  const created = await pool.query(
    `insert into admins (username, password_hash, role)
     values ($1, $2, 'staff')
     returning *`,
    [env.adminUsername, passwordHash],
  );

  return created.rows[0];
}

router.post('/login', asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const admin = await findOrCreateEnvAdmin(input.username);

  if (admin.username !== input.username || !verifyPassword(input.password, admin.password_hash)) {
    return res.status(401).json({ error: { message: 'Invalid credentials' } });
  }

  const token = jwt.sign(
    { sub: admin.id, username: admin.username, role: admin.role },
    env.jwtSecret,
    { expiresIn: '8h' },
  );

  return res.json({ data: { token, admin: { username: admin.username, role: admin.role } } });
}));

router.get('/tickets', requireAdmin, asyncHandler(async (_req, res) => {
  const tickets = await ticketProvider.listSoldTickets();
  res.json({ data: tickets });
}));

export default router;
