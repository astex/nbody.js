var Vector = function(values) {
  // An N-Dimensional vector.
  // 
  // Args:
  //  values: A list of values for each dimension of the vector.
  var self = this;

  self.values = values;

  self.hash = function() {
    // Generate a hash of the vector.
    //
    // Returns:
    //  A hash of the vector.
    var r = '';
    var i;
    for (i = 0; i < self.values.length; i++) {
      r += String(self.values[i]) + ','
    }
    return '[' + r +  ']';
  };

  self.copy = function() {
    // Get a duplicate vector.
    return (new Vector(self.values.slice()));
  };

  self.divide = function(c) {
    // Divide the vector by a constant.
    //
    // Args:
    //  c: A constant.
    //
    // Returns:
    //  A new vector with each value divided by c.
    return self.multiply(1 / c);
  };

  self.multiply = function(c) {
    // Multiply the vector by a constant.
    //
    // Args:
    //  c: A constant.
    //
    // Returns:
    //  A new vector with each value multiplied by c.
    var copy = self.copy();
    var i;

    for (i = 0; i < self.values.length; i++) {
      copy.values[i] *= c;
    }
    return copy;
  };

  self.add = function(other) {
    // Add another vector to self.
    //
    // Args:
    //  other: Another vector.
    //
    // Returns:
    //  The resultant vector.
    var values = [];
    var i;

    if (self.dimension() != other.dimension()) {
      var msg = "Cannot add two vectors of different dimensionality.";
      log(loglevel.error, msg);
      throw (new Error(msg));
    }

    for (i = 0; i < self.values.length; i++) {
      values.push(self.values[i] + other.values[i]);
    }
    return (new Vector(values));
  };

  self.subtract = function(other) {
    // Subtract another vector from self.
    //
    // Args:
    //  other: Another vector.
    //
    // Returns:
    //  The resultant vector from other to self.
    var values = [];
    var i;

    if (self.dimension() != other.dimension()) {
      var msg = "Cannot subtract two vectors of different dimensionality.";
      log(loglevel.error, msg);
      throw (new Error(msg));
    }

    for (i = 0; i < self.values.length; i++) {
      values.push(self.values[i] - other.values[i]);
    }
    return (new Vector(values));
  };

  self.dimension = function() {
    // Get the dimension of the vector.
    return self.values.length;
  };

  self.magnitude = function() {
    // Get the magnitude of this vector.
    var s = 0;
    var i;
    var dimension = self.dimension();

    for (i = 0; i < self.values.length; i++) {
      s += Math.pow(self.values[i], dimension)
    }
    return Math.pow(s, 1 / dimension);
  };

  self.unit = function() {
    // Get a unit vector in the direction of this vector.
    return self.divide(self.magnitude());
  };
};
