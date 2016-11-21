var G = 6.67408 * Math.pow(10, -11); // m^3 kg^-1 s^-2


// An enum of available levels of logging.
var loglevels = {
  critical: {name: 'critical', value: 0},
  error: {name: 'error', value: 1},
  warn: {name: 'warn', value: 2},
  debug: {name: 'debug', value: 3},
  info: {name: 'info', value: 4},
  trace: {name: 'trace', value: 5}
};
// The default level of logging.  Set this to null to avoid logging entirely.
var loglevel = loglevels.warn;
var log = function(level, message) {
  // Log a message.
  //
  // Args:
  //  level: A member of loglevels.
  //  message: A message to log.
  if (loglevel === null) return;
  var l = loglevels[level];
  if (l.value <= loglevel.value) console.log('[' + loglevel.name + ']');
};


var State = function(x, v, a, m) {
  // A state of a body in the simulation.
  var self = this;

  // The position (m).
  self.x = x || new Vector([0, 0]);
  // The velocity (m s^-1).
  self.v = v || new Vector([0, 0]);
  // The acceleration (m s^-2).
  self.a = a || new Vector([0, 0]);
  // The mass (kg).
  self.m = m || 0;

  self.hash = function() {
    // Generate a hash of the state for use in caching.
    //
    // Returns:
    //  A hash of the state.
    return '[' + self.x.hash() + ',' + self.v.hash() + ',' + self.a.hash() + ',' + self.m + ']';
  };

  // A cache of get_force calculations.
  self._forces = {};
  self.get_force = function(other) {
    // Get the force on this state by another.
    //
    // This function is cached for each value of other.  In addition, this
    // function sets the cache on other.
    //
    // Args:
    //  other: Another body instance.
    //
    // Returns:
    //  The gravitational force vector of other applied on this state.
    var r;
    var f;
    var hash;
    var other_hash = other.hash();

    if (self._forces[other_hash] === undefined) {
      hash = self.hash();
      r = other.x.subtract(self.x);
      f = r.unit().multiply(
        -1 * G * self.mass * other.mass /
        Math.pow(r.magnitude(), 2)); // (kg m s^-2)

      self._forces[other_hash] = f;
      // Every action has an equal and opposite reaction.
      other._forces[hash] = f.multiply(-1)
    }
    return self._forces[other_hash];
  };
};


var Body = function() {
  // A planetary body.
  //
  // Args:
  //  state: The initial state of the body.
  var self = this;

  // A list of states.
  self.states = [];

  self.set_state = function(state) {
    // Set the state of the body.
    //
    // Args:
    //  state: A State instance.
    //
    // Returns:
    //  self
    self.states.push(state);
    return self;
  };

  self.get_state = function() {
    // Get the current state of the body.
    //
    // Returns:
    //  The last State in the body's history.
    return self.states[self.states.length - 1];
  };

  self.get_force = function(other) {
    // Get the force on this object by another.
    //
    // Args:
    //  other: Another body instance.
    //
    // Returns:
    //  The gravitational force vector of other applied on this body.
    return self.current_state().get_force(other.current_state())
  };
};


var Simulation = function() {
  // An N-body simulation.
  var self = this;

  // The bodies of the simulation.
  self.bodies = [];

  // The size of the simulation timestep (s).
  self.step_size = .5;

  self.add_body = function(body) {
    // Add a body to the simulation.
    //
    // Args:
    //  body: A Body instance.
    //
    // Returns:
    //  self
    self.bodies.push(body);
    return self;
  };

  self.step = function() {
    // Generate the next step in the simulation and apply it.
    //
    // TODO: Add a half-step velocity calculation.
    // TODO: Add collision detection.
    //
    // Returns:
    //  self
    var i, j;
    var x, a, f;
    var old_state, new_state;
    var new_xs = [];
    var new_states = [];

    // Create a list of new states for each body in self.bodies.  And
    //  calculate their new position.
    for (i = 0; i < self.bodies.length; i++) {
      old_state = self.bodies[i].get_state();

      // Velocity verlet.
      // x = x + vt + .5at^2
      x = old_state.x
        .add(old_state.v.multiply(self.step_size))
        .add(old_state.a.multiply(.5 * Math.pow(self.step_size, 2)));

      // Initially create the state with just the new position.
      new_states.push(new State(x))
    }

    // Calculate the new velocity from the states created above.
    // This looks like it is O(n^2).  However, because State.get_force is
    //  cached (and reverse-cached), it's actually O(n log(n)).
    for (i = 0; i < new_states.length; i++) {
      old_state = self.bodies[i].get_state();
      new_state = new_states[i];

      // Calculate an force vector as the sum of the gravity due to every other
      //  body in the simulation.
      f = new Vector([0, 0]);
      for (j = 0; j < new_states.length; i++) {
        if (i != j)
          f = f.add(new_state.get_force(new_states[j]));
      }
      a = f.divide(state.m);

      // Velocity verlet.
      new_state.a = a;
      new_state.m = old_state.m;
      // v = v + .5(old_a + a)t
      new_state.v = old_state.v
        .add(new_state.a
          .add(old_state.a)
          .multiply(.5 * self.step_size));
    }

    // Set the new states.
    for (i = 0; i < self.bodies.length; i++) {
      self.bodies[i].set_state(new_states[i]);
    }

    return self;
  };
};
