import { Router } from 'express';
import { MenuProvider } from '../providers/MenuProvider.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const menuProvider = new MenuProvider();

router.get('/today', asyncHandler(async (_req, res) => {
  const menu = await menuProvider.getTodayLunchMenu();
  res.json({ data: menu });
}));

router.get('/week', asyncHandler(async (_req, res) => {
  const menus = await menuProvider.getWeeklyLunchMenu();
  res.json({ data: menus });
}));

export default router;
