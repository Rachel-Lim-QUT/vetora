
/**
 * Decorator Presets
 * ----------------------------------------------------------------------------
 * A collection of reusable higher-order functions ("decorators") that wrap
 * Express route handlers with cross-cutting concerns such as logging,
 * RBAC, rate limiting, and auditing.
 *
 * FUNCTIONS:
 *
 * 1) withLogging(label)
 *    - Logs each request/response cycle with a unique id, label, HTTP method,
 *      URL, execution time, and error message if thrown.
 *    - Useful for tracing and debugging at per-request granularity.
 *
 *    Usage:
 *      router.get('/', decorate(handler, withLogging('GetItems')));
 *
 * 2) requireRoles(allowedRoles)
 *    - Enforces Role-Based Access Control (RBAC).
 *    - Reads `req.user.role` or `req.user.roles[]` and checks if any are in
 *      the allowedRoles list.
 *    - If no match → returns 403 Forbidden, else forwards to handler.
 *
 *    Usage:
 *      router.post('/admin', decorate(handler, requireRoles(['admin'])));
 *
 * 3) withRateLimit({ keyFn, limit, windowMs })
 *    - Simple in-memory request throttling.
 *    - Tracks requests per user (default keyFn = req.user.id or req.ip).
 *    - Adds response headers:
 *        X-RateLimit-Limit
 *        X-RateLimit-Remaining
 *        X-RateLimit-Reset (unix seconds)
 *    - Returns 429 Too Many Requests if limit exceeded.
 *    - Not cluster/distributed safe — for production replace with Redis or
 *      another shared store.
 *
 *    Usage:
 *      router.post('/api', decorate(handler, withRateLimit({ limit: 50 })));
 *
 * 4) withAudit(eventName, selectFn)
 *    - Emits an audit log before calling the handler.
 *    - eventName: string identifier for the action (e.g., 'appointment.create').
 *    - selectFn: function(req) → object of extra fields to log (e.g., patient, type).
 *    - Currently logs to console; could be extended to DB, SIEM, or log service.
 *
 *    Usage:
 *      decorate(handler,
 *        withAudit('appointment.create', req => ({ patient: req.body.patient }))
 *      );
 *
 * EXPORTS:
 *  - withLogging
 *  - requireRoles
 *  - withRateLimit
 *  - withAudit
 */
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
