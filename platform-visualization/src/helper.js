/**
 * Static object with help functions commonly used
 */
function Helper() {

    var SERVER = 'http://api.fermat.org';

    //var PORT = '';

    var PORT = '?env=testing';

    var USERDATA = '';

    var AXS_KEY = '';

    this.listDevs = {};

    var self = this;

    /**
     * Hides an element vanishing it and then eliminating it from the DOM
     * @param {DOMElement} element         The element to eliminate
     * @param {Number}     [duration=1000] Duration of the fade animation
     * @param {Boolean}    [keep=false]     If set true, don't remove the element, just dissapear
     */
    this.hide = function(element, duration, keep, callback) {

        var dur = duration || 1000,
            el = element;

        if(typeof(el) === "string")
            el = document.getElementById(element);

        if(el) {
            $(el).fadeTo(duration, 0, function() {
                if(keep) {
                    el.style.display = 'none';
                    el.style.opacity = 0;
                    el.style.transition = 'display 0s 2s, opacity 2s linear';
                }
                else
                    $(el).remove();

                if(typeof(callback) === 'function')
                    callback(); 
            });
        }

    };

    this.hideButtons = function(){

        if($('#developerButton') != null) 
          window.helper.hide($('#developerButton'), 1000);
        if($('#showFlows') != null) 
          window.helper.hide($('#showFlows'), 1000);
        if($('#showScreenshots') != null) 
          window.helper.hide($('#showScreenshots'), 1000);        
    };
    
    /**
     * @author Miguel Celedon
     *
     * Shows an HTML element as a fade in
     * @param {Object} element         DOMElement to show
     * @param {Number} [duration=1000] Duration of animation
     */
    this.show = function(element, duration) {
        
        duration = duration || 1000;

        if(typeof(element) === "string")
            element = document.getElementById(element);

        $(element).fadeTo(duration, 1, function() {
                $(element).show();
        });
    };
    
    /**
     * Shows a material with transparency on
     * @param {Object} material                                Material to change its opacity
     * @param {Number} [duration=2000]                         Duration of animation
     * @param {Object} [easing=TWEEN.Easing.Exponential.InOut] Easing of the animation
     * @param {delay}  [delay=0]
     */
    this.showMaterial = function(material, duration, easing, delay) {
        
        if(material && typeof material.opacity !== 'undefined') {
            
            duration = duration || 2000;
            easing = (typeof easing !== 'undefined') ? easing : TWEEN.Easing.Exponential.InOut;
            delay = (typeof delay !== 'undefined') ? delay : 0;

            new TWEEN.Tween(material)
                .to({opacity : 1}, duration)
                .easing(easing)
                .onUpdate(function() { this.needsUpdate = true; })
                .delay(delay)
                .start();
        }
    };
    
    /**
     * Deletes or hides the object
     * @param {Object}  object          The mesh to hide
     * @param {Boolean} [keep=true]     If false, delete the object from scene
     * @param {Number}  [duration=2000] Duration of animation
     */
    this.hideObject = function(object, keep, duration) {
        
        duration = duration || 2000;
        keep = (typeof keep === 'boolean') ? keep : true;
        
        new TWEEN.Tween(object.material)
            .to({opacity : 0}, duration)
            .onUpdate(function() { this.needsUpdate = true; })
            .onComplete(function() { 
              if(!keep) 
                window.scene.remove(object); 
            })
            .start();
    };

    /**
     * Clones a tile and *without* it's developer picture
     * @param   {String} id    The id of the source
     * @param   {String} newID The id of the created clone
     * @returns {DOMElement} The cloned tile without it's picture
     */
    this.cloneTile = function(id, newID) {

        var clone = document.getElementById(id).cloneNode(true);

        clone.id = newID;
        clone.style.transform = '';
        $(clone).find('.picture').remove();

        return clone;
    };

    /**
     * Parses ISODate to a javascript Date
     * @param   {String} date Input
     * @returns {Date}   js Date object (yyyy-mm-dd)
     */
    this.parseDate = function(date) {

        if(date == null)
          return null;

        var parts = date.split('-');

        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    };

    /**
     * Capitalizes the first letter of a word
     * @param   {String} string Input
     * @returns {String} input capitalized
     */
    this.capFirstLetter = function(string) {

        var words = string.split(" ");
        var result = "";

        for(var i = 0; i < words.length; i++){
            result += words[i].charAt(0).toUpperCase() + words[i].slice(1) + " ";
        }

        return result.trim();
    };

    /**
     * Extract the code of a plugin
     * @param   {String} pluginName The name of the plugin
     * @returns {String} Code of the plugin
     */
    this.getCode = function(pluginName) {

        var words = pluginName.split(" ");
        var code = "";

        if(words.length == 1) { //if N = 1, use whole word or 3 first letters

            if(words[0].length <= 4)
                code = this.capFirstLetter(words[0]);
            else
                code = this.capFirstLetter(words[0].slice(0, 3));
        } 
        else if(words.length == 2) { //if N = 2 use first cap letter, and second letter

            code += words[0].charAt(0).toUpperCase() + words[0].charAt(1);
            code += words[1].charAt(0).toUpperCase() + words[1].charAt(1);
        } 
        else { //if N => 3 use the N (up to 4) letters caps

            var max = (words.length < 4) ? words.length : 4;

            for(var i = 0; i < max; i++){
                code += words[i].charAt(0).toUpperCase();
            }
        }

        return code;
    };

    /**
     * parse dir route from an element data
     * @method getRepoDir
     * @param  {Element}   item table element
     * @return {String}   directory route
     */
    this.getRepoDir = function(item) {
        //console.dir(item);
        var _root = "fermat",
            _group = item.group ? item.group.toUpperCase().split(' ').join('_') : null,
            _type = item.type ? item.type.toLowerCase().split(' ').join('_') : null,
            _layer = item.layer ? item.layer.toLowerCase().split(' ').join('_') : null,
            _name = item.name ? item.name.toLowerCase().split(' ').join('-') : null;

        if(_group && _type && _layer && _name) {
            return _group + "/" + _type + "/" + _layer + "/" +
                _root + "-" + _group.split('_').join('-').toLowerCase() + "-" + _type.split('_').join('-') + "-" + _layer.split('_').join('-') + "-" + _name + "-bitdubai";
        } 
        else
            return null;
    };
    
    /**
     * Returns the route of the API server
     * @author Miguel Celedon
     * @param   {string} route The name of the route to get
     * @returns {string} The URL related to the requested route
     */
    this.getAPIUrl = function(route) {
        
        var tail = "";
        
        switch(route) {
                
            case "comps":
                tail = "/v1/repo/comps";
                break;
            case "procs":
                tail = "/v1/repo/procs";
                break;
            case "servers":
                tail = "/v1/net/servrs";
                break;
            case "nodes":
                tail = "/v1/net/nodes";
                break;
            case "login":
                tail = "/v1/auth/login";
                break;
            case "logout":
                tail = "/v1/auth/logout";
                break;
            case "user":
                tail = "/v1/repo/devs";
                break;
        }
        
        return SERVER + tail + PORT;
    };

    this.postRoutesComponents = function(route, params, data, doneCallback, failCallback){

        var tail = "",
            method = "",
            setup = {};

        switch(route) {
                
            case "insert":
                method = "POST";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/comps";
                break;
            case "delete":
                method = "DELETE";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/comps/" + data.comp_id;
                break;
            case "update":
                method = "PUT";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/comps/" + data.comp_id;
                break;
            case "insert dev":
                method = "POST";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/comps/" + data.comp_id + "/comp-devs";
                break;
            case "delete dev":
                method = "DELETE";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/comps/" + data.comp_id + "/comp-devs/" + data.devs_id;
                break;
            case "update dev":
                method = "PUT";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/comps/" + data.comp_id + "/comp-devs/" + data.devs_id;
                break;                    
                
        }

        setup.method = method;
        setup.url = SERVER + tail + PORT + AXS_KEY;
        setup.headers = { 
            "Content-Type": "application/json"
             };

        if(params)
            setup.data = params;

        makeCorsRequest(setup.url, setup.method, setup.data, 
            function(res){
        
                if(typeof(doneCallback) === 'function')
                    doneCallback(res);
            }, 
            function(res){

                window.alert('Action Not Executed');

                if(typeof(failCallback) === 'function')
                    failCallback(res);
            }
        );

    };

    this.postRoutesProcess = function(route, params, data, doneCallback, failCallback){

        var tail = "",
            method = "",
            setup = {};

        switch(route) {
                
            case "insert":
                method = "POST";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/procs";
                break;
            case "delete":
                method = "DELETE";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/procs/" + data.proc_id;
                break;
            case "update":
                method = "PUT";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/procs/" + data.proc_id;
                break;
            case "insert step":
                method = "POST";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/procs/" + data.proc_id + "/steps";
                break;
            case "delete step":
                method = "DELETE";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/procs/" + data.proc_id + "/steps/" + data.steps_id;
                break;
            case "update step":
                method = "PUT";
                tail = "/v1/repo/usrs/" + USERDATA._id + "/procs/" + data.proc_id + "/steps/" + data.steps_id;
                break;                    
                
        }

        setup.method = method;
        setup.url = SERVER + tail + PORT + AXS_KEY;
        setup.headers = { 
            "Content-Type": "application/json"
             };

        if(params)
            setup.data = params;

        makeCorsRequest(setup.url, setup.method, setup.data, 
            function(res){
        
                if(typeof(doneCallback) === 'function')
                    doneCallback(res);
            }, 
            function(res){

                window.alert('Action Not Executed');

                if(typeof(failCallback) === 'function')
                    failCallback(res);
            }
        );

    };

    var makeCorsRequest = function(url, method, params, success, error) {

        var xhr = createCORSRequest(url, method);

        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

          if(!xhr) {
            window.alert('CORS not supported');
            return;
          }

        xhr.onload = function() {

            var res = null;

            if(method !== 'DELETE')
                res = JSON.parse(xhr.responseText);

            success(res);
            
        };

        xhr.onerror = function() {

            error(arguments);

        };

        if(typeof params !== 'undefined'){

            var data = JSON.stringify(params);

            xhr.send(data);
        }
        else
            xhr.send();

        function createCORSRequest(url, method) {

            var xhr = new XMLHttpRequest();

            if("withCredentials" in xhr) 
                xhr.open(method, url, true);
            else 
                xhr = null;
        
            return xhr;
        }
    };

    this.getCompsUser = function(callback){

        var url = "";

        var list = {};

        //window.session.useTestData();

        if(window.session.getIsLogin()){ 

            USERDATA = window.session.getUserLogin();

            AXS_KEY = '?axs_key=' + USERDATA.axs_key;

            url = SERVER + "/v1/repo/usrs/"+USERDATA._id+"/";

            callAjax('comps', function(){

                callAjax('layers', function(){

                    callAjax('platfrms', function(){
                    
                        callAjax('suprlays', function(){

                            callAjaxDevs(function(){ 

                                callback(list);

                            });
                
                        });
                    });
                });
            });
        }
        else{

            url = self.getAPIUrl("comps");

            PORT = '';

            callAjax('', function(){

                callAjaxDevs(function(){ 

                    callback(list);

                }); 
                
            });
        }

        function callAjax(route, callback){

            $.ajax({
                url: url + route + PORT,
                method: "GET"
            }).success (
                function (res) {

                    if(route === '')
                        list = res;
                    else
                       list[route] = res; 

                    if(typeof(callback) === 'function')
                        callback();

                });
        }

        function callAjaxDevs(callback){

            url = self.getAPIUrl("user");

            $.ajax({
                url: url + PORT,
                method: "GET"
            }).success (
                function (res) {

                    self.listDevs = res;

                    if(typeof(callback) === 'function')
                        callback();

                });
        }

    };   
    /**
     * Loads a texture and applies it to the given mesh
     * @param {String}   source     Address of the image to load
     * @param {Mesh}     object     Mesh to apply the texture
     * @param {Function} [callback] Function to call when texture gets loaded, with mesh as parameter
     */
    this.applyTexture = function(source, object, callback) {
        
        if(source != null && object != null) {
        
            var loader = new THREE.TextureLoader();

            loader.load(
                source,
                function(tex) {
                    tex.minFilter = THREE.NearestFilter;
                    tex.needsUpdate = true;
                    object.material.map = tex;
                    object.needsUpdate = true;

                    //console.log(tex.image.currentSrc);

                    if(callback != null && typeof(callback) === 'function')
                        callback(object);
                }
            );
        }
    };
    
    /**
     * Draws a text supporting word wrap
     * @param   {String} text       Text to draw
     * @param   {Number} x          X position
     * @param   {Number} y          Y position
     * @param   {Object} context    Canvas context
     * @param   {Number} maxWidth   Max width of text
     * @param   {Number} lineHeight Actual line height
     * @returns {Number} The Y coordinate of the next line
     */
    this.drawText = function(text, x, y, context, maxWidth, lineHeight) {
    
        if(text) {
            var words = text.split(' ');
            var line = '';

            for(var n = 0; n < words.length; n++) {
              var testLine = line + words[n] + ' ';
              var metrics = context.measureText(testLine);
              var testWidth = metrics.width;
              if(testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
              }
              else
                line = testLine;
            }
            context.fillText(line, x, y);

            return y + lineHeight;
        }
        
        return 0;
    };
    
    /**
     * Searchs an element given its full name
     * @param   {String} elementFullName Name of element in format [group]/[layer]/[name]
     * @returns {Number} The ID of the element in the table
     */
    this.searchElement = function(elementFullName) {
        
        if(typeof elementFullName !== 'string' || elementFullName === 'undefined/undefined/undefined')
            return -1;
        
        var group,
            components = elementFullName.split('/');
        
        if(components.length === 3) {
        
            for(var i = 0; i < window.tilesQtty.length; i++){

                var tile = window.helper.getSpecificTile(window.tilesQtty[i]).data;
        
                group = tile.platform || window.layers[tile.layer].super_layer;

                if(group && group.toLowerCase() === components[0].toLowerCase() &&
                   tile.layer.toLowerCase() === components[1].toLowerCase() &&
                   tile.name.toLowerCase() === components[2].toLowerCase())
                    return window.tilesQtty[i];           
            }  
        }

        return -1;
    };
    
    /**
     * Gets a point randomly chosen out of the screen
     * @author Miguel Celedon
     * @param   {number}        [z=0]         The desired Z
     * @param   {string}        [view='home'] The view of the relative center
     * @returns {THREE.Vector3} A new vector with the point position
     */
    this.getOutOfScreenPoint = function(z, view) {
        
        z = (typeof z !== "undefined") ? z : 0;
        view = (typeof view !== "undefined") ? view : 'home';
        
        var away = window.camera.getMaxDistance() * 4;
        var point = new THREE.Vector3(0, 0, z);
        
        point.x = Math.random() * away + away * ((Math.floor(Math.random() * 10) % 2) * -1);
        point.y = Math.random() * away + away * ((Math.floor(Math.random() * 10) % 2) * -1);
        
        point = window.viewManager.translateToSection(view, point);
        
        return point;
    };
    
    /**
     * Checks whether the given vector's components are numbers
     * @author Miguel Celedon
     * @param   {object}  vector The instance to check
     * @returns {boolean} True if the vector is valid, false otherwise
     */
    this.isValidVector = function(vector) {
        
        var valid = true;
        
        if(!vector)
            valid = false;
        else if(isNaN(vector.x) || isNaN(vector.y) || isNaN(vector.z))
            valid = false;
        
        return valid;
    };
    
    this.showBackButton = function() {
        window.helper.show('backButton');
    };
    
    this.hideBackButton = function() {
        window.helper.hide('backButton', 1000, true);
    };
    
    /**
     * Creates an empty tween which calls render() every update
     * @author Miguel Celedon
     * @param {number} [duration=2000] Duration of the tween
     */
    this.forceTweenRender = function(duration) {
        
        duration = (typeof duration !== "undefined") ? duration : 2000;
        
        new TWEEN.Tween(window)
        .to({}, duration)
        .onUpdate(window.render)
        .start();
    };

    this.getCenterView = function(view){

        var newCenter = new THREE.Vector3(0, 0, 0);

        newCenter = window.viewManager.translateToSection(view, newCenter);

        return newCenter;

    };

    this.fillTarget = function(x, y, z, view){

        var object3D = new THREE.Object3D();

        var target = {
                show : {},
                hide : {}
            };

        object3D.position.x = Math.random() * 80000 - 40000;
        object3D.position.y = Math.random() * 80000 - 40000;
        object3D.position.z = 80000 * 2;

        object3D.position.copy(window.viewManager.translateToSection(view, object3D.position));

        target.hide.position = new THREE.Vector3(object3D.position.x, object3D.position.y, object3D.position.z);
        target.hide.rotation = new THREE.Vector3(Math.random() * 180, Math.random() * 180, Math.random() * 180);

        target.show.position = new THREE.Vector3(x, y, z);
        target.show.rotation = new THREE.Vector3(0, 0, 0);

        return target;
    };

    this.getSpecificTile = function(_id){

        var id = _id.split("_");

        return window.TABLE[id[0]].layers[id[1]].objects[id[2]];

    };

    this.getLastValueArray = function(array){

        var value = array[array.length - 1];

        return value;
    };

    this.getCountObject = function(object){

        var count = 0;

        for(var i in object){
            count++;
        } 

        return count;
    };

    this.getPositionYLayer = function(layer){

        var index = window.layers[layer].index;

        return window.tileManager.dimensions.layerPositions[index];
    };
}
