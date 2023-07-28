export const vShaderCalculate = `#version 300 es
layout(location=0) in float ix;
layout(location=1) in float iy;
layout(location=2) in float iLife;
layout(location=3) in vec4 iColor;
uniform sampler2D u_texture;

out float ox;
out float oy;
out float oLife;
out vec4 oColor;

uniform vec4 u_extent;
uniform float u_speed;

vec2 getTextureCoord(float normalizedX, float normalizedY) {
  float newX;

  if (u_extent.x < u_extent.z) {
    newX = normalizedX;
  } else {
    if(normalizedX > u_extent.x) {
      newX = mix(u_extent.x, 1.0, (normalizedX - u_extent.x) / (1.0 - u_extent.x));
    } else {
      newX = mix(0.0, u_extent.z, normalizedX / u_extent.z);
    }
  }

  return vec2(newX, normalizedY);
}

const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float random(const vec2 co) {
  float t = dot(rand_constants.xy, co);
  return fract(sin(t) * (rand_constants.z + t));
}

vec2 getNormalizedCoords(float x, float y) {
  float normalizedX;
  if(u_extent.z <= u_extent.x) {
    normalizedX = ((x + 1.0) / 2.0) * (1.0 + u_extent.z - u_extent.x) + u_extent.x;
    if(normalizedX > 1.0) normalizedX -= 1.0;
  } else {
    normalizedX = ((x + 1.0) / 2.0) * (u_extent.z - u_extent.x) + u_extent.x;
  }
  float normalizedY = ((y + 1.0) / 2.0) * (u_extent.a - u_extent.y) + u_extent.y;

  return vec2(normalizedX, normalizedY);
}

void main()
{
  float speed = u_speed;
  if (iLife > 400.0 || ox < -1.0 || ox > 1.0 || oy < -1.0 || oy > 1.0) {
    float randValX = random(vec2(ix, iy)) * 2.0 - 1.0;
    float randValY = random(vec2(iy, ix)) * 2.0 - 1.0;
    float randLife = random(vec2(randValX, randValY)) * 300.0;
    vec2 normalizedCoords = getNormalizedCoords(randValX, randValY);
    vec2 texCoords = getTextureCoord(normalizedCoords.x, normalizedCoords.y);
    vec4 texel = texture(u_texture, texCoords);

    ox = randValX;
    oy = randValY;
    oLife = randLife;
    oColor = vec4(texel.r, texel.g, texel.b, 1.0);
  }
  else {
    vec2 normalizedCoords = getNormalizedCoords(ix, iy);
    vec2 texCoords = getTextureCoord(normalizedCoords.x, normalizedCoords.y);
    vec4 texel = texture(u_texture, texCoords);
    ox = ix + ((texel.r) * 2.0 - 1.0) * speed;
    oy = iy + ((texel.g) * 2.0 - 1.0) * speed;
    oColor = vec4(texel.r, texel.g, texel.b, 1.0);
    oLife = iLife + 1.0;
  }
}`

export const fShaderCalculate = `#version 300 es
void main() {
}`

export const fShaderDraw = `#version 300 es
precision mediump float;
out vec4 color;
in vec4 vColor;
uniform float opacity;
uniform float u_withColor;
uniform vec3 u_color;
void main() {
  if(u_withColor > 0.5) {
    color = vec4(u_color, opacity);
  } else {
    color = vec4(vColor.r, vColor.g, vColor.b, opacity);
  }
  
}`

export const vShaderDraw = `#version 300 es
layout(location = 0) in vec2 position;
layout(location = 1) in vec4 color;

out vec4 vColor;

void main()
{
  gl_Position = vec4(position, 0.0, 1.0);
  gl_PointSize = 1.0;
  vColor = color;
}`