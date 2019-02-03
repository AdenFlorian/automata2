import * as THREE from 'three'

// @ts-ignore
global.THREE = THREE

import 'three/examples/js/shaders/CopyShader'

import 'three/examples/js/postprocessing/ShaderPass'
import 'three/examples/js/postprocessing/EffectComposer'
import 'three/examples/js/postprocessing/RenderPass'

import 'three/examples/js/shaders/DotScreenShader'
import 'three/examples/js/shaders/RGBShiftShader'

// @ts-ignore
export const EffectComposer = THREE.EffectComposer
// @ts-ignore
export const RenderPass = THREE.RenderPass
// @ts-ignore
export const ShaderPass = THREE.ShaderPass
// @ts-ignore
export const DotScreenShader = THREE.DotScreenShader
// @ts-ignore
export const RGBShiftShader = THREE.RGBShiftShader
