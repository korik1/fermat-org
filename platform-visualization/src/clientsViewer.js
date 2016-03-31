function ClientsViewer(parentNode) {
    
    BaseNetworkViewer.call(this);
    
    this.parentNode = parentNode;
    this.childNetwork = null;
    
    //this.parentNode.hide(parentNode.userData.id);
}

ClientsViewer.prototype = Object.create(BaseNetworkViewer.prototype);
ClientsViewer.prototype.constructor = ClientsViewer;

/**
 * @override
 * Executed when a node is clicked, moves the camera and draw its childs
 * @author Miguel Celedon
 * @param {object} clickedNode The clicked node
 */
ClientsViewer.prototype.onNodeClick = function(clickedNode) {
    
    /*Disabled as there is no lower level for now
    if(this.childNetwork === null) {
        
        TWEEN.removeAll();
        
        BaseNetworkViewer.prototype.onNodeClick.call(this, clickedNode);

        this.hide([clickedNode.userData.id], clickedNode.userData.id);
        
        //this.childNetwork = new ClientsViewer(clickedNode);
        this.childNetwork = new ServicesViewer(clickedNode);
        
        this.open();
    }*/
};

ClientsViewer.prototype.open = function() {
    
    this.childNetwork.load();
};

/**
 * Draws the nodes in the network
 * @author Miguel Celedon
 * @param {Array} networkNodes Array of nodes to draw
 */
ClientsViewer.prototype.drawNodes = function(networkNodes) {

    for(var i = 0; i < networkNodes.length; i++) {
        
        var halfRadious = this.NET_RADIOUS / 2;

        var position = new THREE.Vector3(
            Math.random() * this.NET_RADIOUS,
            - (Math.random() * halfRadious + halfRadious),
            Math.random() * this.NET_RADIOUS);
        
        position.add(this.parentNode.position);

        var sprite = this.createNode(networkNodes[i], position);

        sprite.scale.set(1000, 1000, 1.0);

        window.scene.add(sprite);
    }

    this.createEdges();
    
    this.show();
};

ClientsViewer.prototype.test_load = function() {
    
    var networkNodes = [];
    var NUM_NODES = 5;
    var TYPES = ['pc', 'phone', 'tablet'];
    
    for(var i = 0; i < NUM_NODES; i++) {
        
        var node = {
            id : i,
            edges : [{id : this.parentNode.userData.id}],
            subType : TYPES[Math.floor(Math.random() * 10) % 2]
        };
        
        networkNodes.push(node);
    }
    
    return networkNodes;
    
};

ClientsViewer.prototype.createEdges = function() {
    
    for(var nodeID in this.nodes) {
        
        var origin = this.nodes[nodeID].sprite.userData.originPosition;
        var dest = this.parentNode.position;
        
        var lineGeo = new THREE.Geometry();
        lineGeo.vertices.push(origin, dest);

        var line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({color : 0x0000ff, transparent : true, opacity : 0}));

        scene.add(line);
        
        this.edges.push({
            from : nodeID,
            to : this.parentNode.userData.id,
            line : line
        });
    }
    
    //Not needed now
    //BaseNetworkViewer.prototype.createEdges.call(this);
};

/**
 * Hide edges except the one connecting to the parent
 * @author Miguel Celedon
 * @param   {string}      clickedID The ID of the clicked node to except its edge hiding
 * @returns {TWEEN.Tween} The first in the tween chain
 */
ClientsViewer.prototype.hideEdges = function(clickedID) {
    
    var edgeID = this.edgeExists(this.parentNode.userData.id, clickedID);
    
    return BaseNetworkViewer.prototype.hideEdges.call(this, [edgeID]);
    
};

/**
 * Closes and unloads the child, if the child is open, closes it
 * @author Miguel Celedon
 * @returns {object} The reference to itself, if there was no children I'll return null
 */
ClientsViewer.prototype.closeChild = function() {
    
    var self = null;
    
    if(this.childNetwork !== null){
        
        //If the child is closed we need the parent to reset focus
        var parent = this.childNetwork.parentNode;
        
        this.childNetwork = this.childNetwork.closeChild();
        
        self = this;
        
        //If direct child is closed, show its brothers
        if(this.childNetwork === null)
            this.reset();
    }
    else {
        this.close();
        this.unload();
    }
    
    return self;
    
};