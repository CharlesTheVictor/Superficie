//Curtains.js
window.onload = function(){

    // our canvas container
    var canvasContainer = document.getElementById("canvas");

    // track the mouse positions to send it to the shaders
    var mousePosition = {
        x: 0,
        y: 0,
    };
    // we will keep track of the last position in order to calculate the movement strength/delta
    var mouseLastPosition = {
        x: 0,
        y: 0,
    };
    var mouseDelta = 0;

    // set up our WebGL context and append the canvas to our wrapper
    var webGLCurtain = new Curtains("canvas");

    // get our plane element
    var planeElements = document.getElementsByClassName("curtain");


    // could be useful to get pixel ratio
    var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1.0;

    // some basic parameters
    // we don't need to specifiate vertexShaderID and fragmentShaderID because we already passed it via the data attributes of the plane HTML element
    var params = {
        widthSegments: 20,
        heightSegments: 20,
        uniforms: {
            resolution: { // resolution of our plane
                name: "uResolution",
                type: "2f", // notice this is an length 2 array of floats
                value: [pixelRatio * planeElements[0].clientWidth, pixelRatio * planeElements[0].clientHeight],
            },
            time: { // time uniform that will be updated at each draw call
                name: "uTime",
                type: "1f",
                value: 0,
            },
            mousePosition: { // our mouse position
                name: "uMousePosition",
                type: "2f", // again an array of floats
                value: [mousePosition.x, mousePosition.y],
            },
            mouseMoveStrength: { // the mouse move strength
                name: "uMouseMoveStrength",
                type: "1f",
                value: 0,
            }
        }
    }

    // create our plane
    var simplePlane = webGLCurtain.addPlane(planeElements[0], params);

    simplePlane.onReady(function() {
        // set a fov of 35 to exagerate perspective
        simplePlane.setPerspective(35);

        // now that our plane is ready we can listen to mouse move event
        var wrapper = document.getElementById("page-wrap");

        wrapper.addEventListener("mousemove", function(e) {
            handleMovement(e, simplePlane);
        });

        wrapper.addEventListener("touchmove", function(e) {
            handleMovement(e, simplePlane);
        });

        // on resize, update the resolution uniform
        window.onresize = function() {
            simplePlane.uniforms.resolution.value = [pixelRatio * planeElements[0].clientWidth, pixelRatio * planeElements[0].clientHeight];
        }

    }).onRender(function() {
        // increment our time uniform
        simplePlane.uniforms.time.value++;

        // send the new mouse move strength value
        simplePlane.uniforms.mouseMoveStrength.value = mouseDelta;
        // decrease the mouse move strenght a bit : if the user doesn't move the mouse, effect will fade away
        mouseDelta = Math.max(0, mouseDelta * 0.995);
    });

    // handle the mouse move event
    function handleMovement(e, plane) {

        if(mousePosition.x != -100000 && mousePosition.y != -100000) {
            // if mouse position is defined, set mouse last position
            mouseLastPosition.x = mousePosition.x;
            mouseLastPosition.y = mousePosition.y;
        }

        // touch event
        if(e.targetTouches) {

            mousePosition.x = e.targetTouches[0].clientX;
            mousePosition.y = e.targetTouches[0].clientY;
        }
        // mouse event
        else {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        }

        // convert our mouse/touch position to coordinates relative to the vertices of the plane
        var mouseCoords = plane.mouseToPlaneCoords(mousePosition.x, mousePosition.y);
        // update our mouse position uniform
        plane.uniforms.mousePosition.value = [mouseCoords.x, mouseCoords.y];

        // calculate the mouse move strength
        if(mouseLastPosition.x && mouseLastPosition.y) {
            var delta = Math.sqrt(Math.pow(mousePosition.x - mouseLastPosition.x, 2) + Math.pow(mousePosition.y - mouseLastPosition.y, 2)) / 30;
            delta = Math.min(4, delta);
            // update mouseDelta only if it increased
            if(delta >= mouseDelta) {
                mouseDelta = delta;
                // reset our time uniform
                plane.uniforms.time.value = 0;
            }
        }
    }
}
//


// //PIXI.js
// var PixiDiv = document.getElementById("pixi");

// console.clear();

// let mesh;
// let cloth;
// let spacingX = 5;
// let spacingY = 5;
// let accuracy = 1;

