function Session(){

	var isLogin;
	var api_key = "56a10473b27e63185c6970d6";
	var axs_key;
	var usr;

	this.getIsLogin = function(){
		return isLogin;
	};

	this.getUserLogin = function(){
		return usr;
	};

    /**
     * @author Ricardo Delgado
     */
    this.displayLoginButton = function(display) {

        if(window.session.getIsLogin()){

            if(display){

                window.helper.show('logout', 2000);
                window.helper.show('containerLogin', 2000);
            }
            else{

                window.helper.hide('logout', 2000, true);
                window.helper.hide('containerLogin', 2000, true);               
            }
        }
        else{

            if(display)
                window.helper.show('login', 2000);
            else   
                window.helper.hide('login', 2000, true);
        }

    };

    /**
     * @author Ricardo Delgado
     */
    this.useTestData = function(){
        
        
    };

	/**
	 * Login with github and gets the authorization code
	 */
	this.getAuthCode = function(){                                                                        //CLientID: c25e3b3b1eb9aa35c773 - Web
		window.location.href = 'https://github.com/login/oauth/authorize?client_id=d00a7c7d4489139327e4'; //ClientID: f079f2a8fa65313179d5 - localhost
	};

	/**
	 * Ago logout and delete the token
	 */
	this.logout = function() {

		var url_logout = window.helper.getAPIUrl("logout") + "&axs_key=" + axs_key + "&api_key=" + api_key;
		console.log("url: " + url_logout);
		$.ajax({
			url : url_logout,
			type : "GET",
			headers : {
				'Accept' : 'application/json'
			}
		}).success(function(data) {
			console.log("Logout", data);
			if(data !== undefined) {
				if(data === true) {
					isLogin = false;
					$("#login").fadeIn(2000);
					$("#logout").fadeOut(2000);
					usr = undefined;
				}
            }
		});
	};

	/**
	 * Logged to the user and returns the token
	 */
	this.login = function() {
		var url = window.helper.getAPIUrl("login") + "&code=" + code + "&api_key=" + api_key;
		console.log("url: " + url);
		
		$.ajax({
			url : url,
			type : "GET",
			headers : {
				'Accept' : 'application/json'
			}
		}).success(function(tkn) {
			usr = tkn._usr_id;
			axs_key = tkn.axs_key;
			if(usr !== undefined) {
				
				isLogin = true;

                usr.axs_key = axs_key;

				console.log("Logueado Completamente: " + usr.name);

     			$("#login").fadeOut(2000);
     			$("#logout").fadeIn(2000);

     			drawUser(usr);
			} 
            else {
				console.log("Error:", tkn);
                window.alert("Error: Could not login to Github, please inform at https://github.com/Fermat-ORG/fermat-org/issues");
            }
		});
	};

	function drawUser(user){
		var texture;

		texture = createTextureUser(user);
		var meshUserLogin = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(230, 120),
            new THREE.MeshBasicMaterial({ transparent : true, color : 0xFFFFFF}));

		meshUserLogin.material.map = texture;
		meshUserLogin.material.needsUpdate = true;
		meshUserLogin.scale.set(75, 75, 75);
		meshUserLogin.position.y = 28500;
		meshUserLogin.position.x = 50000;
		//scene.add(meshUserLogin);
	}

	function createTextureUser(user){

		var canvas = document.createElement('canvas');
        canvas.width = 183 * 5 ;
        canvas.height = 92 * 5;
        canvas.style.height = '100px';
        canvas.id = "canvasLogin";

        document.getElementById('containerLogin').appendChild(canvas);
        var ctx = canvas.getContext('2d');
        ctx.globalAlpha = 0;
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = 1;

        var texture = new THREE.Texture(canvas);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.LinearFilter;

        var pic = {
            src: user.avatar_url,
            alpha: 0.8
        };
        pic.x = 26.5;
        pic.y = 40;
        pic.w = 84 * 1.9;
        pic.h = 84 * 1.9;

        var nameUser = {
            text: user.name,
            font: 'bold ' + 50 + 'px Arial'
        };
        nameUser.x = 120 * 2;
        nameUser.y = 135;
        nameUser.color = "#000000";

        var data = [pic, nameUser];

        drawPictureUser(data, ctx, texture);

        return texture;
	}

	function drawPictureUser(data, ctx, texture){

		var image = new Image();
        var actual = data.shift();

        if(actual.src && actual.src != 'undefined') {

            image.onload = function() {


                if(actual.alpha)
                    ctx.globalAlpha = actual.alpha;

                ctx.drawImage(image, actual.x, actual.y, actual.w, actual.h);
                if(texture)
                    texture.needsUpdate = true;

                ctx.globalAlpha = 1;

                if(data.length !== 0) {

                    if(data[0].text)
                        drawTextUser(data, ctx, texture);
                    else
                        drawPictureUser(data, ctx, texture);
                }
            };

            image.onerror = function() {
                if(data.length !== 0) {
                    if(data[0].text)
                        drawTextUser(data, ctx, texture);
                    else
                        drawPictureUser(data, ctx, texture);
                }
            };

            image.crossOrigin = "anonymous";
            image.src = actual.src;
        } 
        else {
            if(data.length !== 0) {
                if(data[0].text)
                    drawTextUser(data, ctx, texture);
                else
                    drawPictureUser(data, ctx, texture);
            }
        }
	} 

	function drawTextUser(data, ctx, texture){

		var actual = data.shift();

        if(actual.color)
            ctx.fillStyle = actual.color;

        ctx.font = actual.font;

        if(actual.constraint)
            if(actual.wrap)
                helper.drawText(actual.text, actual.x, actual.y, ctx, actual.constraint, actual.lineHeight);
            else
                ctx.fillText(actual.text, actual.x, actual.y, actual.constraint);
        else
            ctx.fillText(actual.text, actual.x, actual.y);

        if(texture)
            texture.needsUpdate = true;

        ctx.fillStyle = "#FFFFFF";

        if(data.length !== 0){ 

          if(data[0].text)
            drawTextUser(data, ctx, texture); 
          else 
            drawPictureUser(data, ctx, texture);
        }
	}

	var code = window.location.toString().replace(/.+code=/, '');
	if((code.indexOf("/") < 0))
		this.login();
}