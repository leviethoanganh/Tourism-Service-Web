import { Request, Response } from "express";
import { sendMail } from "../../helpers/mail.helper";

export const sendContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !message) {
      res.status(400).json({ code: "error", message: "Please fill in all required fields." });
      return;
    }

    const adminEmail = process.env.EMAIL_USERNAME || "";

    const htmlContent = `
      <h2>New contact message from Tourism Service</h2>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    sendMail(adminEmail, `[Contact] Message from ${fullName}`, htmlContent);

    res.json({ code: "success", message: "Your message has been sent successfully!" });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};
