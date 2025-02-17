import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          message: "TOO Many Requests !!!",
        });
      } else if (decision.reason.isBot()) {
        res.status(403).json({
          message: "No BOT's Allowed !!!",
        });
      } else {
        res.status(403).json({
          message: "Access Denied !!!",
        });
      }
    }

    next();
  } catch (error) {
    console.log(`Arcjet middleware error:`, error);
  }
};
export default arcjetMiddleware;
