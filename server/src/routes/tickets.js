import { Router } from 'express';
import { z } from 'zod';
import { PaymentProvider } from '../providers/PaymentProvider.js';
import { LUNCH_TICKET_PRICE, TicketProvider } from '../providers/TicketProvider.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const ticketProvider = new TicketProvider();
const paymentProvider = new PaymentProvider();

const createOrderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  enrollmentNumber: z.string().trim().min(3).max(40),
  phone: z.string().trim().regex(/^\d{10}$/, 'Phone must be a 10 digit Indian mobile number'),
  lunchDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const confirmPaymentSchema = z.object({
  ticketId: z.string().uuid(),
  razorpayOrderId: z.string().min(3),
  razorpayPaymentId: z.string().min(3),
  razorpaySignature: z.string().min(3),
});

router.post('/create-order', asyncHandler(async (req, res) => {
  const input = createOrderSchema.parse(req.body);
  const ticket = await ticketProvider.createPendingTicket(input);
  const order = await paymentProvider.createOrder({
    amountInRupees: LUNCH_TICKET_PRICE,
    receipt: ticket.id,
  });

  await ticketProvider.attachOrder({ ticketId: ticket.id, orderId: order.id });

  res.status(201).json({
    data: {
      ticketId: ticket.id,
      amount: LUNCH_TICKET_PRICE,
      order,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
    },
  });
}));

router.post('/confirm-payment', asyncHandler(async (req, res) => {
  const input = confirmPaymentSchema.parse(req.body);
  const isValidPayment = paymentProvider.verifyPaymentSignature(input);

  if (!isValidPayment) {
    return res.status(400).json({ error: { message: 'Invalid Razorpay payment signature' } });
  }

  const ticket = await ticketProvider.confirmPayment(input);
  return res.json({ data: ticket });
}));

router.get('/:ticketId', asyncHandler(async (req, res) => {
  const ticket = await ticketProvider.getTicket(req.params.ticketId);

  if (!ticket) {
    return res.status(404).json({ error: { message: 'Ticket not found' } });
  }

  return res.json({ data: ticket });
}));

router.post('/:ticketId/verify', asyncHandler(async (req, res) => {
  const result = await ticketProvider.verifyTicket(req.params.ticketId);
  res.status(result.valid ? 200 : 400).json({ data: result });
}));

export default router;
