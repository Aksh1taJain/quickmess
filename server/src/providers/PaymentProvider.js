import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env.js';

export class PaymentProvider {
  constructor() {
    this.client = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    });
  }

  async createOrder({ amountInRupees, receipt }) {
    if (env.razorpayKeyId === 'rzp_test_dummy') {
      return {
        id: `order_test_${Date.now()}`,
        amount: amountInRupees * 100,
        currency: 'INR',
        receipt,
        testMode: true,
      };
    }

    return this.client.orders.create({
      amount: amountInRupees * 100,
      currency: 'INR',
      receipt,
    });
  }

  verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    if (env.razorpayKeySecret === 'dummy_secret' && razorpaySignature === 'test_signature') {
      return true;
    }

    const expectedSignature = crypto
      .createHmac('sha256', env.razorpayKeySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }
}
