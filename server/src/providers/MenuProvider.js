import { pool } from '../db/pool.js';

export class MenuProvider {
  async getTodayLunchMenu(date = new Date()) {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const { rows } = await pool.query(
      `select id, menu_date, day_of_week, meal_type, items, notes
         from menus
        where meal_type = 'lunch'
          and (menu_date = $1::date or (menu_date is null and day_of_week = $2))
        order by menu_date nulls last
        limit 1`,
      [date.toISOString().slice(0, 10), dayOfWeek],
    );

    return rows[0] || null;
  }

  async getWeeklyLunchMenu() {
    const { rows } = await pool.query(
      `select id, menu_date, day_of_week, meal_type, items, notes
         from menus
        where meal_type = 'lunch'
        order by sort_order asc, menu_date asc nulls last`,
    );

    return rows;
  }
}
