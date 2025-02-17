import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

const subscriptionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is Required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },

    price: {
      type: Number,
      required: [true, "Subscription price is Required"],
      min: [0, "Price must be greater than 0"],
      max: [1000000, "Price must be less than 100000"],
    },

    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "USD",
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },

    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifeStyle",
        "technology",
        "finance",
        "politics",
        "others",
      ],
      default: "others",
      required: true,
    },

    payment: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },

    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },

    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto-Calculet the renewal Data if missing
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  //   Auto-Update the status if renewalDate is pass

  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const subscriptionModel = model("Subscription", subscriptionSchema);

export default subscriptionModel;
