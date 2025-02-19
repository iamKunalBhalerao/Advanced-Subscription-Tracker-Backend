import subscriptionModel from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionModel.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription._id,
      },
      headers: {
        "content-type": "application/json",
      },
    });

    res.status(201).json({
      success: true,
      message: "Subscription Created Successfully",
      data: { subscription, workflowRunId },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const allSubscription = await subscriptionModel.find({
      //   user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "All Subscriptions",
      data: allSubscription,
    });
  } catch (e) {
    next(e);
  }
};

export const getSubscriptionDetails = async (req, res, next) => {
  try {
    const subscriptionDetails = await subscriptionModel
      .find({ user: req.params.id })
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Subscription Details",
      data: subscriptionDetails,
    });
  } catch (e) {
    next({
      message: "Invalid User",
      error: e.message,
    });
  }
};
