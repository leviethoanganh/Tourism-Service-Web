"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { orderService } from "@/services/order.service";
import { useTranslation } from "@/hooks/useTranslation";

const fmt = (n: number) => n.toLocaleString("vi-VN");

export default function CartPage() {
  const { t } = useTranslation();
  const { items, removeItem, clearCart } = useCartStore();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "", phone: "", note: "", paymentMethod: "money",
  });
  const [loading, setLoading] = useState(false);
  const [showBankInfo, setShowBankInfo] = useState(false);

  const subTotal = items.reduce(
    (sum, item) =>
      sum +
      item.priceNewAdult * item.quantityAdult +
      item.priceNewChildren * item.quantityChildren +
      item.priceNewBaby * item.quantityBaby,
    0
  );
  const discount = 0;
  const total = subTotal - discount;

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone) {
      alert(t.cart.fullNamePhoneAlert);
      return;
    }
    setLoading(true);
    try {
      const result = await orderService.create({ ...form, items });
      if (result.code === "success") {
        clearCart();
        router.push(`/order/success?orderCode=${result.orderCode}&phone=${form.phone}`);
      } else {
        alert(t.cart.orderFailedAlert);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Section 11 - Cart */}
      <div className="section-11">
        <div className="container">
          <div className="inner-wrap">
            <div className="inner-head">
              <div className="inner-title">{t.cart.shoppingCart}</div>
              <Link className="inner-back" href="/">
                {t.cart.continueShopping}
                <i className="fa-solid fa-angle-right"></i>
              </Link>
            </div>

            {items.length === 0 ? (
              <p style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
                {t.cart.emptyCart}
              </p>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item.tourId} className="inner-tour-item">
                    <div className="inner-actions">
                      <button
                        className="inner-delete"
                        onClick={() => removeItem(item.tourId)}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <div className="inner-product">
                      <div className="inner-image">
                        <a href={`/tours/${item.slug}`}>
                          <img src={item.avatar} alt={item.name} />
                        </a>
                      </div>
                      <div className="inner-content">
                        <div className="inner-title">
                          <a href={`/tours/${item.slug}`}>{item.name}</a>
                        </div>
                        <div className="inner-meta">
                          {item.departureDate && (
                            <div>{t.common.departureDate}: <b>{item.departureDate}</b></div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="inner-quantity">
                      <div className="inner-label">{t.filter.passengerCount}</div>
                      <div className="inner-list">
                        <div className="inner-item">
                          <div className="inner-item-label">{t.common.adult}:</div>
                          <div className="inner-item-price">
                            <span>{item.quantityAdult}</span> x{" "}
                            <span className="inner-highlight">
                              {fmt(item.priceNewAdult)} VND
                            </span>
                          </div>
                        </div>
                        <div className="inner-item">
                          <div className="inner-item-label">{t.common.children}:</div>
                          <div className="inner-item-price">
                            <span>{item.quantityChildren}</span> x{" "}
                            <span className="inner-highlight">
                              {fmt(item.priceNewChildren)} VND
                            </span>
                          </div>
                        </div>
                        <div className="inner-item">
                          <div className="inner-item-label">{t.common.baby}:</div>
                          <div className="inner-item-price">
                            <span>{item.quantityBaby}</span> x{" "}
                            <span className="inner-highlight">
                              {fmt(item.priceNewBaby)} VND
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="inner-list-price">
              <div className="inner-item">
                <div className="inner-label">{t.common.subtotal}:</div>
                <div className="inner-price">{fmt(subTotal)} VND</div>
              </div>
              <div className="inner-item">
                <div className="inner-label">{t.common.discount}:</div>
                <div className="inner-price">{fmt(discount)} VND</div>
              </div>
              <div className="inner-item">
                <div className="inner-label">{t.common.total}:</div>
                <div className="inner-price-highlight">{fmt(total)} VND</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 11 */}

      {/* Section 12 - Checkout */}
      <div className="section-12">
        <div className="container">
          <div className="inner-wrap">
            <div className="inner-title-main">{t.cart.customerInformation}</div>
            <div className="inner-list-group">
              <div className="inner-group">
                <input
                  id="fullName"
                  placeholder={t.cart.fullNamePlaceholder}
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div className="inner-group">
                <input
                  id="phone"
                  placeholder={t.cart.phoneNumberPlaceholder}
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="inner-group inner-two-col">
                <textarea
                  placeholder={t.cart.notePlaceholder}
                  name="note"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>

            <div className="inner-title-main">{t.cart.selectPaymentMethod}</div>
            <div className="inner-list-method">
              {[
                { value: "money", label: t.cart.cashOnTour },
                { value: "bank", label: t.cart.bankTransfer },
                { value: "vnpay", label: "VNPay" },
                { value: "zalopay", label: "ZaloPay" },
              ].map(({ value, label }) => (
                <div key={value} className="inner-item">
                  <input
                    id={`method-${value}`}
                    checked={form.paymentMethod === value}
                    value={value}
                    name="method"
                    type="radio"
                    onChange={() => {
                      setForm({ ...form, paymentMethod: value });
                      setShowBankInfo(value === "bank");
                    }}
                  />
                  <label htmlFor={`method-${value}`}>{label}</label>
                </div>
              ))}
            </div>

            {showBankInfo && (
              <div className="inner-info-bank active">
                <div className="inner-title">{t.cart.bankTransferInfo}</div>
                <div className="inner-text">
                  <div>{t.cart.bankLabel}</div>
                  <div>{t.cart.accountNameLabel}</div>
                  <div>{t.cart.accountNumberLabel}</div>
                </div>
              </div>
            )}

            <div className="inner-button">
              <button onClick={handleSubmit} disabled={loading || items.length === 0}>
                {loading ? t.cart.processing : t.cart.bookTour}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 12 */}
    </>
  );
}