// let opts = {
//   image: 'https://cdn.vox-cdn.com/uploads/chorus_asset/file/3787580/tumblr_nprcviYxd71syjt2wo1_1280.0.gif',
//   gravity: 750,//0,750
//   friction: .5,
//   bounce: 0.25,
//   pointsX: 6,
//   pointsY: 6,
//   renderCloth: false,
//   mouseInfluence: 50,
//   pinCorners: true,
// };



// let canvas = document.createElement('canvas');
// let ctx = canvas.getContext('2d');
// PixiDiv.appendChild(canvas);

// ctx.strokeStyle = '#555';

// let mouse = {
  
//   down: false,
//   x: 0,
//   y: 0,
//   px: 0,
//   py: 1
// }

// /*////////////////////////////////////////*/

// let stage = new PIXI.Container();

// console.log(PixiDiv.clientWidth+'/'+PixiDiv.clientWidth)
// let renderer = PIXI.autoDetectRenderer(PixiDiv.clientWidth, PixiDiv.clientHeight, { transparent: true });

// PixiDiv.insertBefore(renderer.view, canvas);
// renderer.render(stage);

// canvas.width = renderer.width;
// canvas.height = renderer.height;


// /*////////////////////////////////////////*/

// function loadTexture() {
  
//   console.log('loading texture', opts.image);
  
//   document.body.className = 'loading';

//   let texture = new PIXI.Texture.fromImage(opts.image);
//   if ( !texture.requiresUpdate ) { texture.update(); }
  
//   texture.on('error', function(){ console.error('AGH!'); });

//   texture.on('update',function(){
//   document.body.className = '';
    
//     console.log('texture loaded');

//     if ( mesh ) { stage.removeChild(mesh); }
    
//     mesh = new PIXI.mesh.Plane( this, opts.pointsX, opts.pointsY);
//     mesh.width = this.width;
//     mesh.height = this.height;

//     spacingX = mesh.width / (opts.pointsX-1);
//     spacingY = mesh.height / (opts.pointsY-1);

//     cloth = new Cloth(opts.pointsX-1, opts.pointsY-1, !opts.pinCorners);

//     stage.addChild(mesh);
//   });
// }

// loadTexture(opts.image);

// ;(function update() {
//   requestAnimationFrame(update);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   if ( cloth ) { cloth.update(0.016) }
//   renderer.render(stage);
// })(0)

// /*////////////////////////////////////////*/

// class Point {
//   constructor (x, y) {
//     this.x = x
//     this.y = y
//     this.px = x
//     this.py = y
//     this.vx = 0
//     this.vy = 0
//     this.pinX = null
//     this.pinY = null

//     this.constraints = []
//   }

//   update (delta) {
//     if (this.pinX && this.pinY) return this

//     if (mouse.down) {
//       let dx = this.x - mouse.x
//       let dy = this.y - mouse.y
//       let dist = Math.sqrt(dx * dx + dy * dy)

//       if (mouse.button === 1 && dist < opts.mouseInfluence) {
//         this.px = this.x - (mouse.x - mouse.px)
//         this.py = this.y - (mouse.y - mouse.py)
//       } else if (dist < mouse.cut) {
//         this.constraints = []
//       }
//     }

//     this.addForce(0, opts.gravity)

//     let nx = this.x + (this.x - this.px) * opts.friction + this.vx * delta
//     let ny = this.y + (this.y - this.py) * opts.friction + this.vy * delta

//     this.px = this.x
//     this.py = this.y

//     this.x = nx
//     this.y = ny

//     this.vy = this.vx = 0

//     if (this.x >= canvas.width) {
//       this.px = canvas.width + (canvas.width - this.px) * opts.bounce
//       this.x = canvas.width
//     } else if (this.x <= 0) {
//       this.px *= -1 * opts.bounce
//       this.x = 0
//     }

//     if (this.y >= canvas.height) {
//       this.py = canvas.height + (canvas.height - this.py) * opts.bounce
//       this.y = canvas.height
//     } else if (this.y <= 0) {
//       this.py *= -1 * opts.bounce
//       this.y = 0
//     }

//     return this
//   }

//   draw () {
//     let i = this.constraints.length
//     while (i--) this.constraints[i].draw()
//   }

//   resolve () {
//     if (this.pinX && this.pinY) {
//       this.x = this.pinX
//       this.y = this.pinY
//       return
//     }

//     this.constraints.forEach((constraint) => constraint.resolve())
//   }

//   attach (point) {
//     this.constraints.push(new Constraint(this, point))
//   }

//   free (constraint) {
//     this.constraints.splice(this.constraints.indexOf(constraint), 1)
//   }

