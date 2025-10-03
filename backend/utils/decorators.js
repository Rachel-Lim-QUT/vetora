const decorate = (handler, ...decorators) =>
  decorators.reduce((acc, deco) => deco(acc), handler);

const catchAsync = (handler) => async (req, res, next) => {
  try { await handler(req, res, next); } catch (err) { next(err); }
};

module.exports = { decorate, catchAsync };
