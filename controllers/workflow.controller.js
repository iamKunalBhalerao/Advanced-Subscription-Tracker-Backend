import dayjs from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import SubscriptionModel from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7, 5, 2, 1];
const MAX_DELAY = 10000000; // Replace with the actual max delay limit from Qstash

export const sendReminder = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal Date has passed for subscription ${subscriptionId}. Stopping Workflow`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} Days Before`,
        reminderDate
      );
    }

    await triggerReminder(
      context,
      `Reminder ${daysBefore} Days Before`,
      subscription
    );
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return SubscriptionModel.findById(subscriptionId).populate(
      "user",
      "name email"
    );
  });
};

const sleepUntilReminder = async (context, label, date) => {
  let delay = date.diff(dayjs(), "millisecond");

  while (delay > MAX_DELAY) {
    console.log(
      `Delay of ${delay} exceeds the maximum allowed limit of ${MAX_DELAY}. Sleeping for maximum allowed delay.`
    );
    await context.sleepUntil(
      label,
      dayjs().add(MAX_DELAY, "millisecond").toDate()
    );
    delay -= MAX_DELAY;
  }

  if (delay > 0) {
    console.log(`Sleeping for ${delay} milliseconds`);
    await context.sleepUntil(label, date.toDate());
  }
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering Reminder for ${label}`);
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription: subscription,
    });
  });
};
