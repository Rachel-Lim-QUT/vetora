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

// Transition graph (sourceState -> action -> nextState)
const MACHINE = {
  [STATES.REQUESTED]:  { [ACTIONS.CONFIRM]: STATES.CONFIRMED,  [ACTIONS.CANCEL]: STATES.CANCELLED },
  [STATES.CONFIRMED]:  { [ACTIONS.START]:   STATES.IN_PROGRESS, [ACTIONS.CANCEL]: STATES.CANCELLED },
  [STATES.IN_PROGRESS]:{ [ACTIONS.COMPLETE]:STATES.COMPLETED,   [ACTIONS.CANCEL]: STATES.CANCELLED },
  [STATES.COMPLETED]:  {}, // terminal
  [STATES.CANCELLED]:  {}, // terminal
};

// Helpers
function allowedTransitions(state) {
  // returns list of allowed action strings from current state
  return Object.keys(MACHINE[state] || {});
}

function nextState(current, action) {
  // returns the next state or throws on invalid transition
  const next = MACHINE[current]?.[action];
  if (!next) throw new Error(`Invalid transition: ${current} -> (${action})`);
  return next;
}

// Main function used by service layer
async function runTransition(appointment, action) {
  // appointment is a mongoose doc; we update its "status"
  const next = nextState(appointment.status, action);
  appointment.status = next;
  if (onEnter[next]) await onEnter[next](appointment);
  return { status: next, allowedTransitions: allowedTransitions(next) };
}

module.exports = { STATES, ACTIONS, allowedTransitions, nextState, runTransition };
