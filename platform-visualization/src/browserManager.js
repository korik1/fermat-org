/**
 * @author Ricardo Delgado
 * @last modified By Miguel Celedon
 * function create a Buttons Browser and charge your textures
 */
function BrowserManager() {

       this.objects = {
            mesh : []
        };

    var self = this;
    
    var wide = (Math.floor(window.camera.aspectRatio * 10) !== Math.floor(40/3));
    
    var LOWER_LAYER = 63000,
        POSITION_X = (wide) ? 15000 : 12000,
        POSITION_Y = (wide) ? 7500 : 8000,
        SCALE = (wide) ? 70 : 40;

    var onClick = function(target) {

       actionButton(target.userData.view);

    };

     /**
     * @author Ricardo Delgado
     * Pressed button function.
     * @param {String} view  vista a cargar
     */
    function actionButton(view) {

       window.goToView(view);

    }

   /**
     * @author Ricardo Delgado
     * Button changes the value legend.
     * @param {Number}  valor    value of opacity.
     * @param {String} display   button status.
     */
   this.modifyButtonLegend = function(valor, display) {
    
      var browserButton = document.getElementById('legendButton');
      
      $(browserButton).fadeTo(1000, valor, function() {

            $(browserButton).show();

            browserButton.style.display = display;

      });
  
   };

   /**
    * @author Ricardo Delgado
    * Initialization of the arrows
    */
   this.init = function() {
       
        for(var view in window.map.views) {
            loadView(view);
        }

   };
    
   /**
    * @author Ricardo Delgado
    * Loading the necessary views and arrows according to varible map. 
    * @param {String} view  view to load
    */
    function loadView(view) {
        
        var directions = ['up', 'down', 'right', 'left'];

        var newCenter = new THREE.Vector3(0, 0, 0);
        newCenter = window.viewManager.translateToSection(view, newCenter);
        
        if(window.map.views[view].enabled !== true)
            showSign(newCenter);
        
        var dir = '';

        for(var i = 0; i < directions.length; i++) {
            
            //Get up, down, left and right views
            dir = window.map.views[view][directions[i]];
            
            if(dir !== '')
                addArrow(dir, newCenter.x, newCenter.y, directions[i]);
        }

    }
    
    /**
     * Shows a sign in the given position
     * @author Miguel Celedon
     * @param {THREE.Vector3} center Center of the sign
     */
     
    function showSign(center) {
        
        var newCenter = center.clone();
        newCenter.z = LOWER_LAYER;
        
        var texture = THREE.ImageUtils.loadTexture('images/sign.png');
        texture.minFilter = THREE.NearestFilter;
        
        //Create placeholder for now
        var sign = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(8000, 6000),
            new THREE.MeshBasicMaterial({color : 0xFFFFFF, map : texture})
        );
        
        sign.position.copy(newCenter);
        
        window.scene.add(sign);
    }

   /**
     * @author Ricardo Delgado
     * creating arrows.
     * @param {String}   view    view load.
     * @param {Number}  center   camera Center.
     * @param {String}  button   position arrow.
     */
   function addArrow(view, centerX, centerY, button) {

        var mesh,
            _position,
            id = self.objects.mesh.length;

        mesh = new THREE.Mesh(
               new THREE.PlaneBufferGeometry(60, 60),
               new THREE.MeshBasicMaterial({ map:null , side: THREE.FrontSide, transparent: true }));
    
       _position = calculatePositionArrow(centerX, centerY, button);

       mesh.position.set(_position.x, _position.y, _position.z);

       mesh.scale.set(SCALE, SCALE, SCALE);

       mesh.userData = { 
        id : id ,
        arrow : button, 
        view : view,
        onClick : onClick };

       mesh.material.opacity = 1;
    
       window.scene.add(mesh);
    
       self.objects.mesh.push(mesh);

       addTextura(view, button, mesh);

   }

   /**
     * @author Ricardo Delgado
     * Calculate Position Arrow .
     * @param {Number}  center   camera Center.
     * @param {String}  button   position arrow.
     */
   function calculatePositionArrow(centerX, centerY, button) {

      var position = {},
          x = centerX,
          y = centerY,
          z = 80000 * -2; 

     if(button === "right")
         x = centerX + POSITION_X; 
     else if(button === "left")
         x = centerX + (POSITION_X * -1);
     else if(button === "up")
         y = centerY + POSITION_Y;
     else 
         y = centerY + (POSITION_Y * -1);

     position = { x: x, y: y, z: z };

     return position;

   }

   /**
     * @author Ricardo Delgado
     * Creates textures arrows and stored in the variable texture.
     * @param {String}   view    view.
     * @param {String}  button   image to use.
     * @param {object}   mesh    button to load texture.
     */
   function addTextura(view, button, mesh) {
       
        var canvas,
            ctx,
            img = new Image(),
            texture,
            config = configTexture(view, button);

        canvas = document.createElement('canvas');
        canvas.width  = 400;
        canvas.height = 370;

        ctx = canvas.getContext("2d");
        ctx.globalAlpha = 0.90;

        img.src = "images/browsers_arrows/arrow-"+button+".png";

        img.onload = function() {

            ctx.textAlign = 'center';

            ctx.font = config.text.font;
            window.helper.drawText(config.text.label, 200, config.image.text, ctx, canvas.width, config.text.size);
            ctx.drawImage(img, config.image.x, config.image.y, 200, 200);

            texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;  
            texture.minFilter = THREE.NearestFilter;

            mesh.material.map = texture;
            mesh.material.needsUpdate = true;

            animate(mesh, LOWER_LAYER, 3000);

        };

   }

   /**
     * @author Ricardo Delgado
     * Configures all texture options.
     * @param {String}   view    view.
     * @param {String}  button   image to use.
     */
   function configTexture(view, button) {
     
    var config = {},
        text = {},
        image = {},
        label;

    if(button !== "down")  
        image = { x: 100, y : 0, text : 238 };
    else 
        image = { x: 100, y : 120, text : 108 };
 

    label = window.map.views[view].title;


    text = { label : label, font: "48px Canaro, Sans-serif", size : 48 };

    config = { image : image, text : text };

    return config;

   }

   /**
     * @author Ricardo Delgado.
     * Animate Button.
     * @param {Object}     mesh        Button.
     * @param {Number}     target      The objetive Z position.
     * @param {Number} [duration=2000] Duration of the animation.
     */
   function animate(mesh, target, duration) {

        var _duration = duration || 2000,
            z = target;

        new TWEEN.Tween(mesh.position)
            .to({z : z}, _duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onUpdate(window.render)
            .start();

   }

}