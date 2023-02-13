function init() {
	canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext("webgl");
	
	if (!gl) {
		/* gl is not defined */
		alert("Keliatannya perambanmu tidak mendukung WebGL. :(");
		
	} else {
		// Create shader
		const vertCode = `
			attribute vec4 vPosition;
			attribute vec4 vColor;
			varying vec4 fColor;
			uniform mat4 transformationMatrix;
			void main()
			{
				gl_Position = vPosition * transformationMatrix;
				fColor = vColor;
			}
		`;

		const vertShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShader, vertCode);
		gl.compileShader(vertShader);
		
		const fragCode = `
			precision mediump float;
			varying vec4 fColor;
			void main()
			{
				gl_FragColor = fColor;
			}
		`;

		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragShader, fragCode);
		gl.compileShader(fragShader);
		
		// Create program
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertShader);
		gl.attachShader(shaderProgram, fragShader);
		gl.linkProgram(shaderProgram);
		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.log(gl.getProgramInfoLog(shaderProgram));

		} else {
			gl.useProgram(shaderProgram);
			
			// Combine
			const positionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			const vertexCoord = gl.getAttribLocation(shaderProgram, "vPosition");
			gl.vertexAttribPointer(vertexCoord, 4, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(vertexCoord);

			const colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			const colorCoord = gl.getAttribLocation(shaderProgram, "vColor");
			gl.vertexAttribPointer(colorCoord, 4, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(colorCoord);

			const transformationMatrix = [
				1, 0, 0, 0.0,
				0, 1, 0, 0.0,
				0, 0, 1, 0.0,
				0, 0, 0, 1,
			];
			var translationMatrixLoc = gl.getUniformLocation(shaderProgram, "transformationMatrix");
			gl.uniformMatrix4fv(translationMatrixLoc, false, new Float32Array(transformationMatrix));
			
			gl.clearColor(0, 0, 0, 1.0);
			gl.enable(gl.DEPTH_TEST);
			gl.viewport(0, 0, canvas.width, canvas.height);

			// Set up drawing
			const positionArray = [
				// Red triangle
				0, 0, 0, 1,
				0.5, 0, 0, 1,
				0, 0.5, 0, 1,

				// Yellow triangle
				0.2, 0.2, 0.2, 1,
				0.7, 0.2, 0.2, 1,
				0.2, 0.7, 0.2, 1,
			];
			const colorArray = [
				// Red triangle
				1, 0, 0, 1,
				1, 0, 0, 1,
				1, 0, 0, 1,

				// Yellow triangle
				1, 1, 0, 1,
				1, 1, 0, 1,
				1, 1, 0, 1,
			];
			const mode = gl.TRIANGLES;
			const vertexCount = 6;
			
			// Render part
			gl.clear(gl.COLOR_BUFFER_BIT);

			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(positionArray),
				gl.STATIC_DRAW
			);
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(colorArray),
				gl.STATIC_DRAW
			);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			gl.drawArrays(mode, 0, vertexCount);
		}
	}
}

window.onload = init;
