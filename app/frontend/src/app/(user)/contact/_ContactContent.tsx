"use client";
import { useState } from "react";
import { contactService } from "@/services/contact.service";

interface Props {
  email: string;
  phone: string;
  address: string;
}

export default function ContactContent({ email, phone, address }: Props) {
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
      setErrorMsg(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-inner">

          {/* Info Column */}
          <div className="contact-info">
            <h2 className="contact-info-title">Get In Touch</h2>
            <p className="contact-info-desc">
              Have questions about a tour? Want to customize your trip? Our team is ready
              to help you plan the perfect travel experience.
            </p>

            <ul className="contact-info-list">
              {address && (
                <li>
                  <span className="contact-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </span>
                  <div>
                    <strong>Address</strong>
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
                    <strong>Phone</strong>
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
                    <strong>Email</strong>
                    <p>{email}</p>
                  </div>
                </li>
              )}
              <li>
                <span className="contact-icon">
                  <i className="fa-solid fa-clock"></i>
                </span>
                <div>
                  <strong>Working Hours</strong>
                  <p>Mon – Sat: 8:00 AM – 6:00 PM</p>
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
            <h2 className="contact-form-title">Send Us a Message</h2>

            {status === "success" && (
              <div className="contact-alert contact-alert-success">
                <i className="fa-solid fa-circle-check"></i>
                Your message has been sent successfully! We will get back to you soon.
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
                  <label>Full Name <span>*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="contact-field">
                <label>Email Address <span>*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label>Message <span>*</span></label>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
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
                  <><i className="fa-solid fa-spinner fa-spin"></i> Sending...</>
                ) : (
                  <><i className="fa-solid fa-paper-plane"></i> Send Message</>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
