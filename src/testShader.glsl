#include <packing>

// varying vec2 vUv;
// uniform sampler2D tDiffuse;
// uniform sampler2D tDepth;
// uniform float cameraNear;
// uniform float cameraFar;
// in vec4 gl_FragCoord;
// in bool gl_FrontFacing;
// in vec2 gl_PointCoord;
uniform float time;
uniform vec2 canvasSize;

// float readDepth( sampler2D depthSampler, vec2 coord ) {
// 	float fragCoordZ = texture2D( depthSampler, coord ).x;
// 	float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
// 	return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
// }

void main() {
	//vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
	// float depth = readDepth( tDepth, vUv );
	// vec2 norm = gl_FragCoord.xy / canvasSize
	gl_FragColor.rgb = vec3((sin(time) + 2.0) / 2.0, 1, 0.5);
	gl_FragColor.a = 1.0;
}
