/**
 * @author Ricardo Delgado
 */
function TableEdit() {

    var tileWidth = window.TILE_DIMENSION.width - window.TILE_SPACING,
        tileHeight = window.TILE_DIMENSION.height - window.TILE_SPACING;

    var self = this;

    /**
     * @author Ricardo Delgado
     */

    this.addButton = function(_id){

        var id = _id || null,
            text = 'Edit Component',
            button = 'buttonFermatEdit',
            side = null,
            callback = null;

        if(id === null){

            if(!window.session.getIsLogin()){
            
                callback = function(){ 
                    window.session.getAuthCode();
                };
            }
            else{

                callback = function(){ 

                    window.alert('This is an incubating feature, your changes will not be saved!');

                    window.fieldsEdit.actions.type = "insert";

                    window.buttonsManager.removeAllButtons();

                    window.session.displayLoginButton(false);

                    drawTile(null, addAllFilds);
                };

            }

            window.session.displayLoginButton(true);

            text = 'Add New Component';
            button = 'buttonFermatNew';
            side = 'left';

            window.buttonsManager.createButtons(button, text, callback, null, null, side);

        }
        else{

            if(!window.session.getIsLogin()){
            
                callback = function(){ 
                    window.session.getAuthCode();
                };
            }
            else{

                callback = function(){

                    window.alert('This is an incubating feature, your changes will not be saved!');
                    window.fieldsEdit.actions.type = "update";
                    window.buttonsManager.removeAllButtons(); 
                    addAllFilds();
                    fillFields(id);
                    drawTile(id);
                };
            }

            window.session.displayLoginButton(false);

            window.buttonsManager.createButtons(button, text, callback, null, null, side);

            if(!window.session.getIsLogin()){
            
                callback = function(){ 
                    window.session.getAuthCode();
                };
            }
            else{ 

                callback = function(){

                    window.alert('This is an incubating feature, your changes will not be saved!');
                    
                    if(window.confirm("Really remove this component?"))           
                        deleteTile(id);                
                };
            }

            text = 'Delete Component';
            button = 'buttonFermatDelete';
            side = 'right';

            window.buttonsManager.createButtons(button, text, callback, null, null, side);
        }   
    
    };

    function addAllFilds(){

        window.fieldsEdit.createFieldTableEdit();
    }

    // Start editing
    function fillFields(id){

        var tile = JSON.parse(JSON.stringify(window.helper.getSpecificTile(id).data));

        window.fieldsEdit.actualTile = JSON.parse(JSON.stringify(tile));

        if(tile.platform !== undefined)
            document.getElementById('select-Group').value = tile.platform;
        else
            document.getElementById('select-Group').value = window.layers[tile.layer].super_layer;

        window.fieldsEdit.changeLayer(document.getElementById('select-Group').value);

        if(tile.layer !== undefined)        
            document.getElementById('select-layer').value = tile.layer;

        if(tile.type !== undefined)
            document.getElementById('select-Type').value = tile.type;
        
        if(tile.difficulty !== undefined)
            document.getElementById('select-Difficulty').value = tile.difficulty; 

        if(tile.code_level !== undefined)
            document.getElementById('select-State').value = tile.code_level; 

        if(tile.name !== undefined)
            document.getElementById('imput-Name').value = tile.name;       
        
        if(tile.devs !== undefined) 
            document.getElementById('modal-devs').value = tile.devs.slice(0);
        
        if(tile.description !== undefined)
            document.getElementById('modal-desc-textarea').value = tile.description;
        
        if(tile.repo_dir !== undefined)
            document.getElementById('input-repodir').value = tile.repo_dir;
        
    }

    function createElement() {

        var newCenter = window.helper.getCenterView('table');

        var y = window.helper.getLastValueArray(window.tileManager.dimensions.layerPositions) + (window.TILE_DIMENSION.height * 2);

        var mesh = new THREE.Mesh(
                   new THREE.PlaneBufferGeometry(tileWidth, tileHeight),
                   new THREE.MeshBasicMaterial({
                            side: THREE.DoubleSide,
                            transparent : true,
                            map : null
                        })
                );

        var target = window.helper.fillTarget(newCenter.x, y, newCenter.z, 'table');

        mesh.position.copy(target.hide.position);

        mesh.rotation.copy(target.hide.rotation);

        mesh.renderOrder = 1;

        window.scene.add(mesh);

        window.fieldsEdit.objects.tile.mesh = mesh;

        window.fieldsEdit.objects.tile.target = target;
    }

    function drawTile(id, callback){

        if(window.fieldsEdit.objects.tile.mesh === null)
            createElement();

        var mesh = window.fieldsEdit.objects.tile.mesh;
        
        var exit = null;

        if(window.fieldsEdit.actions.type === "insert") {

            exit = function(){
                window.camera.resetPosition();
            };

            window.fieldsEdit.actions.exit = exit;

            animate(mesh, window.fieldsEdit.objects.tile.target.show, 1000, function(){ 

                window.camera.setFocus(mesh, new THREE.Vector4(0, 0, tileWidth, 1), 2000);

                if(typeof(callback) === 'function')
                    callback(); 
                
                self.changeTexture();

                window.camera.disable(); 

                window.helper.showBackButton();

            });
        }
        else{

            exit = function(){
                window.camera.resetPosition();
            };

            window.fieldsEdit.actions.exit = exit;

            self.changeTexture();

            animate(mesh, window.fieldsEdit.objects.tile.target.show, 1000, function(){ 

                window.camera.setFocus(mesh, new THREE.Vector4(0, 0, tileWidth, 1), 1500);

                window.tileManager.transform(false, 1000);
                window.signLayer.transformSignLayer();

                setTimeout( function() {
                    var data = helper.getSpecificTile(id);
                    animate(data.mesh, data.target.hide, 1000);
                }, 2000 );

            });

        }
    } 

    this.changeTexture = function(){

        var table = null,
            scale = 5,
            mesh = null;

        table = fillTable(true);

        mesh = window.fieldsEdit.objects.tile.mesh;

        mesh.material.map = window.tileManager.createTexture(null, 'high', tileWidth, tileHeight, scale, table); 
        mesh.material.needsUpdate = true; 

    };

    this.deleteMesh = function(){

        var mesh = window.fieldsEdit.objects.tile.mesh;

        if(mesh != null){ 

            animate(mesh, window.fieldsEdit.objects.tile.target.hide, 1500, function(){ 
                    window.scene.remove(mesh);
                });

            window.fieldsEdit.objects.tile.mesh = null;
        }
    };
    // end

    //Save Tile
    this.saveTile = function(){

        if(validateFields() === ''){ 

            var table = fillTable(false);

            window.fieldsEdit.disabledButtonSave(true);
            
            if(window.fieldsEdit.actions.type === "insert")
                createTile(table);
            else if(window.fieldsEdit.actions.type === "update")
                modifyTile(table);
        }
        else{
             window.alert(validateFields());
        }
    };

    function validateFields(){
        var msj = '';

        var name = document.getElementById('imput-Name');

        if(name.value === ""){
            msj += 'The component must have a name \n';
            name.focus();
        }

        return msj;
    }
    // end

    //tile action
    function createTile(_table){

        var params = getParamsData(_table);  

        window.helper.postRoutesComponents('insert', params, null,
            function(res){ 

                _table.id = res._id;

                postParamsDev(_table, function(table){

                    window.camera.loseFocus();
                    window.camera.enable();
                        
                    var x, y, z;

                    var platform = table.platform || window.layers[table.layer].super_layer,
                        layer = table.layer,
                        object = { 
                            mesh : null,
                            data : {},
                            target : {},
                            id : null
                        };

                    if(typeof window.TABLE[platform].layers[layer] === 'undefined'){ 
                        window.TABLE[platform].layers[layer] = {   
                            objects : [],
                            y : y 
                        };
                    }

                    var count = window.TABLE[platform].layers[layer].objects.length;

                    object.id = platform + '_' + layer + '_' + count;

                    var mesh = window.tileManager.createElement(object.id, table);

                    var lastObject = helper.getLastValueArray(window.TABLE[platform].layers[layer].objects);

                    x = 0;

                    if(!lastObject)
                        x = window.TABLE[platform].x;
                    else
                        x = lastObject.target.show.position.x + window.TILE_DIMENSION.width;

                    var index = window.layers[layer].index;

                    y = window.tileManager.dimensions.layerPositions[index];

                    z = 0;

                    var target = helper.fillTarget(x, y, z, 'table');

                    mesh.position.copy(target.hide.position);
                    mesh.rotation.copy(target.hide.rotation);

                    window.scene.add(mesh);

                    object.mesh = mesh;
                    object.data = table;
                    object.target = target;

                    window.camera.move(target.show.position.x, target.show.position.y, target.show.position.z + 8000, 4000);

                    animate(mesh, target.show, 4500, function(){

                       window.screenshotsAndroid.hidePositionScreenshots(platform, layer); 
                       window.tileManager.updateElementsByGroup();
                    });
                            
                    window.TABLE[platform].layers[layer].objects.push(object);

                });
            },
            function(){
                window.fieldsEdit.disabledButtonSave(false);
            });

        function getParamsData(table){

            var param = { };

            var newLayer = table.layer,
                newGroup = table.platform || window.layers[table.layer].super_layer;

            if(typeof window.platforms[newGroup] !== "undefined"){
                param.platfrm_id = window.platforms[newGroup]._id;
                param.suprlay_id = null;
            }
            else{
                param.suprlay_id = window.superLayers[newGroup]._id;
                param.platfrm_id = null;
            }
            
            param.layer_id = window.layers[newLayer]._id;
            
            param.name = table.name;

            param.type = table.type.toLowerCase();

            param.difficulty = parseInt(table.difficulty);

            param.code_level = table.code_level.toLowerCase();

            param.scrnshts = false;

            if(table.repo_dir){
                param.found = true;
                param.repo_dir = table.repo_dir;
            }
            else{
                param.found = false;
                param.repo_dir = "root";
            }

            if(table.description)
                param.description = table.description;
            else
                param.description = "pending";

            return param;
        }

        function postParamsDev(table, callback){

            var devs = table.devs;

            var newDevs = [];

            postDevs(devs);

            function postDevs(devs){

                if(devs.length > 0){ 

                    var dataPost = {
                                comp_id : table.id
                            };

                    var param = {};

                    param.dev_id = devs[0].dev._id;
                    param.percnt = devs[0].percnt;
                    param.role = devs[0].role;
                    param.scope = devs[0].scope;

                    window.helper.postRoutesComponents('insert dev', param, dataPost,
                        function(res){

                            devs[0]._id = res._id;

                            newDevs.push(devs[0]);
                            
                            devs.splice(0,1);

                            postDevs(devs);

                        });
                }
                else{

                    table.devs = newDevs;

                    callback(table);
                }
            }
        }
    }

    function modifyTile(_table){ 

        var params = getParamsData(_table);

        var dataPost = {
                comp_id : window.fieldsEdit.actualTile.id
            };

        window.helper.postRoutesComponents('update', params, dataPost,
            function(res){ 

                _table.id = window.fieldsEdit.actualTile.id;

                postParamsDev(_table, function(table){

                    var oldTile = JSON.parse(JSON.stringify(window.fieldsEdit.actualTile)),
                        newLayer = table.layer,
                        newGroup = table.platform || window.layers[table.layer].super_layer,
                        oldLayer = oldTile.layer,
                        oldGroup = oldTile.platform || window.layers[oldTile.layer].super_layer;
                        

                    window.camera.loseFocus();
                    window.camera.enable();

                    var arrayObject = window.TABLE[oldGroup].layers[oldLayer].objects.slice(0);

                    for(var i = 0; i < arrayObject.length; i++){
                        
                        if(arrayObject[i].data.author === oldTile.author && arrayObject[i].data.name === oldTile.name){

                            window.scene.remove(arrayObject[i].mesh);
                            
                        }
                    }

                    var positionCameraX = window.TABLE[oldGroup].x,
                        positionCameraY = helper.getPositionYLayer(oldLayer);

                    window.camera.move(positionCameraX, positionCameraY, 8000, 2000);

                    setTimeout( function() {

                        if(newGroup !== oldGroup || newLayer !== oldLayer)
                            change();
                        else
                            notChange();

                    }, 2000 );

                    function change(){

                        window.TABLE[oldGroup].layers[oldLayer].objects = [];
                        var idScreenshot = oldGroup + "_" + oldLayer + "_" + oldTile.name;

                        window.screenshotsAndroid.deleteScreenshots(idScreenshot);
               
                        for(var i = 0; i < arrayObject.length; i++){
                            
                            if(arrayObject[i].data.author === oldTile.author && arrayObject[i].data.name === oldTile.name){

                                arrayObject.splice(i,1);
                            }
                        }

                        window.TABLE[oldGroup].layers[oldLayer].objects = modifyRowTable(arrayObject, oldGroup, oldLayer);

                        setTimeout( function() { 

                            positionCameraX = window.TABLE[newGroup].x;
                            positionCameraY = window.helper.getPositionYLayer(newLayer);
                            camera.move(positionCameraX, positionCameraY,8000, 2000);
                            createNewElementTile(table);
                            window.screenshotsAndroid.hidePositionScreenshots(newGroup, newLayer);
                            window.tileManager.updateElementsByGroup();

                        }, 2000 );

                    }

                    function notChange(){

                        var arrayObject = window.TABLE[oldGroup].layers[oldLayer].objects;
                        var target = null;
                        var _ID = null;
                        var id = 0;

                        var idScreenshot = oldGroup + "_" + oldLayer + "_" + oldTile.name;

                        if(oldTile.name !== table.name)
                            window.screenshotsAndroid.deleteScreenshots(idScreenshot);

                        for(var i = 0; i < arrayObject.length; i++){
                            
                            if(arrayObject[i].data.author === oldTile.author && arrayObject[i].data.name === oldTile.name){

                                id = i;
                                window.TABLE[oldGroup].layers[oldLayer].objects[i].data = table;
                                target = window.TABLE[oldGroup].layers[oldLayer].objects[i].target;
                                _ID = window.TABLE[oldGroup].layers[oldLayer].objects[i].id;
                            }
                        }

                        var mesh = window.tileManager.createElement(_ID, table);

                        window.TABLE[oldGroup].layers[oldLayer].objects[id].mesh = mesh;

                        window.scene.add(mesh);
                        
                        animate(mesh, target.show, 2000,function(){
                            window.screenshotsAndroid.hidePositionScreenshots(oldGroup, oldLayer); 
                        });

                    }

                });

        },
        function(){
            window.fieldsEdit.disabledButtonSave(false);
        });

        function getParamsData(table){

            var param = {};

            var newLayer = table.layer,
                newGroup = table.platform || window.layers[table.layer].super_layer,
                oldLayer = window.fieldsEdit.actualTile.layer,
                oldGroup = window.fieldsEdit.actualTile.platform || window.layers[window.fieldsEdit.actualTile.layer].super_layer;

            if(typeof window.platforms[newGroup] !== "undefined"){ 
                param.platfrm_id = window.platforms[newGroup]._id;
                param.suprlay_id = null;
            }
            else{
                param.suprlay_id = window.superLayers[newGroup]._id;
                param.platfrm_id = null;
            }

            if(newLayer !== oldLayer)
                param.layer_id = window.layers[newLayer]._id;
            
            if(table.name !== window.fieldsEdit.actualTile.name)
                param.name = table.name;

            if(table.type !== window.fieldsEdit.actualTile.type)
                param.type = table.type.toLowerCase();

            if(table.difficulty !== window.fieldsEdit.actualTile.difficulty)
                param.difficulty = parseInt(table.difficulty);

            if(table.code_level !== window.fieldsEdit.actualTile.code_level)
                param.code_level = table.code_level.toLowerCase();

            if(table.description !== window.fieldsEdit.actualTile.description)
                param.description = table.description;

            if(table.repo_dir.toLowerCase() !== window.fieldsEdit.actualTile.repo_dir.toLowerCase()){
                
                if(table.repo_dir)
                    param.repo_dir = table.repo_dir;
                else
                    param.repo_dir = "root";
            }

            if(table.repo_dir)
                param.found = true;
            else
                param.found = false;

            return param;
        }

        function postParamsDev(table, callback){

            var newDevs = table.devs.slice(0),
                oldDevs = window.fieldsEdit.actualTile.devs.slice(0),
                newTableDevs = [],
                config = { 
                        insert :{
                            devs : [],
                            route : 'insert dev'
                        },
                        update : {
                            devs : [],
                            route : 'update dev'
                        },
                        delete :{
                            devs : [],
                            route : 'delete dev'
                        }
                    };

            fillDevs(newDevs, oldDevs, 'insert');

            postDevs('delete',config.delete.devs.slice(0), function(){

                postDevs('update',config.update.devs.slice(0), function(){

                    postDevs('insert',config.insert.devs.slice(0), function(){

                        table.devs = newTableDevs;
                        
                        callback(table);
                    });
                });
            });

            function fillDevs(newDevs, oldDevs, task){
                
                function find_Dev(_index) {
                    if(_index._id === oldDevs[f]._id)
                        return _index;            
                }

                if(newDevs.length > 0){

                    if(task === 'insert'){

                        var array = [];

                        for(var i = 0; i < newDevs.length; i++){

                            if(!newDevs[i]._id)
                                config.insert.devs.push(newDevs[i]);
                            else
                                array.push(newDevs[i]);
                        }

                        fillDevs(array, oldDevs, 'update');
                    }
                    else if(task === 'update'){

                        if(oldDevs.length > 0){
                            

                            for(var f = 0; f < oldDevs.length; f++){

                                var t = newDevs.find(find_Dev);
                                
                                if(t){

                                    if(t.role!= oldDevs[f].role ||
                                       t.scope != oldDevs[f].scope ||
                                       t.percnt.toString() != oldDevs[f].percnt.toString()){
                                        
                                        config.update.devs.push(t);                                      
                                    }
                                    else{
                                        newTableDevs.push(oldDevs[f]);
                                    }
                                }
                                else{

                                    config.delete.devs.push(oldDevs[f]);                                  
                                }
                            }
                        }
                    }
                }
                else{

                    for(var l = 0; l < oldDevs.length; l++){
                        config.delete.devs.push(oldDevs[l]);
                    }
                }
            }

            function postDevs(task, array, callback){

                if(array.length > 0){

                    var dataPost = {
                                comp_id : table.id
                            };

                    var param = {};

                    if(task === 'update' || task === 'delete')
                        dataPost.devs_id = array[0]._id;

                    param.dev_id = array[0].dev._id;
                    param.percnt = array[0].percnt;
                    param.role = array[0].role;

                    if(param.role !== 'maintainer')
                        param.scope = array[0].scope;
                    else
                        param.scope = 'default';

                    window.helper.postRoutesComponents(config[task].route, param, dataPost,
                        function(res){

                            if(task !== 'delete'){ 

                                array[0]._id = res._id;

                                newTableDevs.push(array[0]);
                            }
                            
                            array.splice(0,1);

                            postDevs(task, array, callback);

                        },
                        function(){
                            window.fieldsEdit.disabledButtonSave(false);
                        });
                
                }
                else{

                    callback();
                }
            }
        
        }
    }

    function deleteTile(id){

        var table = window.helper.getSpecificTile(id).data;

        var dataPost = {
                comp_id : table.id
            };

        window.helper.postRoutesComponents('delete', false, dataPost,
            function(res){ 

            var oldLayer = table.layer,
                oldGroup = table.platform || window.layers[table.layer].super_layer,
                arrayObject = window.TABLE[oldGroup].layers[oldLayer].objects,
                idScreenshot = oldGroup + "_" + oldLayer + "_" + table.name;

            window.screenshotsAndroid.deleteScreenshots(idScreenshot);

            var positionCameraX = window.TABLE[oldGroup].x,
                positionCameraY = helper.getPositionYLayer(oldLayer);

            window.camera.loseFocus();
            window.camera.enable();

            window.tileManager.transform(false, 1000);
            window.headers.transformTable(1000);
            window.signLayer.transformSignLayer();

            window.camera.move(positionCameraX, positionCameraY, 8000, 2000);

            setTimeout( function() {

                window.TABLE[oldGroup].layers[oldLayer].objects = [];
           
                id = id.split("_");

                id = parseInt(id[2]);

                var mesh = arrayObject[id].mesh;

                var target =  window.helper.fillTarget(0, 0, 160000, 'table');

                animate(mesh, target.hide, 1500, function(){
                    window.scene.remove(mesh);
                });

                arrayObject.splice(id, 1);

                window.TABLE[oldGroup].layers[oldLayer].objects = modifyRowTable(arrayObject, oldGroup, oldLayer);

                window.tileManager.updateElementsByGroup();

            }, 3500 );

        });
    }
    //

    //Tools
    function createNewElementTile(table){

        var x, y, z;

        var platform = table.platform || window.layers[table.layer].super_layer,
            layer = table.layer,
            object = { 
                mesh : null,
                data : {},
                target : {},
                id : null
            };

        if(typeof window.TABLE[platform].layers[layer] === 'undefined'){ 
            window.TABLE[platform].layers[layer] = {   
                objects : [],
                y : window.helper.getPositionYLayer(layer)
            };
        }

        var lastObject = helper.getLastValueArray(window.TABLE[platform].layers[layer].objects);

        var count = window.TABLE[platform].layers[layer].objects.length;

        object.id = platform + '_' + layer + '_' + count;

        var mesh = window.tileManager.createElement(object.id, table);
    
        x = 0;

        if(!lastObject)
            x = window.TABLE[platform].x;
        else
            x = lastObject.target.show.position.x + window.TILE_DIMENSION.width;

        y = window.helper.getPositionYLayer(layer);

        z = 0;

        var target = helper.fillTarget(x, y, z, 'table');

        mesh.position.copy(target.hide.position);
        mesh.rotation.set(target.hide.rotation.x, target.hide.rotation.y, target.hide.rotation.z);

        window.scene.add(mesh);

        object.mesh = mesh;
        object.data = table;
        object.target = target;

        animate(mesh, target.show, 2500);
                
        window.TABLE[platform].layers[layer].objects.push(object);
    }

    function fillTable(found){

        var table = {platform : undefined},
            data = {},
            group = document.getElementById(window.fieldsEdit.objects.idFields.group).value,
            layer = document.getElementById(window.fieldsEdit.objects.idFields.layer).value,
            platformID = helper.getCountObject(window.platforms) - 1,
            layerID = 0,
            superLayer = false,
            _author;

        if(window.platforms[group]){
            table.platform = group;
            platformID = window.platforms[group].index;
        }
        else{
            window.superLayer = group;
        }

        if(window.layers[layer])
            window.layerID = layers[layer].index;

        table.layer = layer;
        table.type = document.getElementById(window.fieldsEdit.objects.idFields.type).value;
        table.code_level = document.getElementById(window.fieldsEdit.objects.idFields.state).value;
        table.difficulty = document.getElementById(window.fieldsEdit.objects.idFields.difficulty).value;
        table.name = document.getElementById(window.fieldsEdit.objects.idFields.name).value;
        table.code = helper.getCode(document.getElementById(window.fieldsEdit.objects.idFields.name).value);
        table.repo_dir = document.getElementById(window.fieldsEdit.objects.idFields.repo).value;
        table.description = document.getElementById("modal-desc-textarea").value;
        table.found = found;
        table.platformID = platformID;
        table.layerID = layerID;
        table.superLayer = superLayer;

        var devs = document.getElementById("modal-devs").value;
        
        table.devs = devs.slice(0);

        _author = getBestDev(table.devs, "author");

        table.picture = _author.avatar_url ? _author.avatar_url : undefined;
        table.author = _author.usrnm ? _author.usrnm : undefined;
        table.authorRealName = _author.name ? _author.name : undefined;
        table.authorEmail = _author.email ? _author.email : undefined;

        var _maintainer = getBestDev(table.devs, "maintainer");

        table.maintainer = _maintainer.usrnm ? _maintainer.usrnm : undefined;
        table.maintainerPicture = _maintainer.avatar_url ? _maintainer.avatar_url : undefined;
        table.maintainerRealName = _maintainer.name ? _maintainer.name : undefined;
        
        return table;
    }

    function modifyRowTable(arrayObject, oldGroup, oldLayer){

        var newArrayObject = [];

        for(var t = 0; t < arrayObject.length; t++){

            var data = arrayObject[t].data,
                mesh = arrayObject[t].mesh,
                target = null,
                object = { 
                    mesh : null,
                    data : {},
                    target : {},
                    id : null
                };
                
            var x = 0, y = 0, z = 0;

            var lastObject = helper.getLastValueArray(newArrayObject);

            var count = newArrayObject.length;

            object.id = oldGroup + '_' + oldLayer + '_' + count;

            for(var i = 0; i < mesh.levels.length; i++)
                mesh.levels[i].object.userData.id = object.id;

            x = 0;

            if(!lastObject)
                x = window.TABLE[oldGroup].x;
            else
                x = lastObject.target.show.position.x + window.TILE_DIMENSION.width;

            y = window.helper.getPositionYLayer(oldLayer);

            z = 0;

            var idScreenshots = oldGroup + "_" + oldLayer + "_" + data.name;

            window.screenshotsAndroid.changePositionScreenshots(idScreenshots, x, y);
            
            target = window.helper.fillTarget(x, y, z, 'table');

            object.mesh = mesh;
            object.data = data;
            object.target = target;

            animate(object.mesh, target.show, 1500);

            newArrayObject.push(object);
        }

        return newArrayObject;
    }

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

    function animate(mesh, target, duration, callback){

        var _duration = duration || 2000,
            x = target.position.x,
            y = target.position.y,
            z = target.position.z,
            rx = target.rotation.x,
            ry = target.rotation.y,
            rz = target.rotation.z; 

        _duration = Math.random() * _duration + _duration;

        new TWEEN.Tween(mesh.position)
            .to({x : x, y : y, z : z}, _duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(mesh.rotation)
            .to({x: rx, y: ry, z: rz}, _duration + 500)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function () {
                    if(typeof(callback) === 'function')
                        callback();   
                })
            .start();
    }
    
}