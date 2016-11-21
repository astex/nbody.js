var au = 1.496 * Math.pow(10, 11);
var display_size = 30 * au;
var circle_size = 1;

// TODO: Add more bodies.
var sun = new State(
  new Vector([0, 0]),
  new Vector([0, 0]),
  new Vector([0, 0]),
  1.988435 * Math.pow(10, 30));
var mercury = new State(
  new Vector([0, 0.39 * au]),
  new Vector([47400, 0]),
  null,
  3.30104 * Math.pow(10, 23));
mercury.a = new Vector([0, -1 * G * sun.m / Math.pow(mercury.x.magnitude(), 2)]);
var venus = new State(
  new Vector([0, 0.72 * au]),
  new Vector([35000, 0]),
  null,
  4.86732 * Math.pow(10, 24));
venus.a = new Vector([0, -1 * G * sun.m / Math.pow(venus.x.magnitude(), 2)])
var earth = new State(
  new Vector([0, au]),
  new Vector([29800, 0]),
  null,
  5.9721986 * Math.pow(10, 24));
earth.a = new Vector([0, -1 * G * sun.m / Math.pow(earth.x.magnitude(), 2)]);
var mars = new State(
  new Vector([0, 1.52 * au]),
  new Vector([24100, 0]),
  null,
  6.41693 * Math.pow(10, 23));
mars.a = new Vector([0, -1 * G * sun.m / Math.pow(mars.x.magnitude(), 2)]);
var jupiter = new State(
  new Vector([0, 5.20 * au]),
  new Vector([13000, 0]),
  null,
  1.89813 * Math.pow(10, 27));
jupiter.a = new Vector([0, -1 * G * sun.m / Math.pow(jupiter.x.magnitude(), 2)]);
var saturn = new State(
  new Vector([0, 9.54 * au]),
  new Vector([9640, 0]),
  null,
  5.68319 * Math.pow(10, 26));
saturn.a = new Vector([0, -1 * G * sun.m / Math.pow(saturn.x.magnitude(), 2)]);
var uranus = new State(
  new Vector([0, 19.19 * au]),
  new Vector([6800, 0]),
  null,
  8.68103 * Math.pow(10, 25));
uranus.a = new Vector([0, -1 * G * sun.m / Math.pow(uranus.x.magnitude(), 2)]);
var neptune = new State(
  new Vector([0, 30.07 * au]),
  new Vector([5430, 0]),
  null,
  1.0241 * Math.pow(10, 26));
neptune.a = new Vector([0, -1 * G * sun.m / Math.pow(neptune.x.magnitude(), 2)]);

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
  // TODO: Draw some number of previous states in different colors.
  // TODO: Make radius a function of mass.
  var canvas = $('canvas')[0];
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
