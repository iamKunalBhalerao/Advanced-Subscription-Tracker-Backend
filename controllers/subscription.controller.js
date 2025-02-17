import subscriptionModel from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionModel.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Subscription Created Successfully",
      data: subscription,
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
    });
  }
};
