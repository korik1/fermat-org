/**
 * Represents a flow of actions related to some tiles
 * @param   {Object}  flow The objects that describes the flow including a set of steps
 */
function FlowManager(){

    // Private Variables
    var headerFlow = [],
        positionHeaderFlow = [],
        actualFlow = null;

    // Public method
    /**
     * @author Emmanuel Colina
     * Set position for each Header Flow
     * @param {Object} header target
     */

    this.createColumHeaderFlow = function(header){

        var countElement = 0, 
            obj, 
            ids = [], 
            position = [], 
            center;

        for(var i = 0; i < headerFlow.length; i++) {
            if(header.name === headerFlow[i].flow.platfrm){
                countElement = countElement + 1;
                ids.push(i);
            }
        }

        center = new THREE.Vector3();
        center.copy(header.position);
        center.y = center.y - 2700;

        if(countElement === 1)
            position.push(center); 
        else if(countElement === 2) {

            center.x = center.x - 500;

            for(var k = 0; k < countElement; k++) {

                obj = new THREE.Vector3();

                obj.x = center.x;
                obj.y = center.y;
            
                position.push(obj);

                center.x = center.x + 1000;
            }
        }
        else if(countElement > 2){

            var mid;

            mid = Math.round(countElement / 2);
            
            for(var x = mid; x > 0; x--) {
                
                center.x = center.x - 1500;
            }

            for(var j = 0; j < countElement; j++){

                obj = new THREE.Vector3();

                obj.x = center.x + 1000;
                obj.y = center.y;

                position.push(obj);

                center.x = center.x + 1500;
            }
        }

        letAloneColumHeaderFlow(ids);
        setPositionColumHeaderFlow(ids, position);
        drawColumHeaderFlow(ids, position);
    };

    /**
    * @author Emmanuel Colina
    * @lastmodifiedBy Ricardo Delgado
    * Delete All the actual view to table
    */
    this.deleteAllWorkFlows = function(){

        var _duration = 2000;

        if(headerFlow){
            for(var i = 0; i < headerFlow.length; i++) {

                headerFlow[i].deleteAll();
                window.helper.hideObject(headerFlow[i].objects[0], false, _duration);
                window.scene.remove(headerFlow[i]);
            }
        }
        
        headerFlow = [];
    };

    this.getActualFlow = function(){

        if(actualFlow) {
            for(var i = 0; i < actualFlow.length; i++) {
                actualFlow[i].deleteAll();
            }
            actualFlow = null;
        }
    };

    this.getAndShowFlows = function(id) {
        
        var element = window.helper.getSpecificTile(id).data;
        
        var button = window.buttonsManager.createButtons('showFlows', 'Loading flows...');
        
        var url = window.helper.getAPIUrl("procs");
        url += '?group=' + (element.platform || element.superLayer) + '&layer=' + element.layer + '&component=' + element.name;
        
        $.ajax({
            url: url,
            method: "GET"
        }).success(
            function(processes) {
                var p = processes,
                    flows = [];
                
                for(var i = 0; i < p.length; i++) {
                    
                    flows.push(new ActionFlow(p[i]));
                }
                
                if(flows.length > 0) {
                    button.innerHTML = 'Show Workflows';
                    button.addEventListener('click', function() {
                        showFlow(flows);
                        window.buttonsManager.removeAllButtons();
                    });
                }
                else
                    window.buttonsManager.deleteButton('showFlows');
            }
        );
    };

    this.showWorkFlow = function() {

        if(window.camera.getFocus() !== null) {

            window.camera.loseFocus();

            window.headers.transformWorkFlow(2000);

            for(var i = 0; i < headerFlow.length ; i++) {

                if(headerFlow[i].action){

                    headerFlow[i].deleteStep();
                    headerFlow[i].action = false;
                    headerFlow[i].showAllFlow();
                }
                else
                    headerFlow[i].showAllFlow();
            }
            
            window.helper.hideBackButton();
        }
    };

    /**
     * @author Emmanuel Colina
     * Get the headers flows
     */
    this.getHeaderFLow = function() {

        var url = window.helper.getAPIUrl("procs");
        
        $.ajax({
            url: url,
            method: "GET"
        }).success(
            function(processes) {
                var p = processes, objectHeaderInWFlowGroup;    
                
                for(var i = 0; i < p.length; i++){
                    headerFlow.push(new ActionFlow(p[i])); 
                }
                objectHeaderInWFlowGroup = window.headers.getPositionHeaderViewInFlow();   
                calculatePositionHeaderFLow(headerFlow, objectHeaderInWFlowGroup);   
            }
        );
    };

    // Private method

    /**
     * @author Emmanuel Colina
     * 
     */
     
    this.onElementClickHeaderFlow = function(id) {

        var duration = 1000;

        if(window.camera.getFocus() == null) {
            
            var camTarget = headerFlow[id].objects[0].clone();
            camTarget.position.y -= 850;

            window.camera.setFocus(camTarget, new THREE.Vector4(0, -850, 2600, 1),duration);

            for(var i = 0; i < headerFlow.length ; i++) {
                if(id !== i)
                    headerFlow[i].letAloneHeaderFlow();
            }

            headers.hidetransformWorkFlow(duration);

            setTimeout(function() {
                for(var i = 0; i < headerFlow[id].flow.steps.length; i++) {
                    headerFlow[id].drawTree(headerFlow[id].flow.steps[i], headerFlow[id].positions.target[0].x + 900 * i, headerFlow[id].positions.target[0].y - 211, 0);
                }
               headerFlow[id].showSteps();
            }, 1000);

            window.helper.showBackButton();
        }
    };

    /**
     * @author Emmanuel Colina
     * Calculate the headers flows
     */
    function calculatePositionHeaderFLow(headerFlow, objectHeaderInWFlowGroup) { 

        var position, indice = 1;
        var find = false;

        for(var i = 0; i < objectHeaderInWFlowGroup.length; i++) {

            for(var j = 0; j < headerFlow.length; j++) {

                if(objectHeaderInWFlowGroup[i].name === headerFlow[j].flow.platfrm){
                    
                    if(find === false){

                        position = new THREE.Vector3();

                        position.x = objectHeaderInWFlowGroup[i].position.x - 1500;

                        position.y = objectHeaderInWFlowGroup[i].position.y - 2500;

                        positionHeaderFlow.push(position);

                        headerFlow[j].draw(position.x, position.y, 0, indice, j);

                        find = true;
                    }
                    else{
                        
                        position = new THREE.Vector3();

                        position.x = objectHeaderInWFlowGroup[i].position.x - 1500;
                        
                        position.y = positionHeaderFlow[positionHeaderFlow.length - 1].y - 500;

                        headerFlow[j].draw(position.x, position.y, 0, indice, j);

                        positionHeaderFlow.push(position);
                    }    
                }
            }
            find = false;     
        }
    }

    //Should draw ONLY one flow at a time
    function showFlow(flows) {
    
        var position = window.camera.getFocus().position;
        var indice = 0;

        window.camera.enable();
        window.camera.move(position.x, position.y, position.z + window.TILE_DIMENSION.width * 5);
        
        setTimeout(function() {
            
            actualFlow = [];
            
            for(var i = 0; i < flows.length; i++) {
                actualFlow.push(flows[i]);
                flows[i].draw(position.x, position.y, 0, indice, i);
                
                //Dummy, set distance between flows
                position.x += window.TILE_DIMENSION.width * 10;
            }
            
        }, 1500);
    }

    /**
     * @author Emmanuel Colina
     * let alone the header flow
     * @param {Object} ids id of header flow
     */
    function letAloneColumHeaderFlow(ids){

        var find = false;

        for(var p = 0; p < headerFlow.length ; p++) {

            for(var q = 0; q < ids.length; q++){
                if(ids[q] === p)
                    find = true;
            }
            if(find === false)
                headerFlow[p].letAloneHeaderFlow();

            find = false;
        }
    }

    /**
     * @author Emmanuel Colina
     * set position to header flow
     * @param {Object} ids id of header flow
     * @param {Object} position of header flow
     */
    function setPositionColumHeaderFlow(ids, position){

        var duration = 3000;

        for(var i = 0, l = ids.length; i < l; i++) {
            new TWEEN.Tween(headerFlow[ids[i]].objects[0].position)
            .to({
                x : position[i].x,
                y : position[i].y,
                z : position[i].z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        }
    }

    /**
     * @author Emmanuel Colina
     * draw header flow
     * @param {Object} ids id of header flow
     * @param {Object} position of header flow
     */
    function drawColumHeaderFlow(ids, position){

        for(var m = 0; m < ids.length; m++) {
            for(var k = 0; k < headerFlow[ids[m]].flow.steps.length; k++) {
                    headerFlow[ids[m]].drawTree(headerFlow[ids[m]].flow.steps[k], position[m].x + 900 * k, position[m].y - 211, 0);
            }

            headerFlow[ids[m]].showSteps();
            headerFlow[ids[m]].action = true;   
        }
    }
}