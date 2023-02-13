const vSource = `
  attribute vec4 vPosition;
  attribute vec4 vColor;
  varying vec4 fColor;
  void main(){
    gl_Position = vPosition;
    fColor = vColor;
  }
`;

const fSource = `
  precision mediump float;
  varying vec4 fColor;
  void main(){
    gl_FragColor = fColor;
  }
`;

//Canvas Purposes
const canvas = document.getElementById('gl-canvas');
const gl = setupWebGL(canvas);

var vertices = [
    [-0.7,0.7],[0.3,0.7],[-0.7,-0.3],[0.3,-0.3],
    [-0.3,0.3],[0.7,0.3],[-0.3,-0.7],[0.7,-0.7],
];
var colors = [
    [1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],
    [0,1,0,1],[0,1,0,1],[0,1,0,1],[0,1,0,1],
];
var theta = 0;
function changeTheta(newTheta){
    theta = newTheta
    console.log(theta);
}


var isDown = false;

const mouseMoveListener = (e) => {
    //Hitung koordinat mouse
    if(isDown){
        let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
        let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
        vertices[vertices.length-1][0] = x;
        vertices[vertices.length-1][1] = y;
        vertices[vertices.length-2][0] = x;
        vertices[vertices.length-3][1] = y;
    }
}

canvas.addEventListener('mousedown', (e) => {
    console.log("down");
    let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
    //console.log(x, y);
    for(let i=0; i<4; i++){
        vertices.push([x, y]);
        colors.push([0,0,0,1]);
    }
    isDown = true;
})
canvas.addEventListener('mouseup', (e) => {
    isDown = false;
})

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.8, 0.8, 0.8, 1.0);

//  Load shaders and initialize attribute buffers
const program = initShaders(gl, vSource, fSource);
gl.useProgram(program);

// Associate out shader variables with our data buffer
const vBuffer = gl.createBuffer();
const cBuffer = gl.createBuffer();

render();
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    /*
    verticesFinal = [];
    for(let i=0; i<vertices.length; i+=4){
        let centroid = [(vertices[i][0] + vertices[i+3][0])/2, (vertices[i][1] + vertices[i+3][1])/2];
        for(let j=0; j<4; j++){
            dis = euclideanDistance(centroid, vertices[i+j]);
            arg = norm(Math.atan2(vertices[i+j][0] - centroid[0], vertices[i+j][1] - centroid[1]) + theta/180 * Math.PI);
            verticesFinal.push([
                centroid[0] + dis * Math.cos(arg),
                centroid[1] + dis * Math.sin(arg)
            ])
        }
    }
    */

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length);
    for(let i=0; i<vertices.length; i+=4){
        gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
    }
    
    window.requestAnimFrame(render);
}
