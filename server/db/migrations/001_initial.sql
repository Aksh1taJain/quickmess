create extension if not exists "uuid-ossp";

create table if not exists admins (
  id uuid primary key default uuid_generate_v4(),
  username text not null unique,
  password_hash text not null,
  role text not null default 'staff',
  created_at timestamptz not null default now()
);

create table if not exists menus (
  id uuid primary key default uuid_generate_v4(),
  menu_date date,
  day_of_week text,
  meal_type text not null default 'lunch' check (meal_type = 'lunch'),
  items text[] not null,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint menus_date_or_day_check check (menu_date is not null or day_of_week is not null)
);

create table if not exists tickets (
  id uuid primary key,
  student_name text not null,
  enrollment_number text not null,
  phone text not null,
  lunch_date date not null,
  meal_type text not null default 'lunch' check (meal_type = 'lunch'),
  amount integer not null default 80 check (amount = 80),
  status text not null default 'PENDING' check (status in ('PENDING', 'ACTIVE', 'USED', 'CANCELLED')),
  qr_payload text,
  qr_code_data_url text,
  paid_at timestamptz,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  razorpay_order_id text not null,
  razorpay_payment_id text,
  razorpay_signature text,
  amount integer not null default 80 check (amount = 80),
  status text not null default 'ORDER_CREATED' check (status in ('ORDER_CREATED', 'PAID', 'FAILED')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique(ticket_id, razorpay_order_id)
);

create index if not exists menus_meal_sort_idx on menus(meal_type, sort_order);
create index if not exists tickets_status_created_idx on tickets(status, created_at desc);
create index if not exists payments_ticket_idx on payments(ticket_id);

insert into menus (day_of_week, meal_type, items, notes, sort_order) values
  ('Monday', 'lunch', array['Steamed rice', 'Dal tadka', 'Seasonal sabzi', 'Roti', 'Curd'], 'Balanced homestyle plate', 1),
  ('Tuesday', 'lunch', array['Jeera rice', 'Kadhi pakora', 'Aloo matar', 'Roti', 'Salad'], 'North Indian lunch', 2),
  ('Wednesday', 'lunch', array['Veg pulao', 'Rajma', 'Roti', 'Raita', 'Pickle'], 'Protein-rich rajma plate', 3),
  ('Thursday', 'lunch', array['Plain rice', 'Palak dal', 'Mix veg', 'Roti', 'Buttermilk'], 'Light green lunch', 4),
  ('Friday', 'lunch', array['Veg biryani', 'Paneer curry', 'Raita', 'Salad', 'Sweet'], 'Weekly special', 5),
  ('Saturday', 'lunch', array['Chole', 'Bhature', 'Rice', 'Onion salad', 'Lassi'], 'Weekend favourite', 6),
  ('Sunday', 'lunch', array['Special biryani', 'Paneer masala', 'Dal makhani', 'Naan', 'Gulab jamun'], 'Sunday premium lunch', 7)
on conflict do nothing;
