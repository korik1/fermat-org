/**
 * @author Ricardo Delgado
 */
function ButtonsManager() {

    this.objects = {
        left : { 
            buttons : []
        },
        right : {
            buttons : []
        }
    };

    var self = this;

    /**
     * @author Ricardo Delgado
     * All the buttons and their functions are added.
     * @param {String} id  Tile ID.
     */
    this.actionButtons = function(id, callback){

        self.removeAllButtons();

        if(window.helper.getSpecificTile(id).data.author) {

            self.createButtons('developerButton', 'View developer', function(){

                self.removeAllButtons();
                
                if(typeof(callback) === 'function')
                    callback();

            });
        }

        window.screenshotsAndroid.showButtonScreenshot(id);

        window.tableEdit.addButton(id);
    };

    /**
     * @author Ricardo Delgado
     * creation of button and its function is added.
     * @param {String}  id  Button ID.
     * @param {String} text  Button text.
     * @param {Function} callback Function to call when finished.    
     */
    this.createButtons = function(id, text, callback, _x, _type, _side){

        if(!document.getElementById(id)){ 

            var object = {
                id : id,
                text : text
              };

            var x = _x || 5,
                type = _type || 'button',
                side = _side || 'left',
                idSucesor = "backButton";

            if(side === 'right')
                idSucesor = '';

            if(self.objects[side].buttons.length !== 0)
                idSucesor = helper.getLastValueArray(self.objects[side].buttons).id;



            var button = document.createElement(type),
                sucesorButton = document.getElementById(idSucesor);
                      
            button.id = id;
            button.className = 'actionButton';
            button.style.position = 'absolute';
            button.innerHTML = text;
            button.style.top = '10px';
            button.style[side] = calculatePosition(sucesorButton, side, x);
            button.style.zIndex = 10;
            button.style.opacity = 0;

            button.addEventListener('click', function() {

                    if(typeof(callback) === 'function')
                        callback(); 

                });

            document.body.appendChild(button);

            self.objects[side].buttons.push(object);

            window.helper.show(button, 1000);

            return button;
        }
    };

    /**
     * @author Ricardo Delgado
     * Eliminates the desired button.
     * @param {String}  id  Button ID.
     * @param {Function} callback Function to call when finished.    
     */
    this.deleteButton = function(id, _side, callback){

        var side = _side || 'left';

        for(var i = 0; i < self.objects[side].buttons.length; i++){

            if(self.objects[side].buttons[i].id === id){
                self.objects[side].buttons.splice(i,1);
                window.helper.hide($('#'+id), 1000, callback);
                
            }
        }
    };

    /**
     * @author Ricardo Delgado
     * Removes all created buttons. 
     */
    this.removeAllButtons = function(){

        if(self.objects.left.buttons.length !== 0 || self.objects.right.buttons.length !== 0){

            var side = 'left';

            if(self.objects[side].buttons.length === 0)
                side = 'right';

            var actualButton = self.objects[side].buttons.shift();

            if($('#'+actualButton.id) != null) 
                window.helper.hide($('#'+actualButton.id), 1000); 
            
                self.removeAllButtons();
        }
        else
            window.fieldsEdit.removeAllFields();
    };

    function calculatePosition(sucesorButton, side, x){

        if(side === 'left')
            return ((sucesorButton.offsetLeft + sucesorButton.clientWidth + x) + 'px');
        else {
            if(!sucesorButton)
                return (x + 'px'); 
            else
                return ((window.innerWidth - sucesorButton.offsetLeft + x) + 'px');
        }
    
    }

}