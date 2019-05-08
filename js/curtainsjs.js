function Curtains(t,e){this.planes=[],this.drawStack=[],this._drawingEnabled=!0,this._needRender=!1;var i=t||"canvas";return this.container=document.getElementById(i),this.productionMode=e||!1,this.container?(this.loadingManager={texturesLoaded:0},this._init(),this):(this.productionMode||console.warn("You must specify a valid container ID"),this._onErrorCallback&&this._onErrorCallback(),!1)}function Plane(t,e,i){this.wrapper=t,this.htmlElement=e,this.images=[],this.videos=[],this.canvases=[],this.textures=[],this.index=this.wrapper.planes.length,this.canDraw=!1,this.definition={width:parseInt(i.widthSegments)||1,height:parseInt(i.heightSegments)||1},this.mimicCSS=i.mimicCSS,null!==this.mimicCSS&&void 0!==this.mimicCSS||(this.mimicCSS=!0),this.imageCover=i.imageCover,null!==this.imageCover&&void 0!==this.imageCover||(this.imageCover=!0),this.crossOrigin=i.crossOrigin||"anonymous",this.fov=i.fov||75,this.shouldUseDepthTest=!0;var r=this.htmlElement.getBoundingClientRect();this.size={width:r.width*this.wrapper.pixelRatio||this.wrapper.glCanvas.width,height:r.height*this.wrapper.pixelRatio||this.wrapper.glCanvas.height},this.offset={top:r.top||this.wrapper.container.boundingRect.top,left:r.left||this.wrapper.container.boundingRect.left},this.scale={x:1,y:1},this.translation={x:0,y:0,z:0},this.rotation={x:0,y:0,z:0},this.relativeTranslation={x:0,y:0};var a,n,s=i.vertexShaderID||e.getAttribute("data-vs-id"),o=i.fragmentShaderID||e.getAttribute("data-fs-id");i.vertexShader||(s&&document.getElementById(s)?a=document.getElementById(s).innerHTML:(this.wrapper.productionMode||console.warn("No vertex shader provided, will use a default one"),a="#ifdef GL_ES\nprecision mediump float;\n#endif\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nvarying vec3 vVertexPosition;\nvarying vec2 vTextureCoord;\nvoid main() {vTextureCoord = aTextureCoord;vVertexPosition = aVertexPosition;gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);}")),i.fragmentShader||(o&&document.getElementById(o)?n=document.getElementById(o).innerHTML:(this.wrapper.productionMode||console.warn("No fragment shader provided, will use a default one"),n="#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec3 vVertexPosition;\nvarying vec2 vTextureCoord;\nvoid main( void ) {gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);}")),this.shaders={},this.shaders.vertexShaderCode=i.vertexShader||a,this.shaders.fragmentShaderCode=i.fragmentShader||n,this._setupPlane(),i.uniforms||(this.wrapper.productionMode||console.warn("You are setting a plane without uniforms, you won't be able to interact with it. Please check your addPlane method for : ",this.htmlElement),i.uniforms={}),this.uniforms={};var h=this;i.uniforms&&Object.keys(i.uniforms).map(function(t,e){var r=i.uniforms[t];h.uniforms[t]={name:r.name,type:r.type,value:r.value,coreUniform:!1}}),this._setUniforms(this.uniforms);var l=Math.floor(i.widthSegments)||1,p=Math.floor(i.heightSegments)||1;return this.wrapper._stackPlane(l*p+l),this}Curtains.prototype._init=function(){if(this.glCanvas=document.createElement("canvas"),this.glContext=this.glCanvas.getContext("webgl",{alpha:!0})||this.glCanvas.getContext("experimental-webgl"),!this.glContext)return this.productionMode||console.warn("WebGL context could not be created"),void(this._onErrorCallback&&this._onErrorCallback());this.pixelRatio=window.devicePixelRatio||1,this.container.boundingRect=this.container.getBoundingClientRect(),this.glCanvas.style.width=Math.floor(this.container.boundingRect.width)+"px",this.glCanvas.style.height=Math.floor(this.container.boundingRect.height)+"px",this.glCanvas.width=Math.floor(this.container.boundingRect.width)*this.pixelRatio,this.glCanvas.height=Math.floor(this.container.boundingRect.height)*this.pixelRatio,this.glContext.viewport(0,0,this.glContext.drawingBufferWidth,this.glContext.drawingBufferHeight),this.glCanvas.addEventListener("webglcontextlost",this._contextLost.bind(this),!1),this.glCanvas.addEventListener("webglcontextrestored",this._contextRestored.bind(this),!1),this._readyToDraw()},Curtains.prototype.enableDrawing=function(){this._drawingEnabled=!0},Curtains.prototype.disableDrawing=function(){this._drawingEnabled=!1},Curtains.prototype.needRender=function(){this._needRender=!0},Curtains.prototype.onError=function(t){return t&&(this._onErrorCallback=t),this},Curtains.prototype._isInitialized=function(){if(!this.glCanvas||!this.glContext)return this.productionMode||console.warn("No WebGL canvas or context"),this._onErrorCallback&&this._onErrorCallback(),!1},Curtains.prototype._contextLost=function(t){t.preventDefault(),this.requestAnimationFrameID&&window.cancelAnimationFrame(this.requestAnimationFrameID)},Curtains.prototype._contextRestored=function(){for(var t=0;t<this.planes.length;t++){this.planes[t]._restoreContext()}var e=this;!function t(){e._drawScene(),e.requestAnimationFrameID=window.requestAnimationFrame(t)}()},Curtains.prototype.dispose=function(){for(;this.planes.length>0;)this.removePlane(this.planes[0]);var t=this,e=setInterval(function(){0==t.planes.length&&(clearInterval(e),t.glContext.clear(t.glContext.DEPTH_BUFFER_BIT|t.glContext.COLOR_BUFFER_BIT),window.cancelAnimationFrame(t.requestAnimationFrameID),t.glContext&&t.glContext.getExtension("WEBGL_lose_context").loseContext(),t.container.removeChild(t.glCanvas))},100)},Curtains.prototype._createPlane=function(t,e){var i=new Plane(this,t,e);return this.planes.push(i),i},Curtains.prototype.addPlane=function(t,e){if(this.glContext){if(!t||0===t.length)return this.productionMode||console.warn("The html element you specified does not currently exists in the DOM"),this._onErrorCallback&&this._onErrorCallback(),!1;for(var i=this._createPlane(t,e),r=[],a=0;a<i.htmlElement.getElementsByTagName("img").length;a++)r.push(i.htmlElement.getElementsByTagName("img")[a]);var n=[];for(a=0;a<i.htmlElement.getElementsByTagName("video").length;a++)n.push(i.htmlElement.getElementsByTagName("video")[a]);var s=[];for(a=0;a<i.htmlElement.getElementsByTagName("canvas").length;a++)s.push(i.htmlElement.getElementsByTagName("canvas")[a]);return r.length>0?i.loadImages(r):i.imagesLoaded=!0,n.length>0?i.loadVideos(n):i.videosLoaded=!0,s.length>0?i.loadCanvases(s):i.canvasesLoaded=!0,0!=r.length||0!=n.length||0!=s.length||this.productionMode||console.warn("This plane does not contain any image, video or canvas element. You may want to add some later with the loadImages, loadVideos or loadCanvases method."),i}return this.productionMode||console.warn("Unable to create a plane. The WebGl context couldn't be created"),this._onErrorCallback&&this._onErrorCallback(),null},Curtains.prototype.removePlane=function(t){t.canDraw=!1;for(var e,i,r,a=t.definition.width*t.definition.height+t.definition.width,n=this.drawStack,s=0;s<n.length;s++)n[s].definition==a&&(e=s);n[e].isReordering=!0;for(s=0;s<n[e].planesIndex.length;s++)t.index===n[e].planesIndex[s]&&(i=s);for(s=i+1;s<n[e].planesIndex.length;s++)n[e].planesIndex[s]--;this.drawStack[e].planesIndex.splice(i,1);for(s=0;s<t.textures.length;s++)"video"==t.textures[s].type&&(t.videos[t.textures[s].typeIndex].pause(),t.videos[t.textures[s].typeIndex].removeAttribute("src"),t.videos[t.textures[s].typeIndex].load(),t.videos[t.textures[s].typeIndex].updateInterval&&clearInterval(t.videos[t.textures[s].typeIndex].updateInterval)),this.glContext&&(this.glContext.activeTexture(this.glContext.TEXTURE0+t.textures[s].index),this.glContext.bindTexture(this.glContext.TEXTURE_2D,null),this.glContext.deleteTexture(t.textures[s].glTexture)),this.loadingManager.texturesLoaded--;this.glContext&&t&&(t.geometry&&(this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER,t.geometry.bufferInfos.id),this.glContext.bufferData(this.glContext.ARRAY_BUFFER,1,this.glContext.STATIC_DRAW),this.glContext.deleteBuffer(t.geometry.bufferInfos.id)),t.material&&(this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER,t.material.bufferInfos.id),this.glContext.bufferData(this.glContext.ARRAY_BUFFER,1,this.glContext.STATIC_DRAW),this.glContext.deleteBuffer(t.material.bufferInfos.id)),t.shaders&&(this.glContext.deleteShader(t.shaders.fragmentShader),this.glContext.deleteShader(t.shaders.vertexShader)),t.program&&this.glContext.deleteProgram(t.program));for(s=0;s<this.planes.length;s++)t.index===this.planes[s].index&&(r=s);t=null,this.planes[r]=null,this.planes.splice(r,1),this.glContext&&this.glContext.clear(this.glContext.DEPTH_BUFFER_BIT|this.glContext.COLOR_BUFFER_BIT),n[e].isReordering=!1},Curtains.prototype._stackPlane=function(t){if(0===this.drawStack.length){var e={definition:t,planesIndex:[this.planes.length],isReordering:!1};this.drawStack.push(e)}else{for(var i=!1,r=0;r<this.drawStack.length;r++)this.drawStack[r].definition==t&&(i=!0,this.drawStack[r].planesIndex.push(this.planes.length));if(!i){e={definition:t,planesIndex:[this.planes.length],isReordering:!1};this.drawStack.push(e)}}},Curtains.prototype._createShader=function(t,e){this._isInitialized();var i=this.glContext.createShader(e);return this.glContext.shaderSource(i,t),this.glContext.compileShader(i),this.glContext.getShaderParameter(i,this.glContext.COMPILE_STATUS)||this.glContext.isContextLost()?i:(this.productionMode||console.warn("Errors occurred while compiling the shader:\n"+this.glContext.getShaderInfoLog(i)),this._onErrorCallback&&this._onErrorCallback(),null)},Curtains.prototype._reSize=function(){var t=this.container.getBoundingClientRect();if(parseInt(this.glCanvas.style.width)!==Math.floor(t.width)||parseInt(this.glCanvas.style.height)!==Math.floor(t.height)){this.pixelRatio=window.devicePixelRatio||1,this.container.boundingRect=t,this.glCanvas.style.width=Math.floor(this.container.boundingRect.width)+"px",this.glCanvas.style.height=Math.floor(this.container.boundingRect.height)+"px",this.glCanvas.width=Math.floor(this.container.boundingRect.width)*this.pixelRatio,this.glCanvas.height=Math.floor(this.container.boundingRect.height)*this.pixelRatio,this.glContext.viewport(0,0,this.glContext.drawingBufferWidth,this.glContext.drawingBufferHeight);for(var e=0;e<this.planes.length;e++)this.planes[e].canDraw&&this.planes[e].planeResize()}},Curtains.prototype._handleDepth=function(t){this._isInitialized(),this._shouldHandleDepth=t,t?this.glContext.enable(this.glContext.DEPTH_TEST):this.glContext.disable(this.glContext.DEPTH_TEST)},Curtains.prototype._readyToDraw=function(){this._isInitialized(),this.container.appendChild(this.glCanvas),this.glContext.blendFunc(this.glContext.SRC_ALPHA,this.glContext.ONE_MINUS_SRC_ALPHA),this.glContext.enable(this.glContext.BLEND),this._handleDepth(!0),console.log("curtains.js - v1.8");var t=this;!function e(){t._drawScene(),t.requestAnimationFrameID=window.requestAnimationFrame(e)}()},Curtains.prototype._drawScene=function(){if(this._drawingEnabled||this._needRender){this._needRender&&(this._needRender=!1),this._isInitialized(),this.glContext.clearColor(0,0,0,0),this.glContext.clearDepth(1),this._reSize();for(var t=0;t<this.drawStack.length;t++)if(!this.drawStack[t].isReordering)for(var e=0;e<this.drawStack[t].planesIndex.length;e++){var i=this.planes[this.drawStack[t].planesIndex[e]];i&&(i.shouldUseDepthTest&&!this._shouldHandleDepth?this._handleDepth(!0):!i.shouldUseDepthTest&&this._shouldHandleDepth&&this._handleDepth(!1),0==e?i._drawPlane(!0):i._drawPlane(!1))}}},Plane.prototype._restoreContext=function(){this.canDraw=!1,this.shaders.vertexShader=null,this.shaders.fragmentShader=null,this.program=null,this.matrix=null,this.attributes=null,this.textures=[],this.geometry.bufferInfos=null,this.material.bufferInfos=null,this._setupPlane(),this._setUniforms(this.uniforms),this._createTextures("image"),this._createTextures("video")},Plane.prototype._setupPlane=function(){var t=this.wrapper.glContext;if(this.program=t.createProgram(),this.shaders.vertexShader=this.wrapper._createShader(this.shaders.vertexShaderCode,t.VERTEX_SHADER),this.shaders.fragmentShader=this.wrapper._createShader(this.shaders.fragmentShaderCode,t.FRAGMENT_SHADER),!(this.shaders.vertexShader&&this.shaders.fragmentShader||this.wrapper.productionMode))return this.wrapper.productionMode||console.warn("Unable to find the vertex or fragment shader"),this._onErrorCallback&&this._onErrorCallback(),!1;if(t.attachShader(this.program,this.shaders.vertexShader),t.attachShader(this.program,this.shaders.fragmentShader),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS)&&!t.isContextLost())return this.wrapper.productionMode||console.warn("Unable to initialize the shader program."),this._onErrorCallback&&this._onErrorCallback(),!1;t.useProgram(this.program),this.matrix={},this.matrix.mvMatrix=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),this.matrix.pMatrix=this._setPerspectiveMatrix(this.fov,.1,2*this.fov),this.matrix.pMatrixUniform=t.getUniformLocation(this.program,"uPMatrix"),this.matrix.mvMatrixUniform=t.getUniformLocation(this.program,"uMVMatrix");this._setAttributes({vertexPosition:"aVertexPosition",textureCoord:"aTextureCoord"})},Plane.prototype._isProgramInitialized=function(){if(!this.program)return this.wrapper.productionMode||console.warn("No WebGL program for this plane"),this._onErrorCallback&&this._onErrorCallback(),!1},Plane.prototype.onLoading=function(t){return t&&(this.onPlaneLoadingCallback=t),this},Plane.prototype.onReady=function(t){return t&&(this._onReadyCallback=t),this},Plane.prototype.onRender=function(t){return t&&(this.onRenderCallback=t),this},Plane.prototype._setPlaneDefinition=function(t,e){var i=this.wrapper.glContext;i.useProgram(this.program);for(var r=0;r<this.textures.length;r++)if(this.textures[r].sampler){var a=this.textures[r].sampler;this.uniforms[a]={},this.uniforms[a].location=i.getUniformLocation(this.program,a),this.uniforms[a].coreUniform=!0,i.uniform1i(this.uniforms[a].location,this.textures[r].index)}else this.uniforms["sampler"+this.textures[r].index]={},this.uniforms["sampler"+this.textures[r].index].location=i.getUniformLocation(this.program,"uSampler"+r),this.uniforms["sampler"+this.textures[r].index].coreUniform=!0,i.uniform1i(this.uniforms["sampler"+this.textures[r].index].location,this.textures[r].index);this._initializeBuffers(t,e)},Plane.prototype._setPlaneVertices=function(t,e){for(var i={vertices:[],uvs:[]},r=0;r<e;++r)for(var a=r/e,n=0;n<t;++n){var s=n/t;i.uvs.push(s),i.uvs.push(a),i.uvs.push(0),i.vertices.push(2*(s-.5)),i.vertices.push(2*(a-.5)),i.vertices.push(0),i.uvs.push(s+1/t),i.uvs.push(a),i.uvs.push(0),i.vertices.push(2*(s+1/t-.5)),i.vertices.push(2*(a-.5)),i.vertices.push(0),i.uvs.push(s),i.uvs.push(a+1/e),i.uvs.push(0),i.vertices.push(2*(s-.5)),i.vertices.push(2*(a+1/e-.5)),i.vertices.push(0),i.uvs.push(s),i.uvs.push(a+1/e),i.uvs.push(0),i.vertices.push(2*(s-.5)),i.vertices.push(2*(a+1/e-.5)),i.vertices.push(0),i.uvs.push(s+1/t),i.uvs.push(a+1/e),i.uvs.push(0),i.vertices.push(2*(s+1/t-.5)),i.vertices.push(2*(a+1/e-.5)),i.vertices.push(0),i.uvs.push(s+1/t),i.uvs.push(a),i.uvs.push(0),i.vertices.push(2*(s+1/t-.5)),i.vertices.push(2*(a-.5)),i.vertices.push(0)}return i},Plane.prototype._initializeBuffers=function(t,e){this.wrapper._isInitialized(),this._isProgramInitialized(),t=Math.floor(t)||1,e=Math.floor(e)||1;var i=this.htmlElement.getBoundingClientRect(),r=i.width*this.wrapper.pixelRatio||this.wrapper.glCanvas.width,a=i.height*this.wrapper.pixelRatio||this.wrapper.glCanvas.height;if(!this.geometry&&!this.material){var n=this._setPlaneVertices(t,e);this.geometry={},this.geometry.vertices=n.vertices,this.material={},this.material.uvs=n.uvs}this.geometry.innerScale={x:r/this.wrapper.glCanvas.width,y:a/this.wrapper.glCanvas.height},this.clipSpace={x:(this.geometry.innerScale.x-1)*(this.wrapper.glCanvas.width/this.wrapper.glCanvas.height/2)/this.scale.x,y:(1-this.geometry.innerScale.y)/2/this.scale.y,width:this.wrapper.glCanvas.width/this.wrapper.glCanvas.height,height:2},this.mimicCSS?this._applyCSSPositions():this.setTranslation(0,0,0);for(var s=0;s<this.textures.length;s++)this._adjustTextureSize(s,!0);var o=this.wrapper.glContext;this.geometry.bufferInfos={},this.geometry.bufferInfos.id=o.createBuffer(),o.bindBuffer(o.ARRAY_BUFFER,this.geometry.bufferInfos.id),o.bufferData(o.ARRAY_BUFFER,new Float32Array(this.geometry.vertices),o.STATIC_DRAW),this.geometry.bufferInfos.itemSize=3,this.geometry.bufferInfos.numberOfItems=this.geometry.vertices.length/this.geometry.bufferInfos.itemSize,o.vertexAttribPointer(this.attributes.vertexPosition,this.geometry.bufferInfos.itemSize,o.FLOAT,!1,0,0),o.enableVertexAttribArray(this.attributes.vertexPosition),this.material.bufferInfos={},this.material.bufferInfos.id=o.createBuffer(),o.bindBuffer(o.ARRAY_BUFFER,this.material.bufferInfos.id),o.bufferData(o.ARRAY_BUFFER,new Float32Array(this.material.uvs),o.STATIC_DRAW),this.material.bufferInfos.itemSize=3,this.material.bufferInfos.numberOfItems=this.material.uvs.length/this.material.bufferInfos.itemSize,o.vertexAttribPointer(this.attributes.textureCoord,this.material.bufferInfos.itemSize,o.FLOAT,!1,0,0),o.enableVertexAttribArray(this.attributes.textureCoord),this.canDraw=!0,this._onReadyCallback&&this._onReadyCallback()},Plane.prototype._bindPlaneBuffers=function(){var t=this.wrapper.glContext;t.bindBuffer(t.ARRAY_BUFFER,this.geometry.bufferInfos.id),t.vertexAttribPointer(this.attributes.vertexPosition,this.geometry.bufferInfos.itemSize,t.FLOAT,!1,0,0),t.enableVertexAttribArray(this.attributes.vertexPosition),t.bindBuffer(t.ARRAY_BUFFER,this.material.bufferInfos.id),t.vertexAttribPointer(this.attributes.textureCoord,this.material.bufferInfos.itemSize,t.FLOAT,!1,0,0),t.enableVertexAttribArray(this.attributes.textureCoord)},Plane.prototype._setAttributes=function(t){this.wrapper._isInitialized(),this._isProgramInitialized(),this.attributes||(this.attributes={});var e=this;Object.keys(t).map(function(i,r){var a=t[i];e.attributes[i]=e.wrapper.glContext.getAttribLocation(e.program,a)})},Plane.prototype._handleUniformSetting=function(t,e,i){var r=this.wrapper.glContext;"1i"==t?r.uniform1i(e,i):"1iv"==t?r.uniform1iv(e,i):"1f"==t?r.uniform1f(e,i):"1fv"==t?r.uniform1fv(e,i):"2i"==t?r.uniform2i(e,i[0],i[1]):"2iv"==t?r.uniform2iv(e,i):"2f"==t?r.uniform2f(e,i[0],i[1]):"2fv"==t?r.uniform2fv(e,i):"3i"==t?r.uniform3i(e,i[0],i[1],i[2]):"3iv"==t?r.uniform3iv(e,i):"3f"==t?r.uniform3f(e,i[0],i[1],i[2]):"3fv"==t?r.uniform3fv(e,i):"4i"==t?r.uniform4i(e,i[0],i[1],i[2],i[3]):"4iv"==t?r.uniform4iv(e,i):"4f"==t?r.uniform4f(e,i[0],i[1],i[2],i[3]):"4fv"==t?r.uniform4fv(e,i):"mat2"==t?r.uniformMatrix2fv(e,!1,i):"mat3"==t?r.uniformMatrix3fv(e,!1,i):"mat4"==t?r.uniformMatrix4fv(e,!1,i):this.wrapper.productionMode||console.warn("This uniform type is not handled : ",t)},Plane.prototype._setUniforms=function(t){this.wrapper._isInitialized(),this._isProgramInitialized(),this.wrapper.glContext.useProgram(this.program);var e=this;t&&Object.keys(t).map(function(i,r){var a=t[i];a.coreUniform||(e.uniforms[i].location=e.wrapper.glContext.getUniformLocation(e.program,a.name),a.type||(Array.isArray(a.value)?4==a.value.length?(a.type="4f",this.wrapper.productionMode||console.warn("No uniform type declared for "+a.name+", applied a 4f (array of 4 floats) uniform type")):3==a.value.length?(a.type="3f",this.wrapper.productionMode||console.warn("No uniform type declared for "+a.name+", applied a 3f (array of 3 floats) uniform type")):2==a.value.length&&(a.type="2f",this.wrapper.productionMode||console.warn("No uniform type declared for "+a.name+", applied a 2f (array of 2 floats) uniform type")):a.value.constructor===Float32Array?16==a.value.length?(a.type="mat4",this.wrapper.productionMode||console.warn("No uniform type declared for "+a.name+", applied a mat4 (4x4 matrix array) uniform type")):9==a.value.length?(a.type="mat3",this.wrapper.productionMode||console.warn("No uniform type declared for "+a.name+", applied a mat3 (3x3 matrix array) uniform type")):4==a.value.length&&(a.type="mat2",this.wrapper.productionMode||console.warn("No uniform type declared for "+a.name+", applied a mat2 (2x2 matrix array) uniform type")):(a.type="1f",this.wrapper.productionMode||console.warn("No uniform type declared for "+a.name+", applied a 1f (float) uniform type"))),e._handleUniformSetting(a.type,e.uniforms[i].location,a.value))})},Plane.prototype._updateUniforms=function(){if(this.wrapper.glContext.useProgram(this.program),this.uniforms&&this.wrapper.glContext.isProgram(this.program)){var t=this.uniforms,e=this;Object.keys(t).map(function(i,r){var a=t[i];if(!a.coreUniform){var n=a.location,s=a.value,o=a.type;e._handleUniformSetting(o,n,s)}})}},Plane.prototype._multiplyMatrix=function(t,e){var i=[],r=t[0],a=t[1],n=t[2],s=t[3],o=t[4],h=t[5],l=t[6],p=t[7],d=t[8],u=t[9],f=t[10],g=t[11],c=t[12],m=t[13],x=t[14],v=t[15],y=e[0],C=e[1],w=e[2],_=e[3];return i[0]=y*r+C*o+w*d+_*c,i[1]=y*a+C*h+w*u+_*m,i[2]=y*n+C*l+w*f+_*x,i[3]=y*s+C*p+w*g+_*v,y=e[4],C=e[5],w=e[6],_=e[7],i[4]=y*r+C*o+w*d+_*c,i[5]=y*a+C*h+w*u+_*m,i[6]=y*n+C*l+w*f+_*x,i[7]=y*s+C*p+w*g+_*v,y=e[8],C=e[9],w=e[10],_=e[11],i[8]=y*r+C*o+w*d+_*c,i[9]=y*a+C*h+w*u+_*m,i[10]=y*n+C*l+w*f+_*x,i[11]=y*s+C*p+w*g+_*v,y=e[12],C=e[13],w=e[14],_=e[15],i[12]=y*r+C*o+w*d+_*c,i[13]=y*a+C*h+w*u+_*m,i[14]=y*n+C*l+w*f+_*x,i[15]=y*s+C*p+w*g+_*v,i},Plane.prototype._setPerspectiveMatrix=function(t,e,i){var r=this.wrapper.glCanvas.width/this.wrapper.glCanvas.height;return t!==this.fov&&(this.fov=t),[t/r,0,0,0,0,t,0,0,0,0,(e+i)*(1/(e-i)),-1,0,0,e*i*(1/(e-i))*2,0]},Plane.prototype.setPerspective=function(t,e,i){var r=parseInt(t)||75;r<0?r=0:r>180&&(r=180);var a=parseFloat(e)||.1,n=parseFloat(i)||100,s=this.translation.x||0,o=this.translation.y||0;this.matrix.pMatrix=this._setPerspectiveMatrix(r,a,n),this.setTranslation(s,o,0)},Plane.prototype.setScale=function(t,e){this.wrapper._isInitialized(),this._isProgramInitialized(),t=parseFloat(t)||1,t=Math.max(t,.001),e=parseFloat(e)||1,e=Math.max(e,.001),this.scale={x:t,y:e},this.matrix.mvMatrix=this._setMVMatrix();for(var i=0;i<this.textures.length;i++)this._adjustTextureSize(i,!1)},Plane.prototype.setRotation=function(t,e,i){this.wrapper._isInitialized(),this._isProgramInitialized(),t=parseFloat(t)||0,e=parseFloat(e)||0,i=parseFloat(i)||0,this.rotation={x:t,y:e,z:i},this.matrix.mvMatrix=this._setMVMatrix()},Plane.prototype.setTranslation=function(t,e,i){this.wrapper._isInitialized(),this._isProgramInitialized(),t=t||0,e=e||0,i=i||0,this.translation={x:t,y:e,z:i},this.matrix.mvMatrix=this._setMVMatrix()},Plane.prototype.setRelativePosition=function(t,e){var i=this._documentToPlaneSpace(t,e);this.relativeTranslation={x:t,y:e},this.setTranslation(i.x,i.y,this.translation.z)},Plane.prototype._documentToPlaneSpace=function(t,e){return{x:this.clipSpace.x+t/(this.wrapper.glCanvas.width/this.wrapper.pixelRatio)*this.clipSpace.width,y:this.clipSpace.y-e/(this.wrapper.glCanvas.height/this.wrapper.pixelRatio)}},Plane.prototype.mouseToPlaneCoords=function(t,e){return{x:(t-(this.offset.left+window.pageXOffset))/(this.size.width/this.wrapper.pixelRatio)*2-1,y:1-(e-(this.offset.top+window.pageYOffset))/(this.size.height/this.wrapper.pixelRatio)*2}},Plane.prototype._applyCSSPositions=function(){this.size.width,this.size.height;var t=this.wrapper.container.boundingRect,e={top:this.offset.top-t.top,left:this.offset.left-t.left},i=this._documentToPlaneSpace(e.left,e.top);this.relativeTranslation={x:e.left,y:e.top},this.setTranslation(i.x,i.y,this.translation.z)},Plane.prototype.updatePosition=function(){if(this.mimicCSS){var t=this.htmlElement.getBoundingClientRect();this.offset={top:t.top,left:t.left},this._applyCSSPositions()}},Plane.prototype.enableDepthTest=function(t){this.shouldUseDepthTest=t},Plane.prototype.moveToFront=function(){this.enableDepthTest(!1);for(var t,e=this.definition.width*this.definition.height+this.definition.width,i=this.wrapper.drawStack,r=0;r<i.length;r++)i[r].definition==e&&(t=i[r]);t.isReordering=!0;var a=this.index;if(t.planesIndex.length>0){for(r=0;r<t.planesIndex.length;r++)t.planesIndex[r]==a&&t.planesIndex.splice(r,1);t.planesIndex.push(this.index)}if(i.length>0){for(r=0;r<i.length;r++)i[r].definition==e&&i.splice(r,1);i.push(t)}t.isReordering=!1},Plane.prototype._setMVMatrix=function(){var t=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),e=this.translation.z-this.fov/2,i=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,this.translation.x,this.translation.y,e,1]),r=new Float32Array([1,0,0,0,0,Math.cos(this.rotation.x),Math.sin(this.rotation.x),0,0,-Math.sin(this.rotation.x),Math.cos(this.rotation.x),0,0,0,0,1]),a=new Float32Array([Math.cos(this.rotation.y),0,-Math.sin(this.rotation.y),0,0,1,0,0,Math.sin(this.rotation.y),0,Math.cos(this.rotation.y),0,0,0,0,1]),n=new Float32Array([Math.cos(this.rotation.z),Math.sin(this.rotation.z),0,0,-Math.sin(this.rotation.z),Math.cos(this.rotation.z),0,0,0,0,1,0,0,0,0,1]),s={x:this.scale.x*(this.wrapper.glCanvas.width/this.wrapper.glCanvas.height*this.geometry.innerScale.x/2),y:this.scale.y*this.geometry.innerScale.y/2},o=new Float32Array([s.x,0,0,0,0,s.y,0,0,0,0,1,0,0,0,0,1]),h=this._multiplyMatrix(t,i);return h=this._multiplyMatrix(h,r),h=this._multiplyMatrix(h,a),h=this._multiplyMatrix(h,n),h=this._multiplyMatrix(h,o)},Plane.prototype.planeResize=function(){var t=this.wrapper.glCanvas.width/this.wrapper.glCanvas.height;this.matrix.pMatrix=this._setPerspectiveMatrix(this.fov,.1,2*this.fov);var e=this.htmlElement.getBoundingClientRect(),i=e.width*this.wrapper.pixelRatio,r=e.height*this.wrapper.pixelRatio;if(!i&&!r){var a=document.getElementsByClassName(this.htmlElement.className);if(a.length>0)for(var n=0;n<a.length;n++)if(a[n].isEqualNode(this.htmlElement)){this.htmlElement=a[n];var s=this.htmlElement.getBoundingClientRect();i=s.width*this.wrapper.pixelRatio,r=s.height*this.wrapper.pixelRatio}}if(i&&r){var o=!1;if(i===this.size.width&&r===this.size.height||(o=!0),this.size={width:i,height:r},this.offset={top:e.top,left:e.left},this.geometry.innerScale={x:i/this.wrapper.glCanvas.width,y:r/this.wrapper.glCanvas.height},this.clipSpace={x:(this.geometry.innerScale.x-1)*(t/2)/this.scale.x,y:(1-this.geometry.innerScale.y)/2/this.scale.y,width:t,height:2},this.mimicCSS?this._applyCSSPositions():this.setTranslation(this.translation.x,this.translation.y,this.translation.z),o)for(n=0;n<this.textures.length;n++)this._adjustTextureSize(n,!1)}},Plane.prototype.loadImages=function(t){var e,i=this;this.imagesLoaded=!1;for(var r=0;r<t.length;r++)(e=new Image).onload=function(){i.images.push(this),i.onPlaneLoadingCallback&&i.onPlaneLoadingCallback()},e.crossOrigin=i.crossOrigin,e.sampler=t[r].getAttribute("data-sampler")||null,e.src=t[r].src,e.shouldUpdate=!0;var a=setInterval(function(){i.images.length==t.length&&(clearInterval(a),t.length>1?i._reorderImages(t):i._createTextures("image"))},100);return this},Plane.prototype._reorderImages=function(t){for(var e=[],i=0;i<t.length;i++)for(var r=0;r<this.images.length;r++)this.images[r].src==t[i].src&&(e[i]=this.images[r]);this.images=e,this._createTextures("image")},Plane.prototype.loadVideos=function(t){var e,i=this;this.videosLoaded=!1;var r=this.wrapper.glContext;function a(a,n){(e=document.createElement("video")).preload=!0,e.muted=!0,e.loop=!0,e.width=512,e.height=512,e.sampler=t[n].getAttribute("data-sampler")||null,e.crossOrigin=i.crossOrigin,e.firstStarted=!1;var s,o=!1,h=!1;function l(t){o&&h&&!t.firstStarted&&(s=setInterval(function(){t.readyState>=t.HAVE_CURRENT_DATA&&(clearInterval(s),function(t){t.firstStarted=!0,t.updateInterval||(t.updateInterval=setInterval(function(){t.frameUpdate=!0,r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!0)},33))}(t))},10))}if(e.frameUpdate=!1,e.shouldUpdate=!0,e.addEventListener("timeupdate",function(){h=!0,l(this)}),e.addEventListener("play",function(){o=!0,l(this)}),t[n].src)e.src=t[n].src,e.type=t[n].type;else if(t[n].getElementsByTagName("source").length>0)for(var p=0;p<t[n].getElementsByTagName("source").length;p++){var d=document.createElement("source");d.setAttribute("src",t[n].getElementsByTagName("source")[p].src),d.setAttribute("type",t[n].getElementsByTagName("source")[p].type),e.appendChild(d)}a.videos.push(e),a.onPlaneLoadingCallback&&a.onPlaneLoadingCallback()}for(var n=0;n<t.length;n++)a(this,n);var s=setInterval(function(){i.videos.length==t.length&&(clearInterval(s),i._createTextures("video"))},100);return this},Plane.prototype.playVideos=function(){for(var t=0;t<this.textures.length;t++)if("video"==this.textures[t].type){var e=this.videos[this.textures[t].typeIndex].play(),i=(this.textures[t],this);void 0!==e&&e.catch(function(t){i.wrapper.productionMode||console.warn("Could not play the video : ",t)})}},Plane.prototype.loadCanvases=function(t){var e,i=this;this.canvasesLoaded=!1;for(var r=0;r<t.length;r++)(e=t[r]).sampler=t[r].getAttribute("data-sampler")||null,e.shouldUpdate=!0,this.canvases.push(e),this.onPlaneLoadingCallback&&this.onPlaneLoadingCallback();var a=setInterval(function(){i.canvases.length==t.length&&(clearInterval(a),i._createTextures("canvase"))},100);return this},Plane.prototype._createTextures=function(t){function e(t,e,i){var r=t.wrapper.glContext,a={};a.type=e,a.typeIndex=i,a.sampler=t[e+"s"][i].sampler||null,a.glTexture=r.createTexture(),"video"!=a.type&&r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!0),r.bindTexture(r.TEXTURE_2D,a.glTexture),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),a.index=t.wrapper.loadingManager.texturesLoaded,t.textures.push(a),t.wrapper.loadingManager.texturesLoaded++}this.wrapper._isInitialized();for(var i=0;i<this[t+"s"].length;i++)e(this,t,i);this[t+"sLoaded"]=!0,this.imagesLoaded&&this.videosLoaded&&this.canvasesLoaded&&this.wrapper.glContext.getProgramParameter(this.program,this.wrapper.glContext.LINK_STATUS)&&this._setPlaneDefinition(this.definition.width,this.definition.height)},Plane.prototype._bindPlaneTexture=function(t){var e=this.wrapper.glContext;e.activeTexture(e.TEXTURE0+t.index),e.bindTexture(e.TEXTURE_2D,t.glTexture)},Plane.prototype._adjustTextureSize=function(t,e){if(this.wrapper._isInitialized(),"image"==this.textures[t].type){var i=this.images[this.textures[t].typeIndex],r=this.wrapper.glContext;if(this.imageCover&&i.shouldUpdate){var a=document.createElement("canvas"),n=a.getContext("2d");a.width=this.size.width*this.scale.x,a.height=this.size.height*this.scale.y;var s=i.width,o=i.height,h=s/o,l=a.width/a.height,p=0,d=0;l>h?d=Math.min(0,(a.height-a.width*(1/h))/2):l<h&&(p=Math.min(0,(a.width-a.height*h)/2)),n.drawImage(i,0,0,s,o,p,Math.round(d),Math.round(a.width-2*p),Math.round(a.height-2*d)),r.useProgram(this.program),this._bindPlaneTexture(this.textures[t]),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,a)}else e&&(r.useProgram(this.program),this._bindPlaneTexture(this.textures[t]),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,i))}},Plane.prototype._drawPlane=function(t){var e=this.wrapper.glContext;if(this.canDraw){function i(t,e,i){var r=e.textures[i];e._bindPlaneTexture(r),"video"==r.type?e.videos[r.typeIndex].firstStarted?e.videos[r.typeIndex].frameUpdate&&e.videos[r.typeIndex].shouldUpdate&&(t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e.videos[r.typeIndex]),e.videos[r.typeIndex].frameUpdate=!1):(t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]))):"canvase"==r.type&&e.canvases[r.typeIndex].shouldUpdate&&t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e.canvases[r.typeIndex])}this.onRenderCallback&&this.onRenderCallback();for(var r=0;r<this.textures.length;r++)i(e,this,r);this._updateUniforms(),t&&this._bindPlaneBuffers(),e.uniformMatrix4fv(this.matrix.pMatrixUniform,!1,this.matrix.pMatrix),e.uniformMatrix4fv(this.matrix.mvMatrixUniform,!1,this.matrix.mvMatrix),e.drawArrays(e.TRIANGLES,0,this.geometry.bufferInfos.numberOfItems)}};