//   addForce (x, y) {
//     this.vx += x
//     this.vy += y
//   }

//   pin (pinx, piny) {
//     this.pinX = pinx
//     this.pinY = piny
//   }
  
//   unpin(){
//     this.pinX = null;
//     this.pinY = null;
//   }
// }

// /*////////////////////////////////////////*/

// class Constraint {
//   constructor (p1, p2, length) {
//     this.p1 = p1
//     this.p2 = p2
//     this.length = length || spacingX
//   }

//   resolve () {
//     let dx = this.p1.x - this.p2.x
//     let dy = this.p1.y - this.p2.y
//     let dist = Math.sqrt(dx * dx + dy * dy)

//     if (dist < this.length) return

//     let diff = (this.length - dist) / dist

//     //if (dist > tearDist) this.p1.free(this)

//     let mul = diff * 0.5 * (1 - this.length / dist)

//     let px = dx * mul
//     let py = dy * mul

//     !this.p1.pinX && (this.p1.x += px)
//     !this.p1.pinY && (this.p1.y += py)
//     !this.p2.pinX && (this.p2.x -= px)
//     !this.p2.pinY && (this.p2.y -= py)

//     return this
//   }

//   draw () {
//     ctx.moveTo(this.p1.x, this.p1.y)
//     ctx.lineTo(this.p2.x, this.p2.y)
//   }
// }

// /*////////////////////////////////////////*/

// let count = 0;

// class Cloth {
//   constructor (clothX, clothY, free) {
//     this.points = []

//     let startX = canvas.width / 2 - clothX * spacingX / 2;
//     let startY = 1;
		
// 		let dims = {x:canvas.width,y:canvas.height}
// 		function pinned(x,y,clothX,clothY){
// 			//console.log(x+'/'+y+' of '+clothX+'/'+clothY)
// 			if(y === 0 || x === 0 ||
// 				y == clothY || x == clothX){
// 				//edge
// 				return true;
// 			}
// 		}

//     for (let y = 0; y <= clothY; y++) {
//       for (let x = 0; x <= clothX; x++) {
				
//         let point = new Point(
//           startX + x * spacingX/* - (spacingX * Math.sin(y) )*/, 
//           y * spacingY + startY /*+ ( y !== 0 ? 5 * Math.cos(x) : 0 )*/
//         )
//         !free && /* y === 0 */ pinned(x,y,clothX,clothY) && point.pin(point.x, point.y)
//         x !== 0 && point.attach(this.points[this.points.length - 1])
//         y !== 0 && point.attach(this.points[x + (y - 1) * (clothX + 1)])
				
//         this.points.push(point)
      
// 			}
			
//     }
// 		//console.log(this.points);
    
//   }

//   update (delta) {
//     let i = accuracy

//     while (i--) {
//       this.points.forEach((point) => {
//         point.resolve()
//       })
//     }

//     ctx.beginPath();

//     this.points.forEach((point,i) => {
//       point.update(delta * delta)
        
//       if ( opts.renderCloth ) { point.draw(); }
      
//       if ( mesh ) {
//         i *= 2;
//         mesh.vertices[i] = point.x;
//         mesh.vertices[i+1] = point.y;
//       }
//     });
    
//     ctx.stroke()
//   }
// }

// function pointerMove(e) {
// 	var elRect = e.target.getBoundingClientRect();
// 	var offX = elRect.left,
// 			offY = elRect.top;
	
//   let pointer = e.touches ? e.touches[0] : e;
//   mouse.px = mouse.x || pointer.clientX;
//   mouse.py = mouse.y || pointer.clientY;
//   mouse.x = pointer.clientX - offX;
//   mouse.y = pointer.clientY - offY;
// }

// function pointerDown(e){
//   mouse.down = true
//   mouse.button = 1
//   pointerMove(e);
// }

// function pointerUp(e){
//   mouse.down = false;
//   mouse.px = null;
//   mouse.py = null;
//   console.log('pointer up');
// }

// PixiDiv.addEventListener('mousedown', pointerDown);
// PixiDiv.addEventListener('touchstart', pointerDown);

// PixiDiv.addEventListener('mousemove',pointerMove);
// PixiDiv.addEventListener('touchmove', pointerMove);

// PixiDiv.addEventListener('mouseup', pointerUp);
// PixiDiv.addEventListener('touchend', pointerUp);
// PixiDiv.addEventListener('mouseleave', pointerUp);


// window.addEventListener("resize", function(){
// 	console.error('resized canvas');
// });