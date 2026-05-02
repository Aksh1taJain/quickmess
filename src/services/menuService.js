// ─────────────────────────────────────────────
// menuService.js
// Replace all mock data with college API later:
//   GET /api/menu/today
//   GET /api/menu/week
//   GET /api/menu/month
// ─────────────────────────────────────────────

const todayMenu = {
  breakfast: [
    { name: 'Idli Sambhar', desc: '4 pcs + Chutney' },
    { name: 'Boiled Eggs', desc: '2 pcs' },
    { name: 'Bread & Butter', desc: 'Sliced white bread' },
    { name: 'Chai / Milk', desc: '200ml' },
  ],
  lunch: [
    { name: 'Jeera Rice', desc: 'Steamed basmati' },
    { name: 'Dal Tadka', desc: 'Yellow lentil' },
    { name: 'Paneer Butter Masala', desc: 'Cottage cheese curry' },
    { name: 'Roti', desc: '4 pcs whole wheat' },
    { name: 'Salad', desc: 'Cucumber, Tomato, Onion' },
    { name: 'Curd', desc: '100ml' },
  ],
  dinner: [
    { name: 'Chapati', desc: '4 pcs' },
    { name: 'Aloo Sabzi', desc: 'Spiced potato curry' },
    { name: 'Rajma', desc: 'Kidney beans curry' },
    { name: 'Sweet', desc: 'Gulab Jamun (2 pcs)' },
    { name: 'Buttermilk', desc: '200ml' },
  ],
};

const weekMenu = [
  {
    day: 'Monday',
    breakfast: ['Poha, Chai', 'Boiled Eggs'],
    lunch: ['Rice, Dal, Sabzi, Roti', 'Curd, Salad'],
    dinner: ['Chapati, Rajma', 'Sweet, Buttermilk'],
  },
  {
    day: 'Tuesday',
    breakfast: ['Upma, Coconut Chutney', 'Milk'],
    lunch: ['Jeera Rice, Kadhi', 'Roti, Curd'],
    dinner: ['Chapati, Aloo Matar', 'Kheer'],
  },
  {
    day: 'Wednesday',
    breakfast: ['Idli Sambhar', 'Bread Butter, Chai'],
    lunch: ['Pulao, Rajma', 'Raita, Salad'],
    dinner: ['Paratha, Chole', 'Lassi'],
  },
  {
    day: 'Thursday',
    breakfast: ['Dosa, Sambhar', 'Chai'],
    lunch: ['Rice, Palak Dal', 'Roti, Mix Veg'],
    dinner: ['Chapati, Egg Curry', 'Sweet, Rice'],
  },
  {
    day: 'Friday',
    breakfast: ['Puri Bhaji', 'Chai, Milk'],
    lunch: ['Biryani (Veg)', 'Raita, Salad'],
    dinner: ['Chapati, Paneer Curry', 'Ice Cream'],
  },
  {
    day: 'Saturday',
    breakfast: ['Bread Omelette', 'Cornflakes, Milk'],
    lunch: ['Chole Bhature', 'Lassi, Salad'],
    dinner: ['Chapati, Dal Fry', 'Halwa'],
  },
  {
    day: 'Sunday',
    breakfast: ['Aloo Paratha, Curd', 'Chai'],
    lunch: ['Special Biryani', 'Chicken / Paneer, Raita'],
    dinner: ['Butter Naan, Dal Makhani', 'Gulab Jamun'],
  },
];

// TODO: Replace with → fetch('/api/menu/today').then(r => r.json())
export async function getTodayMenu() {
  return todayMenu;
}

// TODO: Replace with → fetch('/api/menu/week').then(r => r.json())
export async function getWeekMenu() {
  return weekMenu;
}
