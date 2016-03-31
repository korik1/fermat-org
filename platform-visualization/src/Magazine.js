/**
 * @author Ricardo Delgado
 * Create, modify and read all the necessary elements to create magazines.
 */
function Magazine() {
		
    window.PDFJS.disableWorker = true;

    var MAGAZINE = null,
        SCALE = null,
        WIDTH = window.innerWidth * 0.64,
        HEIGHT = (WIDTH * 0.5) * 1.21,
        DOC = null,
        LOAD = null,
        CONTENT = null;

    var viewMagazine = {

            book : { 
				file : "books/fermat-book-big.pdf",
				coverFront : "images/magazine/book/cover-front.jpg",
				coverFrontInside : "images/magazine/book/cover-front-inside.jpg",
				coverBack : "images/magazine/book/cover-back.jpg",
				coverBackInside : "images/magazine/book/cover-back-inside.jpg",
				scale : ((WIDTH * 0.482) * 0.00154)
				},
            readme : { 
				file : "books/fermat-readme-big.pdf",
				coverFront : "images/magazine/readme/cover-front.png",
				coverFrontInside : "images/magazine/readme/cover-front-inside.png",
				coverBack : "images/magazine/readme/cover-back.png",
				coverBackInside : "images/magazine/readme/cover-back-inside.png",
				scale : ((WIDTH * 0.482) * 0.00155)
				},
            whitepaper : { 
				file : "books/fermat-whitepaper-big.pdf",
				coverFront : "images/magazine/whitepaper/cover-front.jpg",
				coverFrontInside : "images/magazine/whitepaper/cover-front-inside.jpg",
				coverBack : "images/magazine/whitepaper/cover-back.jpg",
				coverBackInside : "images/magazine/whitepaper/cover-back-inside.jpg",
				scale : ((WIDTH * 0.482) * 0.00155)
				}
			};
		
    /**
     * @author Ricardo Delgado
     * Creates and starts all the functions for creating magazine.
     * @param {String} load Name of the magazine to create.
     */
    this.init = function(load){
				
        LOAD = load;

        if(load === 'book'){

            $.ajax({url: 'books/tableContent.html'}).done(function(pageHtml) {
							
                $('#container').append(pageHtml);

                $('#table').hide();

                CONTENT = parseInt($("#table li").size());
            });
        }

        window.PDFJS.getDocument(viewMagazine[load].file).then(function (doc) {

            DOC = doc;

            SCALE = viewMagazine[load].scale;

            addItems();

            addCss();

            configMagazine();

            coverPage(load);
						
            if(load === 'book')
				addTableContent();
						 
            for(var i = 1; i <= DOC.numPages; i++)
				addPage(i); 
						
            pageCompensate();

            backCoverPage(load);

            actionMagazine();

            addCss();

            positionMagazine();

        });

    };
		
    /**
     * @author Ricardo Delgado
     * Encourages and removes the magazine.
     */
    this.remove = function(){

        var flipbook = document.getElementById('flipbook-viewport'),
            positionHide = {x: (Math.random() + 1) * 5000, y: (Math.random() + 1) * 5000};

        animateMagazine(flipbook, positionHide);

        window.helper.hide(flipbook, 1500, false);

        window.Hash.go("").update();

        DOC = null;
		
    };
    
    /**
     * @author Ricardo Delgado
     * Add the special features of the magazine.
     */ 	
    this.actionSpecial = function(){
        
        if(!MAGAZINE.data().zoomIn){

            if(2 < MAGAZINE.turn('page')){ 

                MAGAZINE.turn("page", 2);
                MAGAZINE.turn("previous");
                navigationUrl("");
            }
        }

        zoomHandle(-1);

    };
    
    /**
     * @author Ricardo Delgado
     * Start adding all the settings for the magazine.
     */
    function configMagazine(){

        MAGAZINE.turn({
					
            width : WIDTH,

            height : HEIGHT,

            elevation: 80,

            gradients: true,

            autoCenter: false,

            acceleration: true

        });

    }

    /**
     * @author Ricardo Delgado
     * Creates all the elements (div) needed to magazine.
     */
    function addItems(){

        var page = $('<div />'),
            flipbook = $('<div />', {"class": "flipbook"}).append(page),
            viewport = $('<div />', {"class": "flipbook-viewport", "id": "flipbook-viewport"}).append(flipbook);

        $('#container').append(viewport);

        MAGAZINE = $('.flipbook');

    }

    /**
     * @author Ricardo Delgado
     * It sets the dimensions of the elements.
     */
    function addCss(){

        $('.flipbook').css({
				"width": WIDTH,
				"height": HEIGHT,
				"left": (WIDTH * 0.49) * -1,
				"top": (HEIGHT * 0.40) * -1
				});

        $('.flipbook .hard').css({
				"width": WIDTH * 0.5,
				"height": HEIGHT
				});

        $('.flipbook .own-size').css({
				"width": WIDTH * 0.482,
				"height": HEIGHT - 18
				});

        $('.table-contents li').css({
				"font-size": WIDTH * 0.013,
				"line-height": 1.5,
				"list-style":"none"
				});

        $('.table-contents a').css({
				"padding-right": WIDTH * 0.018
				});

        $('#contents1, #contents2').css({
				"font-size": WIDTH * 0.028
				});
				
		}
		
    /**
     * @author Ricardo Delgado
     * Creates and adds the cover and inside cover of the magazine.
     * @param {String} load Name of the magazine to create.
     */    
    function coverPage(load){
				
        var _class,
            cover,
            backCover;

        _class = "hard";

        cover = $('<div />', { 
					"class": _class,
					"id" : 'p'+ 1,
					"style" : "background-image:url("+viewMagazine[load].coverFront+")"
					});

        MAGAZINE.turn("addPage", cover, 1);

        backCover = $('<div />', { 
						"class": _class,
						"id" : 'p'+ 2,
						"style" : "background-image:url("+viewMagazine[load].coverFrontInside+")"
						});

        MAGAZINE.turn("addPage", backCover, 2);
				
    }
	 
    /**
     * @author Ricardo Delgado
     * Creates and adds the counter-cover and internal cover of the magazine.
     * @param {String} load Name of the magazine to create.
     */  
    function backCoverPage(load){

		var page = MAGAZINE.turn('pages') + 1,
			_class = "hard fixed",
			cover,
			backCover;

		backCover = $('<div />', { 
						"class": _class,
						"id" : 'pn',
						"style" : "background-image:url("+viewMagazine[load].coverBackInside+")"
						});

		MAGAZINE.turn("addPage", backCover, page); 

		page = MAGAZINE.turn('pages') + 1;

		_class = "hard";

		cover = $('<div />', { 
					"class": _class,
					"id" : 'pf',
					"style" : "background-image:url("+viewMagazine[load].coverBack+")"
					});

		MAGAZINE.turn("addPage", cover, page);
	
	}

    /**
     * @author Ricardo Delgado
     * Creates and adds all pages of pdf.
     * @param {Numer} page Number of the page to add.
     */  
    function addPage(page){

        var canvas,
            ctx,
            element,
			_class = "own-size",
            newPage = MAGAZINE.turn('pages') + 1;

        canvas = document.createElement('canvas');
        canvas.width  = WIDTH * 0.482;
        canvas.height = HEIGHT - 18;

        ctx = canvas.getContext("2d");

        renderPage(page, ctx);

        element = $('<div />', { 
                    "class": _class,
                    'id' : 'p'+ newPage
                    }).append(canvas);

        MAGAZINE.turn("addPage", element, newPage);

    }
		
    /**
     * @author Ricardo Delgado
     * Creates and adds an Compensate page magazine.
     */  
    function addPageCompensate(){

        var canvas,
            element,
            _class = "own-size",
            newPage = MAGAZINE.turn('pages') + 1;

        canvas = document.createElement('canvas');
        canvas.width  = WIDTH * 0.482;
        canvas.height = HEIGHT - 18;

        element = $('<div />', { 
				"class": _class,
                'id' : 'p'+ newPage
                }).append(canvas);

        MAGAZINE.turn("addPage", element, newPage);

    }
    
    /**
     * @author Ricardo Delgado
     * Table of contents of the book is added.
     */ 
    function addTableContent(){

        addTable(1);

        if(CONTENT > 24)
            addTable(2);

        $('#table').remove();
		
    }
    
    /**
     * @author Ricardo Delgado
     * The table of contents is added to the book.
     * @param {Numer}  apge Page number reading.
     */ 
    function addTable(page){

        var canvas,
            element,
            div,
            _class = "own-size",
            newPage = MAGAZINE.turn('pages') + 1;

        canvas = document.createElement('canvas');
        canvas.width  = WIDTH * 0.482;
        canvas.height = HEIGHT - 18;
        canvas.style.position = "relative";
        div = document.createElement('div');
        div.width  = WIDTH * 0.482;
        div.height = HEIGHT - 18;
        div.id = "content"+page;
        div.style.position = "absolute";
        div.style.zIndex = 0;
        div.style.top = 0;
        div.style.left = 0;

        element = $('<div />', { 
                        "class": _class,
                        'id' : 'p'+ newPage
                        }).append(canvas);

        element.append(div);

        MAGAZINE.turn("addPage", element, newPage);

        $('#content'+page).append(addContent(page));

    }
    
    /**
     * @author Ricardo Delgado
     * Content is added to the table.
     * @param {Numer}  apge Page number reading.
     */ 
    function addContent(page){

        var i = 1,
            end = 24,
            div = $('<div />', {"class": "table-contents"}),
            title = $('<h1 />', {"id": "contents"+page}).html($('#title').text()),
            ul = $('<ul />');

        if(page === 2){
            i = 25;
            end = 49;
        }

        for(i; i <= end; i++){
            ul.append($('#l-'+i));
        }

        div.append(title);
        div.append(ul);

        return div;

    }
    
    /**
     * @author Ricardo Delgado
     * Page offset is added to the journal.
     */ 
    function pageCompensate(){

        if(LOAD === 'book'){

            if(CONTENT <= 24){

                if(DOC.numPages % 2 === 0)
                    addPageCompensate(); 
            }
            else{

                if(DOC.numPages % 2 !== 0)
                    addPageCompensate();
            }
        }
        else{

            if(DOC.numPages % 2 !== 0)
                addPageCompensate(); 
        }

    }
		
    /**
     * @author Ricardo Delgado
     * Read and add PDF page to canvas.
     * @param {Numer}  num Page number reading.
     * @param {Object} ctx CTX of canvas.
     */  
    function renderPage(num, ctx){

        var viewport,
            renderContext;

        DOC.getPage(num).then(function (page){

            viewport = page.getViewport(SCALE);

            renderContext = {       
                    canvasContext: ctx,
                     viewport: viewport
            };

            page.render(renderContext);

        });

    }
		
    /**
     * @author Ricardo Delgado
     * Add the special features of the magazine.
     */ 
    function actionMagazine(){

        window.Hash.on('^' + LOAD + '/page\/([0-9]*)$', {

            yep: function(path, parts) {

                var factor = 2;

                if(LOAD === 'book'){

                    if(CONTENT > 24)
                        factor = 4;
                    else
                        factor = 3;
                }

                var page = parseInt(parts[1]) + factor;

                if(parts[1] !== undefined) {

                    if(MAGAZINE.turn('is')){

                        if(MAGAZINE.turn("hasPage", page)){ 

                            MAGAZINE.turn('page', page);
                            navigationUrl(parts[1]);
                        }
                    }
                }       
            }
        });
        
        MAGAZINE.bind("turning", function(event, page, view) {

            var magazine = $(this);

            if(page >= 2)
                $('#p2').addClass('fixed');
            else
                $('#p2').removeClass('fixed');

            if(page < magazine.turn('pages'))
                $('#pn').addClass('fixed');
            else
                $('#pn').removeClass('fixed');

            if(page >= 4)
                navigationUrl(page - 4);
            else
                navigationUrl("");
        }); 

        navigationUrl("");

        ConfigZoom();

    }
    
    /**
     * @author Ricardo Delgado
     * The product is controlled by the url.
     * @param {Numer}  num Page number.
     */  		
    function navigationUrl(page){

        if(page === 0)
            page = 1;

        window.Hash.go(LOAD + '/page/' + page).update();

    }
		
    /**
     * @author Ricardo Delgado
     * Believes zoom settings magazine.
     */ 
    function ConfigZoom(){

        var flipbook = document.getElementById("flipbook-viewport");

        if(flipbook.addEventListener) {

            flipbook.addEventListener("mousewheel", MouseWheelHandler, false);
            flipbook.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
        }

        function MouseWheelHandler(e) {

            var _e = window.event || e; 
            var delta = Math.max(-1, Math.min(1, (_e.wheelDelta || -_e.detail)));

            zoomHandle(delta);

            return false;
        }

    }
		
    /**
     * @author Ricardo Delgado
     * Zoom determines the value received.
     */ 
    function zoomHandle(delta) {

        if(MAGAZINE.data().zoomIn){ 
            
            if(delta < 0)
                zoomOut();
        }
        else{
            
            if(delta > 0)
                zoomThis();
        }

    }
		
    /**
     * @author Ricardo Delgado
     * Zooming magazine.
     */ 
    function zoomThis() {

        var element = document.getElementById('flipbook-viewport');
        var positionShow = {x : window.innerWidth * 0.5, y : (window.innerHeight * 0.5) - 60};
        animateMagazine(element, positionShow, 2500);

        MAGAZINE.transform('scale('+1.25+', '+1.25+')');
        MAGAZINE.data().zoomIn = true;
        MAGAZINE.turn('resize');
        MAGAZINE.turn('disable', true);

    }
				
    /**
     * @author Ricardo Delgado
     * Remove the magazine zoom.
     */ 
    function zoomOut() {

        var element = document.getElementById('flipbook-viewport');
        var positionShow = {x : window.innerWidth * 0.5, y : (window.innerHeight * 0.5)};
        animateMagazine(element, positionShow, 2500);

        MAGAZINE.transform('scale('+1+', '+1+')');
        MAGAZINE.data().zoomIn = false;
        MAGAZINE.turn('resize');
        MAGAZINE.turn('disable', false);

    }
		
    /**
     * @author Ricardo Delgado
     * Calculates the position of the magazine for animation.
     */ 
	function positionMagazine(){

        var element = document.getElementById('flipbook-viewport');

        var positionShow = {x : window.innerWidth * 0.5, y : window.innerHeight * 0.5};

        element.style.left = (Math.random() + 1) * 3000 + 'px';
        element.style.top = (Math.random() + 1) * 3000 + 'px';

        setTimeout(function() {
            animateMagazine(element, positionShow);
        }, 1500);
		
    }
		
    /**
     * @author Ricardo Delgado
     * Makes the entry or exit animation magazine.
     * @param {Object} element         elemento.
     * @param {Array}  target          The objetive position.
     * @param {Number} [duration=3000] Duration of the animation.
     */ 
    function animateMagazine(element, target, duration) {

        var _duration = duration || 3000,
            position = {x : element.getBoundingClientRect().left, y : element.getBoundingClientRect().top};

        new TWEEN.Tween(position)
                .to({x : target.x, y : target.y}, _duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onUpdate(update)
                .start();

        function update() {
                element.style.left = position.x + 'px';
                element.style.top = position.y + 'px';
        }

    }

}