import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import transporter, { accountEmail } from "../config/nodemailer.js";

export const sendReminderEmail = async (to, type, subscription) => {
  if (!to || !type) throw new Error("Missing Required Parameters");

  const template = emailTemplates.find((t) => t.lable === type);

  if (!template) throw new Error("Invalid Email Type");

  const mailInfo = {
    username: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} ${subscription.frequency}`,
    paymentMethod: subscription.payment,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOption = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOption, (err, info) => {
    if (err) return console.log(err, "Error sending Email");
    console.log(`Email Sent ${info.response}`);
  });
};
