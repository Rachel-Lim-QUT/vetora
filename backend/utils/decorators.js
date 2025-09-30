/**
 * Decorator Utilities
 * ----------------------------------------------------------------------------
 * Provides helper functions to compose middleware-like decorators
 * around Express route handlers.
 *
 * FUNCTIONS:
 *
 * 1) decorate(handler, ...decorators)
 *    - Takes a base handler function (req, res, next) and a list of decorators.
 *    - Each decorator is a higher-order function: (handler) => newHandler.
 *    - Returns the final decorated handler, with decorators applied in order.
 *
 *    Example:
 *      const securedHandler = decorate(
 *        baseHandler,
 *        withLogging('Base'),
 *        withRateLimit({ limit: 30 })
 *      );
 *
 * 2) catchAsync(handler)
 *    - Wraps an async handler to forward any rejected promises
 *      (thrown errors) to Express's next() function.
 *    - This avoids writing try/catch in every controller.
 *
 *    Example:
 *      router.get('/items', catchAsync(async (req,res) => {
 *        const items = await Item.find();
 *        res.json(items);
 *      }));
 *
 * EXPORTS:
 *  - decorate
 *  - catchAsync
 */
const decorate = (handler, ...decorators) =>
  decorators.reduce((acc, deco) => deco(acc), handler);

const catchAsync = (handler) => async (req, res, next) => {
  try { await handler(req, res, next); } catch (err) { next(err); }
};

module.exports = { decorate, catchAsync };
