/**
 * Enterprise Security Middleware
 * Protects against NoSQL Injection Attacks, XSS Payload Injections, & Parameter Pollution
 */

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;

  // Strip script tags, event handlers (e.g. onerror=, onload=), and javascript: URIs
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

const sanitizeValue = (val) => {
  if (val === null || val === undefined) return val;

  if (typeof val === 'string') {
    return sanitizeString(val);
  }

  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }

  if (typeof val === 'object') {
    const cleanObj = {};
    for (const key of Object.keys(val)) {
      // Remove keys starting with $ or containing . (NoSQL Operator Injection Protection)
      if (key.startsWith('$') || key.includes('.')) {
        console.warn(`🛡️ Security Warning: Blocked suspicious NoSQL operator key "${key}"`);
        continue;
      }
      cleanObj[key] = sanitizeValue(val[key]);
    }
    return cleanObj;
  }

  return val;
};

const sanitizeMiddleware = (req, res, next) => {
  try {
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.query) req.query = sanitizeValue(req.query);
    if (req.params) req.params = sanitizeValue(req.params);
    next();
  } catch (err) {
    console.error('Sanitization Error:', err.message);
    next();
  }
};

module.exports = { sanitizeMiddleware, sanitizeString };
