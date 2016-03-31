var ROTATE_SPEED = 1.3,
        MIN_DISTANCE = 50,
        MAX_DISTANCE = 90000;

/**
 *
 * @class Camera
 *
 * @param  {Position}
 * @param  {Renderer}
 * @param  {Function}
 */
function Camera(position, renderer, renderFunc) {
    /**
     * private constans
     */

    /**
     * private properties
     */    
    var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, MAX_DISTANCE);
    var controls = new THREE.TrackballControls(camera, renderer.domElement);
    var focus = null;
    var self = this;
    var rendering = false;
    
    var fake = new THREE.Object3D();
    fake.position.set(MAX_DISTANCE, MAX_DISTANCE, -MAX_DISTANCE);
    
    camera.position.copy(position);

    controls.rotateSpeed = ROTATE_SPEED;
    controls.noRotate = true;
    controls.noPan = true;
    controls.minDistance = MIN_DISTANCE;
    controls.maxDistance = MAX_DISTANCE;
    controls.addEventListener('change', renderFunc);
    controls.position0.copy(position);
    
    // Public properties
    this.dragging = false;
    this.aspectRatio = camera.aspect;
    this.moving = false;
    this.freeView = false;
    
    this.controls = controls;
    
    // Public Methods
    
    this.enableFreeMode = function() {
        controls.noRotate = false;
        controls.noPan = false;
        camera.far = MAX_DISTANCE * 2;
        controls.maxDistance = Infinity;
        self.onWindowResize();
        self.freeView = true;
    };
    
    this.disableFreeMode = function() {
        controls.noRotate = true;
        controls.noPan = true;
        camera.far = MAX_DISTANCE;
        controls.maxDistance = MAX_DISTANCE;
        self.onWindowResize();
        //self.freeView = false;
    };
    
    /**
     * Returns the max distance set
     * @returns {Number} Max distance constant
     */
    this.getMaxDistance = function() { 
        return MAX_DISTANCE; 
    };

    /**
     * @method disable disables camera controls
     */
    this.disable = function() {
        controls.enabled = false;
    };
    
    /**
     *
     * @method enable enables camera controls
     */
    this.enable = function() {
        controls.enabled = true;
    };
    
    /**
     * Returns a copy of the actual position
     * @returns {THREE.Vector3} Actual position of the camera
     */
    this.getPosition = function() {
        return camera.position.clone();
    };
    
    this.setTarget = function(target, duration) {
        
        duration = (duration !== undefined) ? duration : 2000;
        
        new TWEEN.Tween(controls.target)
        .to({x : target.x, y : target.y, z : target.z}, duration)
        .onUpdate(window.render)
        .start();
    };
    
    /**
     * 
     * @method setFocus sets focus to a target given its id
     *
     * @param {Number} id       target id
     * @param {Number} duration animation duration time
     * @param {Object} target  target of the focus
     * @param {Vector} offset  offset of the focus
     */

    /**
     * Sets the focus to one object
     * 
     * @author Miguel Celedon
     * @param {THREE.Object3D} target          The target to see
     * @param {THREE.Vector3}  offset          The distance and position to set the camera
     * @param {number}         [duration=3000] The duration of the animation
     */
    this.setFocus = function(target, offset, duration){

        duration = duration || 3000;
        focus = target;

        self.render(renderer, scene); 
        offset.applyMatrix4(target.matrix);

        new TWEEN.Tween(camera.position)
            .to({ x: offset.x, y: offset.y, z: offset.z }, duration)
            .onComplete(render)
            .start();
        
        self.setTarget(target.position, duration / 2);

        new TWEEN.Tween(camera.up)
            .to({ x: target.up.x, y: target.up.y, z: target.up.z }, duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    };

    /**
     *
     * @method loseFocus    loses focus from target
     *
     */
     
    this.loseFocus = function() {
        
        if(focus != null) {
            var backButton = document.getElementById('backButton');
            $(backButton).fadeTo(0, 0, function() { backButton.style.display = 'none'; });
            $('#sidePanel').fadeTo(1000, 0, function() { $('#sidePanel').remove(); });
            $('#elementPanel').fadeTo(1000, 0, function() { $('#elementPanel').remove(); });
            $('#timelineButton').fadeTo(1000, 0, function() { $('#timelineButton').remove(); });
            if($('#tlContainer') != null)
                helper.hide($('#tlContainer'), 1000);
            $(renderer.domElement).fadeTo(1000, 1);

            focus = null;
            
            window.buttonsManager.removeAllButtons();
        }
    };
    
    /**
     *
     * @method onWindowResize   execute in case of window resizing
     * 
     */
    this.onWindowResize = function() {
        var innerWidth = window.innerWidth,
            innerHeight = window.innerHeight;
        
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        self.aspectRatio = camera.aspect;

        renderer.setSize(innerWidth, innerHeight);

        render();
    };
    
    /**
     *
     * @method onKeyDown    execute in case of key down pressed
     *
     * @param {Event} event event to listen to
     * 
     */
    this.onKeyDown = function(event) {
        
        if(event.keyCode === 27 /* ESC */) {
            //TWEEN.removeAll();
            var duration = 2000;

            if(viewManager.views && viewManager.views[window.actualView])
                viewManager.views[window.actualView].reset();

            self.resetPosition(duration);
        }
    };
    
    /**
     * Resets the camera position
     * @param {Number} [duration=2000] Duration of the animation
     */
    this.resetPosition = function(duration) {
        
        duration = duration || 2000;
        self.disable();
        
        var target = window.viewManager.translateToSection(window.actualView, controls.position0);
        
        if(self.freeView) {
            
            var targetView = window.viewManager.translateToSection(window.actualView, new THREE.Vector3(0, 0, 0));
            
            new TWEEN.Tween(controls.target)
                    .to({ x: targetView.x, y: targetView.y, z: targetView.z }, duration)
                    //.easing( TWEEN.Easing.Cubic.InOut )
                    .start();
        }

            new TWEEN.Tween(camera.position)
                .to({ x: target.x, y: target.y, z: target.z }, duration)
                //.easing( TWEEN.Easing.Exponential.InOut )
                .onUpdate(function(){ 
                    if(!self.freeView)
                     controls.target.set(camera.position.x, camera.position.y, 1); 
                })
                .onComplete(function() {
                    self.enable();
                    self.disableFreeMode();
                })
                .start();

            new TWEEN.Tween(camera.up)
                .to({ x: 0, y: 1, z: 0 }, duration)
                //.easing( TWEEN.Easing.Exponential.InOut )
                .start();
    };
    
    /**
     *
     * @method update    updates camera controls  
     *
     */
    this.update = function() {
        
        if(controls.noPan === true && Math.ceil(camera.position.z) !== controls.position0.z) {
            
            controls.noPan = false;
        
            if(self.freeView === true)
                self.enableFreeMode();
            
            if(window.viewManager && window.actualView)
                window.viewManager.views[window.actualView].zoom();
        }
        else if(controls.noPan === false && Math.ceil(camera.position.z) === controls.position0.z && self.freeView === false)
            this.onKeyDown({keyCode : 27}); //Force reset if far enough
        
        controls.update();
        self.dragging = controls.dragging;
    };
    
    /**
     *
     * @method render    renders an scene
     *
     * @param {Renderer} renderer renderer for camera
     * @param {Scene}    scene    scene to render
     *
     */
    this.render = function(renderer, scene) {
        
        var cam;
        
        if(rendering === false) {
            
            rendering = true;

            scene.traverse(function (object) {

                if(object instanceof THREE.LOD) {

                    if(object.userData.flying === true)
                        cam = fake;
                    else
                        cam = camera;

                    object.update(cam);
                }
            });

            renderer.render(scene, camera);
            
            rendering = false;
        }
        else
            console.log("Render ignored");
    };
    
    /**
     *
     * @method getFocus gets focused target
     *
     * @return {Number} focused target
     */
    this.getFocus = function() { 
        return focus;
    };
    
    /**
     * Casts a ray between the camera to the target
     * @param   {Object} target   Vector2D target
     * @param   {Array}  elements Array of elements expected to collide
     * @returns {Array}  All intercepted members of elements
     */
    this.rayCast = function(target, elements) {
        
        var raycaster = new THREE.Raycaster();
        
        raycaster.setFromCamera(target, camera);
        
        /* Debug code, draw lines representing the clicks 
 
        var mat = new THREE.LineBasicMaterial({color : 0xaaaaaa});
        var g = new THREE.Geometry();
        var r = raycaster.ray;
        var dest = new THREE.Vector3(r.origin.x + r.direction.x * MAX_DISTANCE, r.origin.y + r.direction.y * MAX_DISTANCE, r.origin.z + r.direction.z * MAX_DISTANCE);

        g.vertices.push( r.origin, dest);

        var line = new THREE.Line(g, mat);

        scene.add(line);*/
        
        return raycaster.intersectObjects(elements);
    };
    
    /**
     * Moves the camera to a position
     * @author Miguel Celedon
     * @param {Number}  x               X coordinate
     * @param {Number}  y               Y coordinate
     * @param {Number}  z               Z coordinate
     * @param {Number}  [duration=2000] Milliseconds of the animation
     * @param {boolean} [synced]        If true, moves like it were not in free view
     */
    this.move = function(x, y, z, duration, synced) {
        
        var _duration = duration || 2000;
        synced = synced || false;
        
        var tween = null;
        
        if(window.helper.isValidVector({x : x, y : y, z : z})) {
            
            tween = new TWEEN.Tween(camera.position)
                    .to({x : x, y : y, z : z}, _duration)
                    .easing(TWEEN.Easing.Cubic.InOut)
                    .onUpdate(function(){
                        if(!self.freeView || synced)
                            controls.target.set(camera.position.x, camera.position.y, 0);

                        window.render();
                    });
            
            var next = new TWEEN.Tween(camera.up)
                        .to({x : 0, y : 1, z : 0}, _duration)
                        .easing(TWEEN.Easing.Cubic.InOut);
            
            tween.onStart(function() { next.start(); });
            tween.start();
            
        }
        else
            window.alert("Error: this is not a valid vector (" + x + ", " + y + ", " + z + ")"); 
    };
    
    /**
     * Locks the panning of the camera
     */
    this.lockPan = function() {
        controls.noPan = true;
    };
    
    /**
     * Unlocks the panning of the camera
     */
    this.unlockPan = function() {
        controls.noPan = false;
    };
    
    // Events
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('keydown', this.onKeyDown, false);
}