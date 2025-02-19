import dayjs from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import subscriptionModel from "../models/subscription.model.js";

const REMINDERS = [7, 5, 2, 1];

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

    await triggerReminder(context, `Reminder ${daysBefore} Days Before`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return subscriptionModel
      .findById(subscriptionId)
      .populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, lable, date) => {
  console.log(`Sleeping for ${date} days`);
  await context.sleepUntil(lable, date.toDate());
};

const triggerReminder = async (context, lable) => {
  return await context.run(lable, () => {
    console.log(`Triggering Reminder for ${lable}`);
    
  });
};
