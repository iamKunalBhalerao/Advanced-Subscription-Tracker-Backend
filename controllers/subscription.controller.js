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
