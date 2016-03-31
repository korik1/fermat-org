/**
 * Controls how tiles behaves
 */
function TileManager() {
   
    this.dimensions = {};
    this.elementsByGroup = [];
    
    var jsonTile = {};
    var self = this;
    var groupsQtty;
    var _firstLayer;
    var layersQtty;
    var section = [];
    var columnWidth = 0;
    var layerPosition = [];
    var superLayerMaxHeight = 0;
    var superLayerPosition = [];
    
    var onClick = function(target) {
        if(window.actualView === 'table')
            window.onElementClick(target.userData.id);
    };
    
    this.JsonTile = function(callback){

        $.get("json/config_tile.json", {}, function(json) {
            jsonTile = json;
            callback();
        });
    };

    /**
     * Pre-computes the space layout for next draw
     */
    this.preComputeLayout = function () {
        
        var SUPER_LAYER_SEPARATION = 3;

        var section_size = [],
            superLayerHeight = 0,
            isSuperLayer = [],
            i, actualSuperLayerName = '';

        //Initialize
        for (var key in layers) {
            if (key == "size") continue;
            
            var id = layers[key].index;
            
            if(layers[key].super_layer !== actualSuperLayerName) {
                superLayerHeight = 0;
                actualSuperLayerName = layers[key].super_layer;
            }

            if (layers[key].super_layer) {

                section[id] = 0;
                section_size[id] = 0;
                superLayerHeight++;

                if (superLayerMaxHeight < superLayerHeight) superLayerMaxHeight = superLayerHeight;
            }
            else {

                var newLayer = [];

                for (i = 0; i < groupsQtty; i++)
                    newLayer.push(0);

                section_size[id] = newLayer;
                section[id] = newLayer.slice(0); //Use a copy
            }

            isSuperLayer.push(false);
        }

        for (var j = 0; j <= groupsQtty; j++) {

            self.elementsByGroup.push([]);
        }

        //Set sections sizes

        for(var platfrm in window.TABLE){

            for (var layer in window.TABLE[platfrm].layers){

                for(i = 0; i < window.TABLE[platfrm].layers[layer].objects.length; i++){
                
                    var tile = window.TABLE[platfrm].layers[layer].objects[i];
            
                    var r = tile.data.layerID; 

                    var c = tile.data.platformID;
                    var idT = tile.id;


                    self.elementsByGroup[c].push(idT);

                    if (layers[tile.data.layer].super_layer) {

                        section_size[r]++;
                        isSuperLayer[r] = layers[tile.data.layer].super_layer;
                    } else {
                        
                        section_size[r][c]++;
                        if (section_size[r][c] > columnWidth) columnWidth = section_size[r][c];
                    }
                    
                }
            }
        }  

        //Set row height

        var actualHeight = 0;
        var remainingSpace = superLayerMaxHeight;
        var inSuperLayer = false;
        var actualSuperLayer = -1;
        
        actualSuperLayerName = false;

        for (i = 0; i < layersQtty; i++) {
            
            if(isSuperLayer[i] !== actualSuperLayerName) {
                
                actualHeight += remainingSpace + 1;
                remainingSpace = superLayerMaxHeight;
                
                if(isSuperLayer[i]) {
                    actualSuperLayer++;
                    inSuperLayer = false;
                }
                
                actualSuperLayerName = isSuperLayer[i];
            }
            
            if (isSuperLayer[i]) {

                if (!inSuperLayer) {
                    actualHeight += SUPER_LAYER_SEPARATION;

                    if (superLayerPosition[actualSuperLayer] === undefined) {
                        superLayerPosition[actualSuperLayer] = actualHeight;
                    }
                }

                inSuperLayer = true;
                actualHeight++;
                remainingSpace--;
            } else {

                if (inSuperLayer) {

                    actualHeight += remainingSpace + 1;
                    remainingSpace = superLayerMaxHeight;
                }

                inSuperLayer = false;
                actualHeight++;
            }
            
            if(actualHeight == 6)   //Separates GUI section
                actualHeight += 2;

            layerPosition[i] = actualHeight;
        }
    };

    this.fillTable = function (list) {
        var _suprlays = list.suprlays,
            _platfrms = list.platfrms,
            _layers = list.layers,
            _comps = list.comps,
            i, l, code, name;

        for (i = 0, l = _suprlays.length; i < l; i++) {
            code = _suprlays[i].code;
            window.superLayers[code] = {};
            window.superLayers[code].name = _suprlays[i].name;
            window.superLayers[code].index = _suprlays[i].order;
            window.superLayers[code]._id = _suprlays[i]._id;
            window.superLayers[code].dependsOn = _suprlays[i].deps;
        }

        for (i = 0, l = _platfrms.length; i < l; i++) {
            code = _platfrms[i].code;
            window.platforms[code] = {};
            window.platforms[code].index = _platfrms[i].order;
            window.platforms[code].dependsOn = _platfrms[i].deps;
            window.platforms[code]._id = _platfrms[i]._id;
        }

        for (i = 0, l = _layers.length; i < l; i++) {
            name = helper.capFirstLetter(_layers[i].name);
            layers[name] = {};
            layers[name].super_layer = _layers[i].suprlay;
            layers[name].index = _layers[i].order;
            layers[name]._id = _layers[i]._id;
        }

        var buildElement = function (e) {

            var _comp = _comps[e];

            var _platfrm = getSPL(_comp._platfrm_id, _platfrms);
            var _layer = getSPL(_comp._layer_id, _layers);
            
            var layerID = _layer.order;
            layerID = (layerID === undefined) ? layers.size() : layerID;

            var platformID = _platfrm ? _platfrm.order : undefined;
            platformID = (platformID === undefined) ? window.platforms.size() : platformID;

            var _author = getBestDev(_comp.devs, "author");
            var _maintainer = getBestDev(_comp.devs, "maintainer");
            
            _layer = helper.capFirstLetter(_layer.name);

            var element = {
            	id: _comp._id,
                platform: _platfrm ? _platfrm.code : undefined,
                platformID: platformID,
                superLayer : layers[_layer].super_layer,
                code: helper.getCode(_comp.name),
                name: helper.capFirstLetter(_comp.name),
                layer: _layer,
                layerID: layerID,
                type: helper.capFirstLetter(_comp.type),
                picture: _author.avatar_url ? _author.avatar_url : undefined,
                author: _author.usrnm ? _author.usrnm : undefined,
                authorRealName: _author.name ? _author.name : undefined,
                authorEmail: _author.email ? _author.email : undefined,
                maintainer : _maintainer.usrnm ? _maintainer.usrnm : undefined,
                maintainerPicture : _maintainer.avatar_url ? _maintainer.avatar_url : undefined,
                maintainerRealName : _maintainer.name ? _maintainer.name : undefined,
                difficulty: _comp.difficulty,
                code_level: _comp.code_level ? _comp.code_level : undefined,
                life_cycle: _comp.life_cycle,
                found: _comp.found,
                devs: _comp.devs,
                repo_dir: _comp.repo_dir,
                description: _comp.description
            };
            return element;
        };
        
        for (i = 0, l = _comps.length; i < l; i++) {
            
            var element = buildElement(i);

            //An element is always inside a platform or a superlayer
            var group = element.platform || element.superLayer,
                layer = element.layer;

            if(typeof window.TABLE[group] === 'undefined'){
                window.TABLE[group] = {   
                    layers : {},
                    ID: element.platformID,
                    isSlayer: element.superLayer
                };
            }

            if(typeof window.TABLE[group].layers[layer] === 'undefined'){ 
                window.TABLE[group].layers[layer] = {   
                    objects : [],
                    y : 0,
                    ID: element.layerID
                };
            }

            var lastObject = window.TABLE[group].layers[layer].objects.length;
            var count = lastObject;
            

            var objectTile = { 
                mesh : null,
                data : element,
                target : {},
                id: group + '_' + layer + '_' + count
            };


            window.tilesQtty.push(objectTile.id);

            window.TABLE[group].layers[layer].objects.push(objectTile);

        }

        groupsQtty = _platfrms.length;
        layersQtty = list.layers.length;
        _firstLayer = _layers[0].order;
    };

    /**
     * Creates the tile texture
     * @param   {Number} id         ID in the table
     * @param   {String} quality    The quality of the picture as folder in the images dir
     * @param   {Number} tileWidth  Width of the tile
     * @param   {Number} tileHeight Height of the tile
     * @param   {Number} scale      Scale of the pictures, the bigger, the better but heavier
     * @returns {Object} The drawn texture
     */
    this.createTexture = function (id, quality, tileWidth, tileHeight, scale, _table) {
        
        var tile = _table || window.helper.getSpecificTile(id).data;

        var state = tile.code_level,
            difficulty = Math.ceil(tile.difficulty / 2),
            group = tile.platform || window.layers[tile.layer].super_layer,
            type = tile.type,
            picture = tile.picture,
            base = 'images/tiles/';

        var canvas = document.createElement('canvas');
        canvas.width = tileWidth * scale;
        canvas.height = tileHeight * scale;

        var middle = canvas.width / 2;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = 'center';

        var texture = new THREE.Texture(canvas);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.LinearFilter;

        var pic = {
                src: picture || base + 'buster.png'
            },
            portrait = {
                src: base + 'portrait/' + quality + '/' + state + '.png',
                x: jsonTile.global.portrait.x,
                y: jsonTile.global.portrait.y,
                w: jsonTile.global.portrait.w * tileWidth * scale,
                h: jsonTile.global.portrait.h * tileHeight * scale
            },
            groupIcon = {
                src: base + 'icons/group/' + quality + '/icon_' + group + '.png',
                w: jsonTile.global.groupIcon.w * scale,
                h: jsonTile.global.groupIcon.h * scale
            },
            typeIcon = {
                src: base + 'icons/type/' + quality + '/' + type.toLowerCase() + '_logo.png',
                w: jsonTile.global.typeIcon.w * scale,
                h: jsonTile.global.typeIcon.h * scale
            },
            ring = {
                src: base + 'rings/' + quality + '/' + state + '_diff_' + difficulty + '.png'
            },
            codeText = {
                text: tile.code,
                font: (jsonTile.global.codeText.font * scale) + "px Arial"
            },
            nameText = {
                text: tile.name,
                font: (jsonTile.global.nameText.font * scale) + 'px Arial'
            },
            layerText = {
                text: tile.layer,
                font: (jsonTile.global.layerText.font * scale) + 'px Arial'
            },
            authorText = {
                text: tile.authorRealName || tile.author || '',
                font: (jsonTile.global.authorText.font * scale) + 'px Arial'
            },
            picMaintainer = {
                src: tile.maintainerPicture || base + 'buster.png'
            },
            maintainer = {
                text: 'Maintainer',
                font: (jsonTile.global.maintainer.font * scale) + 'px Arial',
                color: "#FFFFFF"
            },
            nameMaintainer = {
                text: tile.maintainerRealName || tile.maintainer || '',
                font: (jsonTile.global.nameMaintainer.font * scale) + 'px Arial',
                color: "#FFFFFF"
            },
            userMaintainer = {
                text: tile.maintainer || 'No Maintainer yet',
                font: (jsonTile.global.userMaintainer.font * scale) + 'px Arial',
                color: "#E2E2E2"
            };

            pic.x = jsonTile[state].pic.x * scale;
            pic.y = jsonTile[state].pic.y * scale;
            pic.w = jsonTile[state].pic.w * scale;
            pic.h = jsonTile[state].pic.h * scale;

            groupIcon.x = jsonTile[state].groupIcon.x * scale;
            groupIcon.y = jsonTile[state].groupIcon.y * scale;

            typeIcon.x = jsonTile[state].typeIcon.x * scale;
            typeIcon.y = jsonTile[state].typeIcon.y * scale;

            ring.x = jsonTile[state].ring.x * scale;
            ring.y = jsonTile[state].ring.y * scale;
            ring.w = jsonTile[state].ring.w * scale;
            ring.h = jsonTile[state].ring.h * scale;

            codeText.x = middle;
            codeText.y = jsonTile[state].codeText.y * scale;

            nameText.x = middle;
            nameText.y = jsonTile[state].nameText.y * scale;
            nameText.font = (jsonTile[state].nameText.font * scale) + 'px Arial';

            layerText.x = middle;
            layerText.y = jsonTile[state].layerText.y * scale;

            authorText.x = middle;
            authorText.y = jsonTile[state].authorText.y * scale;

            picMaintainer.x = jsonTile[state].picMaintainer.x * scale;
            picMaintainer.y = jsonTile[state].picMaintainer.y * scale;
            picMaintainer.w = jsonTile[state].picMaintainer.w * scale;
            picMaintainer.h = jsonTile[state].picMaintainer.h * scale;

            maintainer.x = jsonTile[state].maintainer.x * scale;
            maintainer.y = jsonTile[state].maintainer.y * scale;

            nameMaintainer.x = jsonTile[state].nameMaintainer.x * scale;
            nameMaintainer.y = jsonTile[state].nameMaintainer.y * scale;

            userMaintainer.x = jsonTile[state].userMaintainer.x * scale;
            userMaintainer.y = jsonTile[state].userMaintainer.y * scale; 

            if(typeof jsonTile[state].layerText.color  !== 'undefined')
                layerText.color = jsonTile[state].layerText.color;

            if(typeof jsonTile[state].nameText.color  !== 'undefined')
                nameText.color = jsonTile[state].nameText.color;

            if(state === "production"){ 
                codeText.x = jsonTile[state].codeText.x * scale;
                layerText.x = jsonTile[state].layerText.x * scale;
                authorText.x = jsonTile[state].authorText.x * scale;

                nameText.x = jsonTile[state].nameText.x * scale;                
                nameText.constraint = jsonTile[state].nameText.constraint * scale;
                nameText.lineHeight = jsonTile[state].nameText.lineHeight * scale;
                nameText.wrap = true;
            }

        if (state == "concept" || state == "production")
            ring.src = base + 'rings/' + quality + '/linear_diff_' + difficulty + '.png';

        if (difficulty === 0)
            ring = {};

        var data = [
            pic,
            picMaintainer,
            portrait,
            groupIcon,
            typeIcon,
            ring,
            codeText,
            nameText,
            layerText,
            authorText,
            maintainer,
            nameMaintainer,
            userMaintainer
        ];

        if ( tile.found !== true ) {

            var stamp = {
                src: 'images/alt_not_found.png',
                x: 0,
                y: 0,
                w: tileWidth * scale,
                h: tileHeight * scale
            };

            data.push(stamp);

        }

        drawPicture(data, ctx, texture);

        return texture;
    };

    /**
     * Creates a Tile
     * @param   {Number}     i ID of the tile (index in table)
     * @returns {DOMElement} The drawable element that represents the tile
     */
     
    this.createElement = function (id, _table) {

        var mesh,
            element = new THREE.LOD(),
            levels = [
                ['high', 0],
                ['medium', 1000],
                ['small', 1800],
                ['mini', 2300]
            ],
            texture,
            tileWidth = window.TILE_DIMENSION.width - window.TILE_SPACING,
            tileHeight = window.TILE_DIMENSION.height - window.TILE_SPACING,
            scale = 2,
            table = _table || null;

        for (var j = 0, l = levels.length; j < l; j++) {

            if (levels[j][0] === 'high') scale = 5;
            else scale = 1;

            texture = self.createTexture(id, levels[j][0], tileWidth, tileHeight, scale, table);

            mesh = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(tileWidth, tileHeight),
                new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    transparent : true,
                    map : texture
                }) 
            );

            mesh.userData = {
                id: id,
                onClick : onClick
            };
            mesh.renderOrder = 1;
            element.addLevel(mesh, levels[j][1]);
            element.userData = {
                flying: false
            };
        }

        return element;
    };

    /**
     * Converts the table in another form
     * @param {Array}  goal     Member of ViewManager.targets
     * @param {Number} duration Milliseconds of animation
     */
    this.transform = function (ordered, duration) {

        var i, l, j,
            DELAY = 500;

        duration = duration || 2000;
        ordered = ordered || false;

        //TWEEN.removeAll();

        var animate = function(object, target, delay) { 

            delay = delay || 0;

             var move = new TWEEN.Tween(object.position)
                        .to({
                            x: target.position.x,
                            y: target.position.y,
                            z: target.position.z
                        }, Math.random() * duration + duration)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .delay(delay)
                        .onComplete(function() { object.userData.flying = false; });

            var rotation = new TWEEN.Tween(object.rotation)
                            .to({
                                x: target.rotation.x,
                                y: target.rotation.y,
                                z: target.rotation.z
                            }, Math.random() * duration + duration)
                            .delay(delay)
                            .easing(TWEEN.Easing.Exponential.InOut);

            move.onStart(function() { rotation.start(); });

            return move;
        };
        
        if(ordered === true) {

            for(i = 0; i < self.elementsByGroup.length; i++) {

                var k = (i + self.elementsByGroup.length - 1) % (self.elementsByGroup.length);
                var delay = i * DELAY;

                for(j = 0; j < self.elementsByGroup[k].length; j++) {

                    var index = self.elementsByGroup[k][j];
                    
                    var target = window.helper.getSpecificTile(index);

                    var animation = animate(target.mesh, target.target.show, delay);

                    animation.start();
                }
            }
        }
        else {

            for(var r = 0; r < window.tilesQtty.length; r++){

                var tile = window.helper.getSpecificTile(window.tilesQtty[r]);                  
                    
                animate(tile.mesh, tile.target.show, 0).start();
            }
        }

        if(window.actualView === 'table') {
            if(!window.headersUp) {
                headers.showHeaders(duration);
                window.headersUp = true;
            }
        }
        

        new TWEEN.Tween(this)
            .to({}, duration * 2 + self.elementsByGroup * DELAY)
            .onUpdate(render)
            .start();
        
        setTimeout(window.screenshotsAndroid.show, duration);
    };

    /**
     * Goes back to last target set in last transform
     */
    this.rollBack = function () {

        window.camera.enable();
        window.camera.loseFocus();
    
        window.helper.show('container', 2000);
    
        window.flowManager.getActualFlow();

        self.transform();

        //window.changeView(self.lastTargets);
    };

    /**
     * Inits and draws the table, also creates the Dimensions object
     */
    this.drawTable = function () {

        this.preComputeLayout();
        
        var layerCoordinates = [];
        
        var signRow = null,
            signColumn = null;

        for(var i = 0; i < window.tilesQtty.length; i++){

            var id = window.tilesQtty[i];

            var mesh = this.createElement(id);
            
            scene.add(mesh);

            window.helper.getSpecificTile(id).mesh = mesh;

            var object = new THREE.Object3D();

            //Row (Y)
            var tile = window.helper.getSpecificTile(id).data;

            var group = tile.platform || window.layers[tile.layer].super_layer;

            var row = tile.layerID;

            if (layers[tile.layer].super_layer) {

                object.position.x = ((section[row]) * window.TILE_DIMENSION.width) - (columnWidth * groupsQtty * window.TILE_DIMENSION.width / 2);

                section[row]++;

            } else {

                //Column (X)
                var column = tile.platformID;

                object.position.x = (((column * (columnWidth) + section[row][column]) + column) * window.TILE_DIMENSION.width) - (columnWidth * groupsQtty * window.TILE_DIMENSION.width / 2);

                section[row][column]++;
            }


            object.position.y = -((layerPosition[row]) * window.TILE_DIMENSION.height) + (layersQtty * window.TILE_DIMENSION.height / 2);
            
            if(typeof layerCoordinates[row] === 'undefined')
                layerCoordinates[row] = object.position.y;


            /*start Positioning tiles*/

            object.position.copy(window.viewManager.translateToSection('table', object.position));

            if(layers[tile.layer].super_layer){ 

                if(typeof window.TABLE[layers[tile.layer].super_layer].x === 'undefined')
                    window.TABLE[layers[tile.layer].super_layer].x = object.position.x;

            }

            var target = window.helper.fillTarget(object.position.x, object.position.y, object.position.z, 'table');

            window.helper.getSpecificTile(id).target = target;

            mesh.position.copy(target.hide.position);

            mesh.rotation.set(target.hide.rotation.x, target.hide.rotation.y, target.hide.rotation.z);

            /*End*/
            if(!signLayer.findSignLayer(group, tile.layer)){
                if(i === 0 ){ //entra a la primera
                    window.signLayer.createSignLayer(object.position.x, object.position.y, tile.layer, group);
                    signRow = tile.layerID;
                    signColumn = tile.platformID;
                    window.TABLE[group].layers[tile.layer].y = object.position.y;
                }

                if(tile.layerID !== signRow && tile.platformID === signColumn && layers[tile.layer].super_layer === false){ // solo cambio de filas
                    window.signLayer.createSignLayer(object.position.x, object.position.y, tile.layer, group);
                    signRow = tile.layerID;
                    signColumn = tile.platformID;
                    window.TABLE[group].layers[tile.layer].y = object.position.y;
                }

                else if(signColumn !== tile.platformID && layers[tile.layer].super_layer === false){ //cambio de columna
                    window.signLayer.createSignLayer(object.position.x, object.position.y, tile.layer, group);
                    signRow = tile.layerID;
                    signColumn = tile.platformID;
                    window.TABLE[group].layers[tile.layer].y = object.position.y;
                }
            }                               
        }

        this.dimensions = {
            columnWidth: columnWidth,
            superLayerMaxHeight: superLayerMaxHeight,
            groupsQtty: groupsQtty,
            layersQtty: layersQtty,
            superLayerPosition: superLayerPosition,
            layerPositions : layerCoordinates
        };
    };

    /**
     * Takes away all the tiles except the one with the id
     * @param {Array}  [ids]           The IDs to let alone
     * @param {Number} [duration=2000] Duration of the animation
     */
    this.letAlone = function (ids, duration) {

        var i, _duration = duration || 2000,
            distance = camera.getMaxDistance() * 2,
            out = window.viewManager.translateToSection('table', new THREE.Vector3(0, 0, distance));

        //TWEEN.removeAll();

        var target;

        var animate = function (object, target, dur) {

            new TWEEN.Tween(object.position)
                .to({
                    x: target.x,
                    y: target.y,
                    z: target.z
                }, dur)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(function () {
                    object.userData.flying = false;
                })
                .start();

        };

        for(i = 0; i < window.tilesQtty.length; i++){

            var tile = window.helper.getSpecificTile(window.tilesQtty[i]);  
        
            if (ids === tile.id) {
                target =  tile.target.show.position;
            } 
            else {
                target = out;
                tile.mesh.userData.flying = true;
            }

            animate(tile.mesh, target, Math.random() * _duration + _duration);      
        }
               
        new TWEEN.Tween(this)
            .to({}, _duration * 2)
            .onUpdate(render)
            .start();
        
        window.screenshotsAndroid.hide();
        window.signLayer.letAloneSignLayer();
    };

    this.updateElementsByGroup = function(){

        self.elementsByGroup = [];

        window.tilesQtty = [];
        
        var i = 0;

        for (var j = 0; j <= groupsQtty; j++) {

            self.elementsByGroup.push([]);
        }

        for(var platform in window.TABLE){

            for(var layer in window.TABLE[platform].layers){

                for(i = 0; i < window.TABLE[platform].layers[layer].objects.length; i++){
                
                    var tile = window.TABLE[platform].layers[layer].objects[i];
            
                    var c = tile.data.platformID;
                    var id = tile.id;

                    window.tilesQtty.push(id);

                    self.elementsByGroup[c].push(id);
                    
                }
            }
        }
    };

    //Private methods

    /**
     * Draws a picture in canvas
     * @param {Array}  data    The options of the picture
     * @param {Object} ctx     Canvas context
     * @param {Object} texture The texture object to update
     */
    function drawPicture(data, ctx, texture) {

        var image = new Image();
        var actual = data.shift();

        if (actual && actual.src && actual.src != 'undefined') {

            image.onload = function () {

                ctx.drawImage(image, actual.x, actual.y, actual.w, actual.h);
                if (texture)
                    texture.needsUpdate = true;

                if (data.length !== 0) {

                    if (data[0].text)
                        drawText(data, ctx, texture);
                    else
                        drawPicture(data, ctx, texture);
                }
            };

            image.onerror = function () {
                if (data.length !== 0) {
                    if (data[0].text)
                        drawText(data, ctx, texture);
                    else
                        drawPicture(data, ctx, texture);
                }
            };

            image.crossOrigin = "anonymous";
            image.src = actual.src;
        } else {
            if (data.length !== 0) {
                if (data[0].text)
                    drawText(data, ctx, texture);
                else
                    drawPicture(data, ctx, texture);
            }
        }
    }

    /**
     * Draws a texture in canvas
     * @param {Array}  data    Options of the texture
     * @param {Object} ctx     Canvas Context
     * @param {Object} texture Texture to update
     */
    function drawText(data, ctx, texture) {

        var actual = data.shift();

        //TODO: Set Roboto typo

        if (actual.color)
            ctx.fillStyle = actual.color;

        ctx.font = actual.font;

        if (actual.constraint)
            if (actual.wrap)
                helper.drawText(actual.text, actual.x, actual.y, ctx, actual.constraint, actual.lineHeight);
            else
                ctx.fillText(actual.text, actual.x, actual.y, actual.constraint);
        else
            ctx.fillText(actual.text, actual.x, actual.y);

        if (texture)
            texture.needsUpdate = true;

        ctx.fillStyle = "#FFFFFF";

        if (data.length !== 0){ 

          if(data[0].text)
            drawText(data, ctx, texture); 
          else 
            drawPicture(data, ctx, texture);
        }
    }
    
    function getSPL(_id, _SPLArray) {
        if (_id) {
            for (var i = 0, l = _SPLArray.length; i < l; i++) {
                if (_SPLArray[i]._id + '' == _id + '') {
                    return _SPLArray[i];
                }
            }
        } else {
            return null;
        }
    }

    /**
     * Gets the best developer in the given role
     * @param   {Array}  _devs The array of developers
     * @param   {string} role  The role to look for
     * @returns {object} The best developer by the given criteria
     */
    function getBestDev(_devs, role) {
        var dev = {};
        if (_devs) {
            var _dev = {};
            dev.percnt = 0;
            for (var i = 0, l = _devs.length; i < l; i++) {
                _dev = _devs[i];
                
                if((role === 'author' && _dev.role === 'author' && _dev.scope === 'implementation') ||
                   (role === 'maintainer' && _dev.role === 'maintainer')) {
                
                    if (_dev.percnt >= dev.percnt) {
                        
                        dev.percnt = _dev.percnt;
                        dev.usrnm = _dev.dev.usrnm;
                        dev.name = _dev.dev.name;
                        dev.email = _dev.dev.email;
                        dev.avatar_url = _dev.dev.avatar_url;
                    }
                }
            }
        }
        return dev;
    }
}