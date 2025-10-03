const crypto = require('crypto');
const withLogging = (label = 'Handler') => (handler) => async (req, res, next) => {
  const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
  const t0 = Date.now();
  console.info(`[${label}] ▶ id=${id} ${req.method} ${req.originalUrl}`);
  try {
    await handler(req, res, next);
    console.info(`[${label}] ✓ id=${id} ${Date.now() - t0}ms`);
  } catch (e) {
    console.error(`[${label}] ✗ id=${id} ${Date.now() - t0}ms -> ${e.message}`);
    throw e;
  }
};

//RBAC
const requireRoles = (allowed = []) => (handler) => (req, res, next) => {
  if (!allowed || allowed.length === 0) return handler(req, res, next);
  const u = req.user;
  const roles = Array.isArray(u?.roles) ? u.roles : (u?.role ? [u.role] : []);
  const ok = roles.some(r => allowed.includes(r));
  if (!ok) return res.status(403).json({ message: 'Forbidden' });
  return handler(req, res, next);
};

const buckets = new Map(); // key -> { count, reset }
const withRateLimit = ({ keyFn = (req)=>req.user?.id || req.ip, limit = 30, windowMs = 60_000 } = {}) =>
  (handler) => (req, res, next) => {
    const key = keyFn(req);
    const now = Date.now();
    const b = buckets.get(key) || { count: 0, reset: now + windowMs };
    if (now > b.reset) { b.count = 0; b.reset = now + windowMs; }
    b.count += 1;
    buckets.set(key, b);
    res.setHeader('X-RateLimit-Limit', String(limit));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, limit - b.count)));
    res.setHeader('X-RateLimit-Reset', String(Math.floor(b.reset/1000)));
    if (b.count > limit) return res.status(429).json({ message: 'Too Many Requests' });
    return handler(req, res, next);
  };

// Audit 
const withAudit = (eventName, select = (req)=>({})) => (handler) => async (req, res, next) => {
  try {
    console.log('[AUDIT]', eventName, {
      when: new Date().toISOString(),
      user: req.user?.id,
      ...select(req),
    });
  } catch { /* no-op */ }
  return handler(req, res, next);
};

module.exports = { withLogging, requireRoles, withRateLimit, withAudit };
