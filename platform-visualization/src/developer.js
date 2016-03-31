function Developer (){

	var objectsDeveloper = [];
	var developers = {};
	var self = this;
	var position = {
		target : [],
		lastTarget : []
	};

	var onClick = function(target) {
        if(window.actualView === 'developers')
            onElementClickDeveloper(target.userData.id, objectsDeveloper);
    };

    function onElementClickDeveloper(id, objectsDevelopers){

        var duration = 1000;

        if(camera.getFocus() == null){
            var camTarget = objectsDevelopers[id].clone();

            window.camera.setFocus(camTarget, new THREE.Vector4(0, 0, 1000, 1), duration);

            for(var i = 0; i < objectsDevelopers.length ; i++) {
                if(id !== i)
                    letAloneDeveloper(objectsDevelopers[i]);
            }

            helper.showBackButton();
            setTimeout(function(){
                self.showDeveloperTiles(id);
            }, 1000);
        }
    }

    /**
     * Let Alone Developer
     * @param   {object}     objectsDevelopers all the developers
     * @author Emmanuel Colina
     */

    function letAloneDeveloper(objectsDevelopers){

        var i, _duration = 2000,
            distance = camera.getMaxDistance() * 2,
            out = window.viewManager.translateToSection('developers', new THREE.Vector3(0, 0, distance));

        var target;

        var animate = function(object, target, dur) {

            new TWEEN.Tween(object.position)
                .to({
                    x: 0,
                    y: 0,
                    z: 0
                }, dur)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(function () {
                    object.userData.flying = false;
                })
                .start();
        };

        target = out;
        objectsDevelopers.userData.flying = true;
        animate(objectsDevelopers, target, Math.random() * _duration + _duration);
    }

    /**
     * Draws the developer's picture taken from GitHub
     * @param {Array}  data    Options of the texture
     * @param {Object} ctx     Canvas Context
     * @param {Object} texture Texture to update
     */
    function drawPictureDeveloper(data, ctx, texture) {

        var image = new Image();
        var actual = data.shift();

        if(actual.src && actual.src != 'undefined') {

            image.onload = function () {


                if(actual.alpha)
                    ctx.globalAlpha = actual.alpha;

                ctx.drawImage(image, actual.x, actual.y, actual.w, actual.h);
                if(texture)
                    texture.needsUpdate = true;

                ctx.globalAlpha = 1;

                if(data.length !== 0) {

                    if(data[0].text)
                        drawTextDeveloper(data, ctx, texture);
                    else
                        drawPictureDeveloper(data, ctx, texture);
                }
            };

            image.onerror = function () {
                if(data.length !== 0) {
                    if(data[0].text)
                        drawTextDeveloper(data, ctx, texture);
                    else
                        drawPictureDeveloper(data, ctx, texture);
                }
            };

            image.crossOrigin = "anonymous";
            image.src = actual.src;
        }
        else {
            if(data.length !== 0) {
                if(data[0].text)
                    drawTextDeveloper(data, ctx, texture);
                else
                    drawPictureDeveloper(data, ctx, texture);
            }
        }
    }

    /**
     * Draws a texture in canvas
     * @param {Array}  data    Options of the texture
     * @param {Object} ctx     Canvas Context
     * @param {Object} texture Texture to update
     */
    function drawTextDeveloper(data, ctx, texture) {

        var actual = data.shift();

        if(actual.color)
            ctx.fillStyle = actual.color;

        ctx.font = actual.font;

        if(actual.constraint){
            if(actual.wrap)
                helper.drawText(actual.text, actual.x, actual.y, ctx, actual.constraint, actual.lineHeight);
            else
                ctx.fillText(actual.text, actual.x, actual.y, actual.constraint);
        }
        else
            ctx.fillText(actual.text, actual.x, actual.y);

        if(texture)
            texture.needsUpdate = true;

        ctx.fillStyle = "#FFFFFF";

        if(data.length !== 0){
          if(data[0].text)
            drawTextDeveloper(data, ctx, texture);
          else
            drawPictureDeveloper(data, ctx, texture);
        }
    }

	this.getDeveloper = function(){

		var id = 0;

        for(var i = 0; i < window.tilesQtty.length; i++){

            var tile = window.helper.getSpecificTile(window.tilesQtty[i]).data;

            if(tile.author && developers[tile.author] === undefined)
            {
                developers[tile.author] = {
                    id : id,
                    author : tile.author,
                    picture : tile.picture,
                    authorRealName : tile.authorRealName,
                    authorEmail : tile.authorEmail
                };
                id++;
            }
        }

		self.createDevelopers();
	};

	/**
     * Creates a Texture
     * @param   {Number}     id ID of the developer
     * @param   {object}     developerLink link of the picture developer
     * @param   {object}     developerAuthor nick of the developer
     * @param   {object}     developerAuthorRealName name of the developer
     * @param   {object}     developerAuthorEmail email of the developer
     * @returns {texture} 	 Texture of the developer
     * @author Emmanuel Colina
     */
	this.createTextureDeveloper = function(developer){

		var canvas = document.createElement('canvas');
        canvas.width = 230 * 2;
        canvas.height = 120 * 2;

        var ctx = canvas.getContext('2d');

        ctx.globalAlpha = 0;
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = 1;
        ctx.textAlign = 'left';

        var texture = new THREE.Texture(canvas);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.LinearFilter;

		var pic = {
            src: developer.picture,
            alpha: 0.8
        };
        pic.x = 26.5;
        pic.y = 40;
        pic.w = 84 * 1.9;
        pic.h = 84 * 1.9;

		var background = {
		    src: 'images/developer/background_300.png',
		    x: 0,
		    y: 0,
		    w: 230 * 2,
		    h: 120 * 2
		};

		var ringDeveloper = {

			src: 'images/developer/icon_developer_300.png'
		};
		ringDeveloper.x = 25.5;
        ringDeveloper.y = 33.5;
        ringDeveloper.w = 82.7 * 2.0;
        ringDeveloper.h = 82.7 * 2.0;

        var nameDeveloper = {
            text: developer.authorRealName,
            font: (9 * 2.2) + 'px Roboto Bold'
        };
        nameDeveloper.x = 250;
        nameDeveloper.y = 90;
        nameDeveloper.color = "#FFFFFF";

        var nickDeveloper = {
            text: developer.author,
            font: (5 * 2.2) + 'px Canaro'
        };
        nickDeveloper.x = 250;
        nickDeveloper.y = 176;
        nickDeveloper.color = "#00B498";

        var emailDeveloper = {
            text: developer.authorEmail,
            font: (5 * 1.2) + 'px Roboto Medium'
        };
        emailDeveloper.x = 250;
        emailDeveloper.y = 202;
        emailDeveloper.color = "#E05A52";

		var data = [
            pic,
            background,
            ringDeveloper,
            nameDeveloper,
            nickDeveloper,
            emailDeveloper
		];

        drawPictureDeveloper(data, ctx, texture);

        return texture;
	};

	/**
     * Creates a Developer
     * @author Emmanuel Colina
     */
	this.createDevelopers = function(){

		var mesh, texture, lastTarget;
        var i = 0;

        //Just need the number of developers
		position.target = self.setPositionDeveloper(Object.keys(developers));

		for(var key in developers){

			lastTarget = window.helper.getOutOfScreenPoint(0);
			position.lastTarget.push(lastTarget);

			texture = self.createTextureDeveloper(developers[key]);

			mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(230, 120),
            new THREE.MeshBasicMaterial({ transparent : true, color : 0xFFFFFF}));

            mesh.userData = {
                id: developers[key].id,
                onClick : onClick
            };

            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
        	mesh.position.x = position.lastTarget[i].x;
        	mesh.position.y = position.lastTarget[i].y;
        	mesh.position.z = position.lastTarget[i].z;

        	mesh.name = developers[key].author;
            mesh.scale.set(5, 5, 3);
        	scene.add(mesh);
        	objectsDeveloper.push(mesh);

            i++;
		}
	};

	/**
     * @author Emmanuel Colina
     * Creates a Position
     * @param   {object}        devs  array containing all developers
     */
	this.setPositionDeveloper = function(devs){

		var positionDeveloper = [];
		var position;
	    var indice = 1;

	    var center = new THREE.Vector3(0, 0, 0);
	    center = viewManager.translateToSection('developers', center);

	    if(devs.length === 1)
	        positionDeveloper.push(center);

	    else if(devs.length === 2) {

	        center.x = center.x - 500;

	        for(var k = 0; k < devs.length; k++) {

	            position = new THREE.Vector3();

	            position.x = center.x;
	            position.y = center.y;

	            positionDeveloper.push(position);

	            center.x = center.x + 1000;
	        }

	    }
	    else if(devs.length > 2) {
			var devsSpacingConst = 100;
			var xSpacingConst = devsSpacingConst; // |
			var ySpacingConst = devsSpacingConst; //  \ So far, both are equal. Can't think of a situation where they must be different.
			var scale = 5;

			var n = Math.floor(Math.sqrt(devs.length));
			var ROW_W = 230;
			var ROW_H = 120;

            var initial = center;
            initial.x -= ((n * ROW_W + (xSpacingConst * (n - 1))) / 2.0);
            initial.y -= ((n * ROW_H + (ySpacingConst * (n - 1))) / 2.0);

			for (var i = 0; i < devs.length; i += 1) {
				position = new THREE.Vector3();

				var xSpace = (xSpacingConst * (i % n));
				var ySpace = (ySpacingConst * (Math.floor(i / n)));

				position.x = initial.x + ((i % n) * ROW_W + xSpace) * scale;
				position.y = initial.y + (Math.floor(i / n) * ROW_H + ySpace) * -scale;

				positionDeveloper.push(position);
			}
	    }

	    return positionDeveloper;
	};

	/**
     * Animate Developer
     * @author Emmanuel Colina
     */
	this.animateDeveloper = function(){

		var duration = 750;

		for(var i = 0, l = objectsDeveloper.length; i < l; i++) {
            new TWEEN.Tween(objectsDeveloper[i].position)
            .to({
                x : position.target[i].x,
                y : position.target[i].y,
                z : position.target[i].z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        }
	};

	/**
     * Delete Developer
     * @author Emmanuel Colina
     */
	this.delete = function() {

        var _duration = 2000;

        var moveAndDelete = function(id) {

            var target = position.lastTarget[id];

            new TWEEN.Tween(objectsDeveloper[id].position)
                .to({x : target.x, y : target.y, z : target.z}, 6000)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onComplete(function() { window.scene.remove(objectsDeveloper[id]); })
                .start();
        };

        for(var i = 0, l = objectsDeveloper.length; i < l; i++) {
            moveAndDelete(i);
            helper.hideObject(objectsDeveloper[i], false, _duration);
        }
        objectsDeveloper = [];
        developers = {};
		position = {
			target : [],
			lastTarget : []
		};
    };

    this.showDeveloperTiles = function(id){

        var section = 0;
        var center = objectsDeveloper[id].position;

        for(var i = 0; i < window.tilesQtty.length; i++){

            var tile = window.helper.getSpecificTile(window.tilesQtty[i]).data;

            var mesh = window.helper.getSpecificTile(window.tilesQtty[i]).mesh;

            if(tile.author === objectsDeveloper[id].name && !isNaN(mesh.position.y)){

                new TWEEN.Tween(mesh.position)
                .to({
                    x : (center.x + (section % 5) * window.TILE_DIMENSION.width) - 450,
                    y : (center.y - Math.floor(section / 5) * window.TILE_DIMENSION.height) - 440,
                    z : 0
                }, 2000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

                section += 1;
            }
        }
    };

    /**
     * @author Isaías Taborda
     * Finds a developer's tile.
     * @param   {String}  name   Component author nickname.
     * @returns {mesh}    dev    Developer's mesh.
     */
    this.findDeveloper = function(name){
        var dev;
        for(var i = 0, l = objectsDeveloper.length; i < l; i++) {

            if(name === objectsDeveloper[i].name)
                dev = objectsDeveloper[i];

        }
        return dev;
    };
}
