import QRCode from 'qrcode';
import { v4 as uuid } from 'uuid';
import { pool } from '../db/pool.js';

export const LUNCH_TICKET_PRICE = 80;

export class TicketProvider {
  async createPendingTicket({ name, enrollmentNumber, phone, lunchDate }) {
    const ticketId = uuid();

    const { rows } = await pool.query(
      `insert into tickets (id, student_name, enrollment_number, phone, lunch_date, meal_type, amount, status)
       values ($1, $2, $3, $4, $5, 'lunch', $6, 'PENDING')
       returning *`,
      [ticketId, name, enrollmentNumber, phone, lunchDate, LUNCH_TICKET_PRICE],
    );

    return rows[0];
  }

  async attachOrder({ ticketId, orderId }) {
    const { rows } = await pool.query(
      `insert into payments (ticket_id, razorpay_order_id, amount, status)
       values ($1, $2, $3, 'ORDER_CREATED')
       returning *`,
      [ticketId, orderId, LUNCH_TICKET_PRICE],
    );

    return rows[0];
  }

  async confirmPayment({ ticketId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const client = await pool.connect();

    try {
      await client.query('begin');

      const paymentResult = await client.query(
        `update payments
            set razorpay_payment_id = $3,
                razorpay_signature = $4,
                status = 'PAID',
                paid_at = now()
          where ticket_id = $1 and razorpay_order_id = $2
          returning *`,
        [ticketId, razorpayOrderId, razorpayPaymentId, razorpaySignature],
      );

      if (!paymentResult.rowCount) {
        const error = new Error('Payment order not found for ticket');
        error.status = 404;
        throw error;
      }

      const qrPayload = ticketId;
      const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, { margin: 2, width: 320 });

      const ticketResult = await client.query(
        `update tickets
            set status = 'ACTIVE',
                paid_at = now(),
                qr_payload = $2,
                qr_code_data_url = $3
          where id = $1
          returning *`,
        [ticketId, qrPayload, qrCodeDataUrl],
      );

      await client.query('commit');
      return ticketResult.rows[0];
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  }

  async getTicket(ticketId) {
    const { rows } = await pool.query('select * from tickets where id = $1', [ticketId]);
    return rows[0] || null;
  }

  async listSoldTickets() {
    const { rows } = await pool.query(
      `select t.*, p.razorpay_order_id, p.razorpay_payment_id
         from tickets t
         left join payments p on p.ticket_id = t.id
        where t.status in ('ACTIVE', 'USED')
        order by t.created_at desc`,
    );

    return rows;
  }

  async verifyTicket(ticketId) {
    const ticket = await this.getTicket(ticketId);

    if (!ticket) return { valid: false, reason: 'NOT_FOUND' };
    if (ticket.status === 'USED') return { valid: false, reason: 'ALREADY_USED', ticket };
    if (ticket.status !== 'ACTIVE') return { valid: false, reason: 'NOT_PAID', ticket };

    const { rows } = await pool.query(
      `update tickets
          set status = 'USED', used_at = now()
        where id = $1 and status = 'ACTIVE'
        returning *`,
      [ticketId],
    );

    return { valid: true, ticket: rows[0] };
  }
}
