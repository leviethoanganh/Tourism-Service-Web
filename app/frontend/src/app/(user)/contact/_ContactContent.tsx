"use client";
import { useState } from "react";
import { contactService } from "@/services/contact.service";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  email: string;
  phone: string;
  address: string;
}

export default function ContactContent({ email, phone, address }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await contactService.send(form);
      setStatus("success");
      setForm({ fullName: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.response?.data?.message || t.contact.genericErrorMsg);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-inner">

          {/* Info Column */}
          <div className="contact-info">
            <h2 className="contact-info-title">{t.contact.getInTouch}</h2>
            <p className="contact-info-desc">
              {t.contact.intro}
            </p>

            <ul className="contact-info-list">
              {address && (
                <li>
                  <span className="contact-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </span>
                  <div>
                    <strong>{t.contact.address}</strong>
                    <p>{address}</p>
                  </div>
                </li>
              )}
              {phone && (
                <li>
                  <span className="contact-icon">
                    <i className="fa-solid fa-phone"></i>
                  </span>
                  <div>
                    <strong>{t.contact.phone}</strong>
                    <p>{phone}</p>
                  </div>
                </li>
              )}
              {email && (
                <li>
                  <span className="contact-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <div>
                    <strong>{t.contact.email}</strong>
                    <p>{email}</p>
                  </div>
                </li>
              )}
              <li>
                <span className="contact-icon">
                  <i className="fa-solid fa-clock"></i>
                </span>
                <div>
                  <strong>{t.contact.workingHours}</strong>
                  <p>{t.contact.workingHoursValue}</p>
                </div>
              </li>
            </ul>

            <div className="contact-socials">
              <a href="#" target="_blank"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" target="_blank"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" target="_blank"><i className="fa-brands fa-tiktok"></i></a>
              <a href="#" target="_blank"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>

          {/* Form Column */}
          <div className="contact-form-wrap">
            <h2 className="contact-form-title">{t.contact.sendUsAMessage}</h2>

            {status === "success" && (
              <div className="contact-alert contact-alert-success">
                <i className="fa-solid fa-circle-check"></i>
                {t.contact.sendSuccessMsg}
              </div>
            )}

            {status === "error" && (
              <div className="contact-alert contact-alert-error">
                <i className="fa-solid fa-circle-exclamation"></i>
                {errorMsg}
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-row">
                <div className="contact-field">
                  <label>{t.contact.fullName} <span>*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder={t.contact.fullNamePlaceholder}
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label>{t.contact.phoneNumber}</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t.contact.phoneNumberPlaceholder}
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="contact-field">
                <label>{t.contact.emailAddress} <span>*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder={t.contact.emailPlaceholder}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label>{t.contact.message} <span>*</span></label>
                <textarea
                  name="message"
                  placeholder={t.contact.messagePlaceholder}
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> {t.contact.sending}</>
                ) : (
                  <><i className="fa-solid fa-paper-plane"></i> {t.contact.sendMessage}</>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
