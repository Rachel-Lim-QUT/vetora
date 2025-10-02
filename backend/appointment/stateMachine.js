// State enum
const STATES = {
  REQUESTED: "REQUESTED",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

// Action enum
const ACTIONS = {
  CONFIRM: "CONFIRM",
  START: "START",
  COMPLETE: "COMPLETE",
  CANCEL: "CANCEL",
};

// Transition graph
const MACHINE = {
  [STATES.REQUESTED]:  { [ACTIONS.CONFIRM]: STATES.CONFIRMED,  [ACTIONS.CANCEL]: STATES.CANCELLED },
  [STATES.CONFIRMED]:  { [ACTIONS.START]:   STATES.IN_PROGRESS, [ACTIONS.CANCEL]: STATES.CANCELLED },
  [STATES.IN_PROGRESS]:{ [ACTIONS.COMPLETE]:STATES.COMPLETED,   [ACTIONS.CANCEL]: STATES.CANCELLED },
  [STATES.COMPLETED]:  {},
  [STATES.CANCELLED]:  {},
};

// Helpers
function allowedTransitions(state) {
  return Object.keys(MACHINE[state] || {});
}

function nextState(current, action) {
  const cur = MACHINE[current] ? current : STATES.REQUESTED;
  const next = MACHINE[cur]?.[action];
  if (!next) {
    const e = new Error(`Invalid transition: ${cur} -> (${action})`);
    e.statusCode = 400;
    throw e;
  }
  return next;
}

// Main
async function runTransition(appointment, action) {
  const cur = appointment.status || STATES.REQUESTED;
  const nxt = nextState(cur, action);
  appointment.status = nxt;
  return { status: nxt, allowedTransitions: allowedTransitions(nxt) };
}

module.exports = { STATES, ACTIONS, allowedTransitions, nextState, runTransition };
