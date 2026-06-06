import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { orderService } from '../services/order.service';
import { Order } from '../types';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderCode = searchParams.get('orderCode') || '';
  const phone = searchParams.get('phone') || '';

  useEffect(() => {
    if (!orderCode || !phone) return;
    orderService.getSuccess(orderCode, phone)
      .then(data => setOrder(data.order))
      .finally(() => setLoading(false));
  }, [orderCode, phone]);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!order) return <div className="container"><p>Order not found.</p><Link to="/">Go Home</Link></div>;

  return (
    <div className="section-order-success">
      <div className="container">
        <div className="inner-wrap">
          <div className="inner-icon">
            <i className="fa-solid fa-circle-check" style={{ color: 'green', fontSize: '4rem' }} />
          </div>
          <h2 className="inner-title">Order Placed Successfully!</h2>
          <div className="inner-info">
            <div className="inner-item">
              <span className="inner-label">Order Code:</span>
              <span className="inner-highlight">{order.code}</span>
            </div>
            <div className="inner-item">
              <span className="inner-label">Full Name:</span>
              <span>{order.fullName}</span>
            </div>
            <div className="inner-item">
              <span className="inner-label">Phone:</span>
              <span>{order.phone}</span>
            </div>
            <div className="inner-item">
              <span className="inner-label">Payment Method:</span>
              <span>{order.paymentMethodName}</span>
            </div>
            <div className="inner-item">
              <span className="inner-label">Payment Status:</span>
              <span>{order.paymentStatusName}</span>
            </div>
            <div className="inner-item">
              <span className="inner-label">Order Status:</span>
              <span>{order.statusName}</span>
            </div>
            <div className="inner-item">
              <span className="inner-label">Total:</span>
              <span className="inner-highlight">{order.total.toLocaleString('en-US')} VND</span>
            </div>
            <div className="inner-item">
              <span className="inner-label">Order Time:</span>
              <span>{order.createdAtFormat}</span>
            </div>
          </div>
          <div className="inner-button">
            <Link className="button-outline" to="/">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
