const rateLimit = require('express-rate-limit');

// Requires app.set('trust proxy', 1) so req.ip is the real client behind nginx.
const limiter = (windowMs, limit, message, extra = {}) => rateLimit({
  windowMs,
  limit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message },
  ...extra,
});

const globalLimiter = limiter(60 * 1000, 300, 'Too many requests. Please slow down.');

// Failed logins only: successful sign-ins don't eat into the budget.
const loginLimiter = limiter(15 * 60 * 1000, 5, 'Too many login attempts. Try again in 15 minutes.', {
  skipSuccessfulRequests: true,
});

// Kept above the audit's 5/hour: many students register from behind one campus NAT IP.
// Only stored registrations count, so fixing a validation error and resubmitting is free.
const registrationLimiter = limiter(60 * 60 * 1000, 15, 'Too many registrations from this network. Please try again later.', {
  skipFailedRequests: true,
});

const ieeeCheckLimiter = limiter(60 * 1000, 20, 'Too many checks. Please wait a minute.');

module.exports = { globalLimiter, loginLimiter, registrationLimiter, ieeeCheckLimiter };
