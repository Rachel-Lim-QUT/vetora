// State enum 
const STATES = {
  Requested: "Requested",
  Confirmed: "Confirmed",
  InProgress: "InProgress",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

// Action enum 
const ACTIONS = {
  CONFIRM: "confirm",
  START: "start",
  COMPLETE: "complete",
  CANCEL: "cancel",
};

// Transition graph
const MACHINE = {
  [STATES.Requested]:  { [ACTIONS.CONFIRM]: STATES.Confirmed,  [ACTIONS.CANCEL]: STATES.Cancelled },
  [STATES.Confirmed]:  { [ACTIONS.START]:   STATES.InProgress, [ACTIONS.CANCEL]: STATES.Cancelled },
  [STATES.InProgress]: { [ACTIONS.COMPLETE]:STATES.Completed,  [ACTIONS.CANCEL]: STATES.Cancelled },
  [STATES.Completed]:  {},
  [STATES.Cancelled]:  {},
};

// Helpers
function allowedTransitions(state) {
  return Object.keys(MACHINE[state] || {});
}

function nextState(current, action) {
  const cur = MACHINE[current] ? current : STATES.Requested;
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
  const cur = appointment.status || STATES.Requested;
  const nxt = nextState(cur, action);
  appointment.status = nxt;
  return { status: nxt, allowedTransitions: allowedTransitions(nxt) };
}

module.exports = { STATES, ACTIONS, allowedTransitions, nextState, runTransition };
