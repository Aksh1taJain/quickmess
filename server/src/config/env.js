import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  collegeApiBaseUrl: process.env.COLLEGE_API_BASE_URL || '',
};
