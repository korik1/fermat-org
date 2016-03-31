/**
 * @class
 * @classdesc The base class that represents a node network
 * @author Miguel Celedon
 */
function BaseNetworkViewer() {
    
    this.nodes = {};
    this.edges = [];
    this.NET_RADIOUS = 1000;
    this.hasFocus = false;
}

BaseNetworkViewer.prototype = {

    /**
     * Loads the node data
     * @author Miguel Celedon
     */
    load : function() {},

    /**
     * Deletes all data loaded to free memory
     * @author Miguel Celedon
     */
    unload : function() {

        for(var node in this.nodes){
            scene.remove(this.nodes[node].sprite);
        }
        this.nodes = {};

        for(var i = 0; i < this.edges.length; i++){
            scene.remove(this.edges[i].line);
        }
        this.edges = [];
        
        window.render();
    },

    /**
     * Redraws everything
     * @author Miguel Celedon
     */
    reset : function() {

        this.show();
    },

    /**
     * Set the camera transition to get closer to the graph
     * @author Miguel Celedon
     */
    configureCamera : function() {},

    /**
     * Sets the camera to target the center of the network
     * @author Miguel Celedon
     */
    setCameraTarget : function() {

        var position = window.camera.getPosition();

        window.camera.setTarget(new THREE.Vector3(position.x, position.y, -this.NET_RADIOUS), 1);
    },

    /**
     * Draws the nodes in the network
     * @author Miguel Celedon
     * @param {Array} networkNodes Array of nodes to draw
     */
    drawNodes : function(networkNodes) {},

    /**
     * Creates a sprite representing a single node
     * @author Miguel Celedon
     * @param   {object}        nodeData      The data of the actual node
     * @param   {THREE.Vector3} startPosition The starting position of the node
     * @returns {Three.Sprite}  The sprite representing the node
     */
    createNode : function(nodeData, startPosition) {
        
        var texture = THREE.ImageUtils.loadTexture(this.PICTURES[nodeData.subType] || this.PICTURES.pc);
        texture.minFilter = THREE.NearestFilter;
        
        var sprite = new THREE.Sprite(new THREE.SpriteMaterial({color : 0xffffff, map : texture}));
        //sprite.renderOrder = 100;
        //sprite.material.blending = THREE.NoBlending;
        
        var id = nodeData.hash.toString();

        sprite.userData = {
            id : id,
            originPosition : startPosition,
            onClick : this.onNodeClick.bind(this)
        };

        sprite.position.copy(viewManager.translateToSection('network', helper.getOutOfScreenPoint(startPosition.z)));

        this.nodes[id] = nodeData;
        this.nodes[id].sprite = sprite;

        return sprite;
    },

    /**
     * Shows the network nodes
     * @author Miguel Celedon
     * @returns {TWEEN.Tween} The first in the animation chain
     */
    showNodes : function() {
        
        var former = null,
            original = null,
            duration = 2000;
        
        var createTween = function(nodeID, self) {
            
            var actual = self.nodes[nodeID].sprite;
            
            var next = new TWEEN.Tween(actual.position)
                        .to({x : actual.userData.originPosition.x,
                             y : actual.userData.originPosition.y,
                             z : actual.userData.originPosition.z},
                            duration);
            
            if(former)
                former.onStart(function() {next.start(); actual.visible = true; });
            else
                original = next;
            
            former = next;
            
        };

        for(var nodeID in this.nodes) {
            
            createTween(nodeID, this);
            
        }
        
        //Send empty tween if there is nothing to do
        return original || new TWEEN.Tween(this).to({}, 1);
    },

    /**
     * Hide all nodes
     * @author Miguel Celedon
     * @param {Array}       [excludedIDs] Array of IDs that will be kept visible
     * @returns {TWEEN.Tween} The first in the animation chain
     */
    hideNodes : function(excludedIDs) {
        
        excludedIDs = (typeof excludedIDs !== "undefined") ? excludedIDs : [];
        
        var former = null,
            original = null,
            duration = 2000;
        
        var createTween = function(nodeID, self) {
            
            if(!excludedIDs.includes(nodeID)) {
                
                var actual = self.nodes[nodeID].sprite;
                var target = helper.getOutOfScreenPoint(actual.position.z, 'network');
                
                var next = new TWEEN.Tween(actual.position)
                            .to({x : target.x,
                                 y : target.y,
                                 z : target.z},
                                duration)
                            .onComplete(function() { actual.visible = false; });
                
                if(former)
                    former.onStart(function() { next.start(); });
                else
                    original = next;
                
                former = next;
            }
        };

        for(var nodeID in this.nodes) {
            
            createTween(nodeID, this);
        
        }
        
        //Send empty tween if there is nothing to do
        return original || new TWEEN.Tween(this).to({}, 1);
    },

    /**
     * Draws all adjacencies between the nodes
     * @author Miguel Celedon
     */
    createEdges : function() {

        for(var nodeID in this.nodes) {

            var origin, dest;
            var node = this.nodes[nodeID];

            origin = node.sprite.userData.originPosition;

            for(var i = 0; i < node.children.length; i++) {

                var actualEdge = node.children[i];

                if(this.nodes.hasOwnProperty(actualEdge.id) && this.edgeExists(nodeID, actualEdge.id) === -1) {

                    dest = this.nodes[actualEdge.id].sprite.userData.originPosition;

                    var lineGeo = new THREE.Geometry();
                    lineGeo.vertices.push(origin, dest);

                    var line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({color : 0x000000, transparent : true, opacity : 0}));

                    scene.add(line);
                    this.edges.push({
                        from : nodeID,
                        to : actualEdge.id,
                        line : line
                    });
                }
            }
        }
    },

    /**
     * Show the edges
     * @author Miguel Celedon
     * @returns {TWEEN.Tween} The first in the animation chain
     */
    showEdges : function() {

        var duration = 2000,
            former = null,
            original = null;
        
        var createTween = function(i, self) {
            
            var actual = self.edges[i].line;
            
            var next = new TWEEN.Tween(actual.material)
            .to({opacity : 1}, duration);
            
            if(former)
                former.onStart(function() { actual.visible = true; next.start(); });
            else
                original = next;
            
            former = next;
            
        };

        for(var i = 0; i < this.edges.length; i++) {
            createTween(i, this);
        }
        
        //Send empty tween if there is nothing to do
        return original || new TWEEN.Tween(this).to({}, 1);
    },

    /**
     * Hides the edges immediately
     * @author Miguel Celedon
     * @param {Array}         [excludedIDs] Array of IDs that will be kept visible
     */
    hideEdges : function(excludedIDs) {

        var duration = 250;
        
        excludedIDs = (typeof excludedIDs !== "undefined") ? excludedIDs : [];
        
        var createTween = function(i, self) {
            
            if(!excludedIDs.includes(i)) {
            
                var actual = self.edges[i].line;

                var next = new TWEEN.Tween(actual.material)
                            .to({opacity : 0}, duration).onComplete(function() {actual.visible = false;}).start();
            }
        };

        for(var i = 0; i < this.edges.length; i++) {
            createTween(i, this);
        }
    },
    
    show : function() {
        this.showNodes()
        .chain(this.showEdges())
        .start();
        window.helper.forceTweenRender(6000);
    },
    
    hide : function(excludedNodes, excludedEdges) {
        
        this.hideEdges(excludedEdges);
        this.hideNodes(excludedNodes).start();
        window.helper.forceTweenRender(6000);
    },

    /**
     * Checks if an edge already exists
     * @author Miguel Celedon
     * @param   {string} from ID of one node
     * @param   {string} to   ID of the other node
     * @returns {number} The index in the edges array, -1 if not found
     */
    edgeExists : function(from, to) {

        for(var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];

            if((edge.from === from && edge.to === to) || (edge.to === from && edge.from === to))
                return i;
        }

        return -1;
    },

    test_load : function() {

        var networkNodes = [];
        var NUM_NODES = 25,
            MAX_CONNECTIONS = 10;
        
        var TYPES = ['pc', 'server', 'phone', 'tablet'];

        for(var i = 0; i < NUM_NODES; i++) {

            var node = {
                id : i,
                edges : [],
                subType : TYPES[Math.floor(Math.random() * 10) % 2]
            };

            var connections = Math.floor(Math.random() * MAX_CONNECTIONS);

            for(var j = 0; j < connections; j++) {

                node.edges.push({
                    id : Math.floor(Math.random() * NUM_NODES)
                });
            }

            networkNodes.push(node);
        }

        return networkNodes;
    },

    /**
     * To be executed when a nodes is clicked
     * @author Miguel Celedon
     * @param {object} clickedNode The clicked node
     */
    onNodeClick : function(clickedNode) {
        
        var goalPosition = new THREE.Vector3(0, -2500, 9000);
        goalPosition.add(clickedNode.position);

        window.camera.move(goalPosition.x, goalPosition.y, goalPosition.z, 2000);

        goalPosition.z -= 9000;
        window.camera.setTarget(goalPosition, 1000);
    },
    
    /**
     * Action to open the details about a node
     * @author Miguel Celedon
     */
    open : function() {},
    
    /**
     * Action to close the details of a node
     * @author Miguel Celedon
     */
    close : function() {},
    
    PICTURES : {
        server : "/images/network/server.png",
        pc : "/images/network/pc.png",
        phone : "/images/network/phone.png",
        actor : "/images/network/actor.png",
        tablet : "/images/network/tablet.png"
    }
};