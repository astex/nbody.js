var au = 1.496 * Math.pow(10, 11);
var display_size = 3 * au;
var circle_size = 10;

// TODO: Add more bodies.
var sun = new State(
  new Vector([0, 0]),
  new Vector([0, 0]),
  new Vector([0, 0]),
  1.988435 * Math.pow(10, 30));
var mercury = new State(
  new Vector([0, 0.39 * au]),
  new Vector([47400, 0]),
  new Vector([0, 0]),
  3.30104 * Math.pow(10, 23));
mercury.a = new Vector([0, -1 * G * sun.m / Math.pow(mercury.x.magnitude(), 2)]);
var earth = new State(
  new Vector([0, au]),
  new Vector([29800, 0]),
  new Vector([0, 0]),
  5.9721986 * Math.pow(10, 24));
earth.a = new Vector([0, -1 * G * sun.m / Math.pow(earth.x.magnitude(), 2)]);

var simulation = new Simulation()
  .add_body((new Body()).set_state(sun))
  .add_body((new Body()).set_state(mercury))
  .add_body((new Body()).set_state(earth));
simulation.step_size = 24 * 60 * 60; // One day.

var draw = function() {
  // Draw the simulation onto the page.
  // TODO: Draw some number of previous states in different colors.
  // TODO: Make radius a function of mass.
  var canvas = $('canvas')[0];
  var ctx = canvas.getContext("2d");
  var height = $('canvas').height();
  var width = $('canvas').width();
  var scale = Math.min(height, width) / display_size;
  var i;
  var state;
  var x, y;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (i = 0; i < simulation.bodies.length; i++) {
    state = simulation.bodies[i].get_state();
    x = scale * state.x.values[0];
    y = scale * state.x.values[1];
    ctx.beginPath();
    ctx.arc(
      scale * state.x.values[0],
      scale * state.x.values[1],
      circle_size,
      0,
      2 * Math.PI);
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
