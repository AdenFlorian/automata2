precision mediump float;

uniform sampler2D previousState;

int wasPixelAlive(float pixel) {
  return pixel == 0.0
    ? 1
    : 0;
}

int wasPixelDying(float pixel) {
  return pixel == 0.5
    ? 1
    : 0;
}

int wasPixelDead(float pixel) {
  return pixel == 1.0
    ? 1
    : 0;
}

int wasAlive(vec2 coord) {
  float size = 1024.0;

  if (
    coord.x < 0.0 || 
    coord.x > size || 
    coord.y < 0.0 || 
    coord.y > size
  ) return 0;

  vec4 px = texture2D(previousState, coord / size);

  return wasPixelAlive(px.r);
}

void main(void) {
  vec2 coord = gl_FragCoord.xy;

  int aliveNeighbors =
    wasAlive(coord + vec2(-1.0, -1.0)) +
    wasAlive(coord + vec2(-1.0, 0.0)) +
    wasAlive(coord + vec2(-1.0, 1.0)) +
    wasAlive(coord + vec2(0.0, -1.0)) +
    wasAlive(coord + vec2(0.0, 1.0)) +
    wasAlive(coord + vec2(1.0, -1.0)) +
    wasAlive(coord + vec2(1.0, 0.0)) +
    wasAlive(coord + vec2(1.0, 1.0));

  bool nowAlive = wasAlive(coord) == 1
    ? aliveNeighbors == 2 || aliveNeighbors == 3
    : aliveNeighbors == 3;
  
  gl_FragColor = nowAlive
    ? vec4(0.0, 0.0, 0.0, 1.0) 
    : vec4(1.0, 1.0, 1.0, 1.0);
}
