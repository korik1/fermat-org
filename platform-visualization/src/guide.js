/**
 * @author Isaias Taborda
 * function creates a guide to help inexperienced users navigate the site
 */
function Guide() {

	  this.objects = {
            mesh : []
    };

    var active = false;

    var self = this;
    
    var wide = (Math.floor(window.camera.aspectRatio * 10) !== Math.floor(40/3));
    
    var Z = 40000,
        SCALE = (wide) ? 28 : 16;

    /**
     * @author Isaías Taborda
     * Create help text.
     * @param {String array}  text    Information text.
     * @param {Number}        width   Text box width.
     * @param {Number}        height  Text box height.
     * @param {Number}        posX    Objetive x position.
     * @param {Number}        posY    Objetive y position.
     */
    function createHelp(text, width, height, posX, posY) {

        var material = new THREE.MeshBasicMaterial( {map: null, side:THREE.FrontSide, transparent: true } ); 

        var mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            material
        );

        mesh.position.set(0,0,-10000);
        mesh.scale.set(SCALE, SCALE, SCALE);
        mesh.material.opacity = 1;

        window.scene.add(mesh);
        self.objects.mesh.push(mesh);

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        context.globalAlpha = 0.90;
        context.fillStyle = "#10C6A9";
        roundRectangle(context, 0, 0, canvas.width, canvas.height);
        context.font = "Bold 40px Arial";
        context.fillStyle = "white";

        var size = text.length+1;
        var spacing = 0;
        for(var i=1; i < size; i++){
           var line = text.shift();
           context.fillText(line, 7, (35 * i) + spacing);
           spacing += 7;
        }

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        texture.minFilter = THREE.NearestFilter;

        mesh.material.map = texture;
        mesh.material.needsUpdate = true;

        popUp(mesh, posX, posY,3500);

    };

    /**
     * @author Isaías Taborda
     * Creates a round corner rectangle for the text.
     * @param {Object}  ctx    Context.
     * @param {Number}  x      X-axis position.
     * @param {Number}  y      Y-axis position.
     * @param {Number}  width  Width size.
     * @param {Number}  heigth Height size.
     */
    function roundRectangle(ctx, x, y, width, height) {
      
      var radius = 10;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();       
    }

   /**
     * @author Isaías Taborda.
     * Animate Button.
     * @param {Object}     mesh         Text field.
     * @param {Number}     targetx      The objetive x position.
     * @param {Number}     targety      The objetive y position.
     * @param {Number} [duration=2000] Duration of the animation.
     */
    function popUp(mesh, targetX, targetY, duration) {

          var _duration = duration || 2000,
              x = targetX,
              y = targetY,
              z = Z;

          new TWEEN.Tween(mesh.position)
              .to({
                x : x,
                y : y,
                z : z 
              }, Math.random() * duration + duration)
              .easing(TWEEN.Easing.Exponential.InOut)
              .onUpdate(window.render)
              .start();

    }

    this.showHelp = function(){
        createHelp(["Use the blue arrows to", "navigate through the site."], 500, 95, -13000, 12000);
        createHelp(["You can zoom in, or zoom out, using the scroll", "wheel or by dragging your Mouse while holding", "down the S key and left click."], 910, 135, 7500, 12000);
        createHelp(["After you zoom in, hold down left", "click and drag your Mouse to pan", "across the page view."], 650, 135, -15000, 5000);
        createHelp(["Press the Esc key in any view to", "return to its starting position."], 625, 95, 15000, 5000);
    };

    /**
     * @author Isaías Taborda.
     * Eliminates the help text.
     */
    this.removeHelp = function(){
      var duration = 1000;
      var l = self.objects.mesh.length; 

        for(i = 0; i < l; i++) {
          new TWEEN.Tween(self.objects.mesh[i].position)
            .to({
                x : 0,
                y : 0,
                z : -10000
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Bounce.In)
            .start();
        }

        setTimeout(function (){
          for(var i = 0; i < l; i++) {
              window.scene.remove(self.objects.mesh[i]); // this was separated so the canvas text animates before being deleted
          }
          self.objects.mesh = [];
        }, 3000);
  };
}