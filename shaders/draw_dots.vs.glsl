precision mediump float;
attribute vec2 position;
attribute float pointWidth;

uniform float stageWidth;
uniform float stageHeight;

// helper function to transform from pixel space to normalized
// device coordinates (NDC). In NDC (0,0) is the middle,
// (-1, -1) is the top left and (1, 1) is the bottom right.
// Stolen from Peter Beshai's great blog post:
// http://peterbeshai.com/beautifully-animate-points-with-webgl-and-regl.html
vec2 normalizeCoords(vec2 position) {
  // read in the positions into x and y vars
  float x = position[0];
  float y = position[1];

  return vec2(
    2.0 * ((x / stageWidth) - 0.5),
    // invert y to treat [0,0] as bottom left in pixel space
    -(2.0 * ((y / stageHeight) - 0.5)));
}

void main () {
  gl_PointSize = pointWidth;
  gl_Position = vec4(normalizeCoords(position), 0, 1);
}
