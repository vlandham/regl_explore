
const regl = require('regl')();
const glslify = require('glslify');

// Helper function to create a random float between
// some defined range. This is used to create some
// fake data. In a real setting, you would probably
// use D3 to map data to display coordinates.
function randomFromInterval(min, max) {
  return Math.random() * (max - min + 1) + min;
}

// Helper function to create a random integer between
// some defined range. Again, you would want to use
// D3 for mapping real data to display coordinates.
function randomIntFromInterval(min, max) {
  return Math.floor(randomFromInterval(min, max));
}

// Some constants to use
var MAX_WIDTH = 2000;
var MAX_HEIGHT = 800;
var MAX_SPEED = 25;
var POINT_SIZE = 10;
var POINT_COUNT = 400;


// Helper function to generate some fake data.
// Each data point has an x and y and a 'speed'
// value that indicates how fast it travels
function createData(dataCount) {
  var data = [];
  for(var i = 0; i < dataCount; i++) {
    var datum = {
      id: i,
      speed: randomFromInterval(1, MAX_SPEED),
      y: randomIntFromInterval(POINT_SIZE, MAX_HEIGHT),
      x: 0,
      size: randomIntFromInterval(POINT_SIZE, POINT_SIZE * 3),
    };

    data.push(datum);
  }
  return data;
}

// Helper function, goes through each
// element in the fake data and updates
// its x position.
function updateData(data) {
  data.forEach(function(datum) {
    datum.x += datum.speed
    // reset x if its gone past max width
    datum.x = datum.x > MAX_WIDTH ? 0 : datum.x;
  });
}

const drawDots = regl({

  // use glslify to import shader code!
  frag: glslify('./shaders/draw_dots.fs.glsl'),
  vert: glslify('./shaders/draw_dots.vs.glsl'),

  attributes: {
    // There will be a position value for each point
    // we pass in
    position: function(context, props) {
      return props.points.map(function(point) {
        return [point.x, point.y]
      });
    },
    // Now pointWidth is an attribute, as each
    // point will have a different size.
    pointWidth: function(context, props) {
      return  props.points.map(function(point) {
        return point.size;
      });
    },
  },

  uniforms: {
    color: function(context, props) {
      // just to be a bit strange, oscillate the color a bit.
      return [Math.cos(context.tick / 100), 0.304, 1.000, 1.000];
    },
    // FYI: there is a helper method for grabbing
    // values out of the context as well.
    // These uniforms are used in our fragment shader to
    // convert our x / y values to WebGL coordinate space.
    stageWidth: regl.context('drawingBufferWidth'),
    stageHeight: regl.context('drawingBufferHeight')
  },

  count: function(context, props) {
    // set the count based on the number of points we have
    return props.points.length
  },
  primitive: 'points'

})

var points = createData(POINT_COUNT);

regl.frame(function(context) {
  // Each loop, update the data
  updateData(points);

  // And draw it!
  drawDots({
    pointWidth: POINT_SIZE,
    points: points
  });
});
