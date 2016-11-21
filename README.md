# nbody.js

A javascript n-body simulation framework.

## Installation

It's just a javascript file.  I haven't done anything fancy yet.  Download it and add it to a `script` tag.

## SetUp

The API consists of four classes:

- `Simulation` A wrapper around the entire execution loop.
- `Body` An object in the simulation.
- `State` A snapshot of a `Body` instance consisting of a position, velocity, acceleration, and mass.
- `Vector` An n-dimensional vector with a bunch of convenience methods.

As such, you can set up a simulation like this:

```js
var planet = (new Body())
  .set_state(new State(
    new Vector([0, 1]),
    null,
    new Vector([1, 0]),
    1));
var simulation = (new Simulation())
  .add_body(planet);
simulation.step_size = 1;
```

With this, we now have a simulation with one planet that has an initial position of (0, 1 m), no initial velocity, an initial acceleration of (1 m s^-2, 0), and a mass of 1 kilogram.  Each timestep will be one second.  This will probably not be a very interesting simulation, but more planets can be added freely as shown in the included [example of our solar system](sol) ([demo here](http://nbody.astex.io/sol)).
