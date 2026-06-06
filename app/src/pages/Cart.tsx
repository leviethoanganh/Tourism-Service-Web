import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { cartService } from '../services/cart.service';
import { orderService } from '../services/order.service';
import { CartItem } from '../types';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, clearCart } = useCartStore();

  const [cartDetails, setCartDetails] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('money');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) { setCartDetails([]); return; }
    setLoading(true);
    cartService.render(items)
      .then(data => { if (data.code === 'success') setCartDetails(data.cart); })
      .finally(() => setLoading(false));
  }, [items]);

  const subTotal = cartDetails.reduce((acc, item) => {
    return acc
      + (item.priceNewAdult || 0) * item.quantityAdult
      + (item.priceNewChildren || 0) * item.quantityChildren
      + (item.priceNewBaby || 0) * item.quantityBaby;
  }, 0);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return alert('Please fill in your full name and phone number.');
    setSubmitting(true);
    try {
      const res = await orderService.create({ fullName, phone, note, paymentMethod, items });
      if (res.code === 'success') {
        clearCart();
        navigate(`/order/success?orderCode=${res.orderCode}&phone=${phone}`);
      } else {
        alert(res.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Cart list */}
      <div className="section-11">
        <div className="container">
          <div className="inner-wrap">
            <div className="inner-head">
              <div className="inner-title">Shopping Cart</div>
              <a className="inner-back" href="/tours">
                Continue Shopping <i className="fa-solid fa-angle-right" />
              </a>
            </div>

            {loading ? (
              <p>Loading cart...</p>
            ) : cartDetails.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="inner-tour-list">
                {cartDetails.map((item, i) => (
                  <div key={i} className="cart-item">
                    <img src={item.avatar || '/client/assets/images/product-1.png'} alt={item.name} />
                    <div className="cart-item-info">
                      <div className="inner-title">{item.name}</div>
                      <div>Departure: {item.departureDate}</div>
                      <div>From: {item.locationFromName}</div>
                      <div>Adult x{item.quantityAdult} — {(item.priceNewAdult || 0).toLocaleString('en-US')} VND</div>
                      {item.quantityChildren > 0 && (
                        <div>Children x{item.quantityChildren} — {(item.priceNewChildren || 0).toLocaleString('en-US')} VND</div>
                      )}
                      {item.quantityBaby > 0 && (
                        <div>Baby x{item.quantityBaby} — {(item.priceNewBaby || 0).toLocaleString('en-US')} VND</div>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.tourId)}>
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="inner-list-price">
              <div className="inner-item">
                <div className="inner-label">Subtotal:</div>
                <div className="inner-price"><span>{subTotal.toLocaleString('en-US')}</span> VND</div>
              </div>
              <div className="inner-item">
                <div className="inner-label">Discount:</div>
                <div className="inner-price"><span>0</span> VND</div>
              </div>
              <div className="inner-item">
                <div className="inner-label">Total:</div>
                <div className="inner-price-highlight"><span>{subTotal.toLocaleString('en-US')}</span> VND</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order form */}
      <div className="section-12">
        <div className="container">
          <div className="inner-wrap">
            <form onSubmit={handleOrder}>
              <div className="inner-title-main">Customer Information</div>
              <div className="inner-list-group">
                <div className="inner-group">
                  <input placeholder="Full Name *" type="text" value={fullName}
                    onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className="inner-group">
                  <input placeholder="Phone Number *" type="text" value={phone}
                    onChange={e => setPhone(e.target.value)} required />
                </div>
                <div className="inner-group inner-two-col">
                  <textarea placeholder="Note" value={note} onChange={e => setNote(e.target.value)} />
                </div>
              </div>

              <div className="inner-title-main">Select Payment Method</div>
              <div className="inner-list-method">
                {[
                  { value: 'money', label: 'Cash on Tour' },
                  { value: 'bank', label: 'Bank Transfer' },
                  { value: 'vnpay', label: 'VNPay' },
                  { value: 'zalopay', label: 'ZaloPay' },
                ].map(m => (
                  <div className="inner-item" key={m.value}>
                    <input id={`method-${m.value}`} type="radio" name="method"
                      value={m.value} checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)} />
                    <label htmlFor={`method-${m.value}`}>{m.label}</label>
                  </div>
                ))}
              </div>

              {paymentMethod === 'bank' && (
                <div className="inner-info-bank">
                  <div className="inner-title">Bank Transfer Information</div>
                  <div className="inner-text">
                    <div>Bank: Vietcombank</div>
                    <div>Account Name: Le Van A</div>
                    <div>Account Number: 0123456789</div>
                  </div>
                </div>
              )}

              <div className="inner-button">
                <button type="submit" disabled={submitting || cartDetails.length === 0}>
                  {submitting ? 'Booking...' : 'BOOK TOUR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
