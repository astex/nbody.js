var au = 1.496 * Math.pow(10, 11);
var display_size = 50 * au;
var circle_size = .1;

var a = function(state1, state2) {
  // Get the acceleration from state1 to state2.
  //
  // This assumes that state2 is at [0, 0].
  //
  // Args:
  //  state1: A State instance going around state2.
  //  state2: A State instance.
  return -1 * G * state2.m / Math.pow(state1.x.magnitude(), 2);
}

var v = function(state1, state2) {
  // Get the (circular) orbital velocity of state1 around state2.
  //
  // This assumes that state2 is at [0, 0]
  //
  // Args:
  //  state1: A state instance going around state2.
  //  state2: A state instance.
  return Math.sqrt(G * state2.m / state1.x.magnitude());
}

var sun = new State(
  new Vector([0, 0]),
  new Vector([0, 0]),
  new Vector([0, 0]),
  1.988435 * Math.pow(10, 30));
var mercury = new State(new Vector([0, 0.39 * au]), null, null, 3.30104 * Math.pow(10, 23));
var venus = new State(new Vector([0, 0.72 * au]), null, null, 4.86732 * Math.pow(10, 24));
var earth = new State(new Vector([0, au]), null, null, 5.9721986 * Math.pow(10, 24));
var mars = new State(new Vector([0, 1.52 * au]), null, null, 6.41693 * Math.pow(10, 23));
var jupiter = new State(new Vector([0, 5.20 * au]), null, null, 1.89813 * Math.pow(10, 27));
var saturn = new State(new Vector([0, 9.54 * au]), null, null, 5.68319 * Math.pow(10, 26));
var uranus = new State(new Vector([0, 19.19 * au]), null, null, 8.68103 * Math.pow(10, 25));
var neptune = new State(new Vector([0, 30.07 * au]), null, null, 1.0241 * Math.pow(10, 26));
for (var i = 0; i < 8; i++) {
  var planet = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune][i];
  planet.v = new Vector([v(planet, sun), 0]);
  planet.a = new Vector([0, a(planet, sun)]);
}
var simulation = new Simulation()
  .add_body((new Body()).set_state(sun))
  .add_body((new Body()).set_state(mercury))
  .add_body((new Body()).set_state(venus))
  .add_body((new Body()).set_state(earth))
  .add_body((new Body()).set_state(mars))
  .add_body((new Body()).set_state(jupiter))
  .add_body((new Body()).set_state(saturn))
  .add_body((new Body()).set_state(uranus))
  .add_body((new Body()).set_state(neptune));
simulation.step_size = 5 * 24 * 60 * 60; // Five days.

var draw = function() {
  // Draw the simulation onto the page.
  var canvas = document.getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext("2d");
  var scale;
  var i;
  var state;
  var x, y;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  scale = Math.min(canvas.height, canvas.width) / display_size / 2;
  center_x = canvas.width / 2;
  center_y = canvas.height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (i = 0; i < simulation.bodies.length; i++) {
    state = simulation.bodies[i].get_state();
    x = center_x + scale * state.x.values[0];
    y = center_y + scale * state.x.values[1];
    ctx.beginPath();
    ctx.arc(x, y, circle_size, 0, 2 * Math.PI);
    ctx.stroke();
  }
};

var main = function() {
  // The main loop.
  draw();
  simulation.step();
  window.requestAnimationFrame(main);
};
window.requestAnimationFrame(main);