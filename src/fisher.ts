// https://jameshfisher.com/2017/10/22/webgl-game-of-life.html

// @ts-ignore
import displayShader from './display.glsl'
// @ts-ignore
// import stepperShader from './conway.glsl'
// @ts-ignore
import stepperShader from './brian.glsl'

console.log('start')
const startStateImg = new Image()

startStateImg.onload = function () {
    const canvasElement = document.getElementById("canvas")! as HTMLCanvasElement
    const webGlContext = canvasElement.getContext("webgl")!

    function createShader(type: number, source: string) {
        const shader = webGlContext.createShader(type)!
        webGlContext.shaderSource(shader, source)
        webGlContext.compileShader(shader)
        if (!webGlContext.getShaderParameter(shader, webGlContext.COMPILE_STATUS)) {
            console.error("Could not compile shader", type, source, webGlContext.getShaderInfoLog(shader))
        }
        return shader
    }
    const vertexShader = createShader(
        webGlContext.VERTEX_SHADER,
        `
            attribute vec2 coord;
            void main(void) {
                gl_Position = vec4(coord, 0.0, 1.0);
            }
        `
    )
    const fragShaderDisplay = createShader(
        webGlContext.FRAGMENT_SHADER,
        displayShader
    )
    const fragShaderStepper = createShader(
        webGlContext.FRAGMENT_SHADER,
        stepperShader
    )

    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        const program = webGlContext.createProgram()!
        webGlContext.attachShader(program, vertexShader)
        webGlContext.attachShader(program, fragmentShader)
        webGlContext.linkProgram(program)
        if (!webGlContext.getProgramParameter(program, webGlContext.LINK_STATUS)) {
            console.error("Error linking program", webGlContext.getProgramInfoLog(program))
        }
        return program
    }
    const displayProg = createProgram(vertexShader, fragShaderDisplay)
    const stepperProg = createProgram(vertexShader, fragShaderStepper)

    webGlContext.useProgram(stepperProg)

    const stepperProgCoordLoc = webGlContext.getAttribLocation(stepperProg, "coord")
    const stepperProgPreviousStateLoc = webGlContext.getUniformLocation(stepperProg, "previousState")

    const displayProgCoordLoc = webGlContext.getAttribLocation(displayProg, "coord")
    const displayProgStateLoc = webGlContext.getUniformLocation(displayProg, "state")

    const vertexBuffer = webGlContext.createBuffer()
    webGlContext.bindBuffer(webGlContext.ARRAY_BUFFER, vertexBuffer)
    webGlContext.bufferData(webGlContext.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, 1, 1, -1, 1,
    ]), webGlContext.STATIC_DRAW)

    // Note we must bind ARRAY_BUFFER before running vertexAttribPointer!
    // This is confusing and deserves a blog post
    // https://stackoverflow.com/questions/7617668/glvertexattribpointer-needed-everytime-glbindbuffer-is-called
    webGlContext.vertexAttribPointer(stepperProgCoordLoc, 2, webGlContext.FLOAT, false, 0, 0)

    const elementBuffer = webGlContext.createBuffer()
    webGlContext.bindBuffer(webGlContext.ELEMENT_ARRAY_BUFFER, elementBuffer)
    webGlContext.bufferData(webGlContext.ELEMENT_ARRAY_BUFFER, new Uint8Array([0, 1, 2, 3]), webGlContext.STATIC_DRAW)

    const texture0 = webGlContext.createTexture()
    webGlContext.activeTexture(webGlContext.TEXTURE0)
    webGlContext.bindTexture(webGlContext.TEXTURE_2D, texture0)
    webGlContext.texImage2D(webGlContext.TEXTURE_2D, 0, webGlContext.RGB, webGlContext.RGB, webGlContext.UNSIGNED_BYTE, startStateImg)
    webGlContext.texParameteri(webGlContext.TEXTURE_2D, webGlContext.TEXTURE_MAG_FILTER, webGlContext.NEAREST)
    webGlContext.texParameteri(webGlContext.TEXTURE_2D, webGlContext.TEXTURE_MIN_FILTER, webGlContext.NEAREST)
    webGlContext.generateMipmap(webGlContext.TEXTURE_2D)

    const texture1 = webGlContext.createTexture()
    webGlContext.activeTexture(webGlContext.TEXTURE0 + 1)
    webGlContext.bindTexture(webGlContext.TEXTURE_2D, texture1)
    webGlContext.texImage2D(webGlContext.TEXTURE_2D, 0, webGlContext.RGB, webGlContext.RGB, webGlContext.UNSIGNED_BYTE, startStateImg)
    webGlContext.texParameteri(webGlContext.TEXTURE_2D, webGlContext.TEXTURE_MAG_FILTER, webGlContext.NEAREST)
    webGlContext.texParameteri(webGlContext.TEXTURE_2D, webGlContext.TEXTURE_MIN_FILTER, webGlContext.NEAREST)
    webGlContext.generateMipmap(webGlContext.TEXTURE_2D)

    const framebuffers = [webGlContext.createFramebuffer(), webGlContext.createFramebuffer()]

    webGlContext.bindFramebuffer(webGlContext.FRAMEBUFFER, framebuffers[0])
    webGlContext.framebufferTexture2D(webGlContext.FRAMEBUFFER, webGlContext.COLOR_ATTACHMENT0, webGlContext.TEXTURE_2D, texture0, 0)

    webGlContext.bindFramebuffer(webGlContext.FRAMEBUFFER, framebuffers[1])
    webGlContext.framebufferTexture2D(webGlContext.FRAMEBUFFER, webGlContext.COLOR_ATTACHMENT0, webGlContext.TEXTURE_2D, texture1, 0)

    let nextStateIndex = 0

    const fast = true

    if (fast) {
        requestAnimationFrame(loop)
    } else {
        setInterval(loop, 1000)
    }

    function loop(): void {
        const previousStateIndex = 1 - nextStateIndex

        webGlContext.bindFramebuffer(webGlContext.FRAMEBUFFER, framebuffers[nextStateIndex])
        webGlContext.useProgram(stepperProg)
        webGlContext.enableVertexAttribArray(stepperProgCoordLoc)
        webGlContext.uniform1i(stepperProgPreviousStateLoc, previousStateIndex)
        webGlContext.drawElements(webGlContext.TRIANGLE_FAN, 4, webGlContext.UNSIGNED_BYTE, 0)

        webGlContext.bindFramebuffer(webGlContext.FRAMEBUFFER, null)
        webGlContext.useProgram(displayProg)
        webGlContext.uniform1i(displayProgStateLoc, nextStateIndex)
        webGlContext.drawElements(webGlContext.TRIANGLE_FAN, 4, webGlContext.UNSIGNED_BYTE, 0)

        nextStateIndex = previousStateIndex
        if (fast) requestAnimationFrame(loop)
    }
}
startStateImg.src = "game-of-life.png"
