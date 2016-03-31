function NetworkViewer() {
    
    BaseNetworkViewer.call(this);
    
    this.childNetwork = null;
}

NetworkViewer.prototype = Object.create(BaseNetworkViewer.prototype);
NetworkViewer.prototype.constructor = NetworkViewer;

/**
 * @override
 * Loads the data and configures camera
 * @author Miguel Celedon
 */
NetworkViewer.prototype.load = function() {
    
    //Ask for nodes
    $.ajax({
        url : window.helper.getAPIUrl("servers"),
        method: "GET",
        context: this
    }).done(function(networkNodes) {
        
        this.NET_RADIOUS = this.NET_RADIOUS * (networkNodes.length - 1);
        this.drawNodes(networkNodes);
        this.configureCamera();
        
    }).fail(function(request, error) {
        
        window.console.log("Error: " + error);
        window.alert("Error, please check the console and inform on github");
    });

};

/**
 * @override
 * Unloads and undraws everything and closes its children
 * @author Miguel Celedon
 */
NetworkViewer.prototype.unload = function() {
    
    if(this.childNetwork)
        this.close();
    
    BaseNetworkViewer.prototype.unload.call(this);
    
};

/**
 * @override
 * To be executed when a nodes is clicked
 * @author Miguel Celedon
 * @param {object} clickedNode The clicked node
 */
NetworkViewer.prototype.onNodeClick = function(clickedNode) {
    
    if(this.childNetwork === null) {
        
        TWEEN.removeAll();
        
        BaseNetworkViewer.prototype.onNodeClick.call(this, clickedNode);

        this.hide([clickedNode.userData.id]);
        
        this.childNetwork = new ClientsViewer(clickedNode);
        
        this.open();
    }
};

/**
 * @override
 * Called when the function needs to show its details
 * @author Miguel Celedon
 */
NetworkViewer.prototype.open = function() {
    
    this.childNetwork.load();
    
};

/**
 * @override
 * Called when needed to hide the details
 * @author Miguel Celedon
 */
NetworkViewer.prototype.close = function() {
    
    if(this.childNetwork !== null) {
        
        this.childNetwork.close();
        this.childNetwork.unload();
        this.childNetwork = null;
    }
};

/**
 * @override
 * Draws the nodes in the network
 * @author Miguel Celedon
 * @param {Array} networkNodes Array of nodes to draw
 */
NetworkViewer.prototype.drawNodes = function(networkNodes) {

    for(var i = 0; i < networkNodes.length; i++) {

        var position = new THREE.Vector3(
            (Math.random() * 2 - 1) * this.NET_RADIOUS,
            (Math.random() * 2 - 1) * this.NET_RADIOUS,
            ((Math.random() * 2 - 1) * this.NET_RADIOUS));
        
        position = window.viewManager.translateToSection('network', position);

        var sprite = this.createNode(networkNodes[i], position);

        sprite.scale.set(1000, 1000, 1.0);

        window.scene.add(sprite);
    }

    this.createEdges();
};

/**
 * @override
 * Set the camera transition to get closer to the graph
 * @author Miguel Celedon
 */
NetworkViewer.prototype.configureCamera = function() {
    
    var self = this;
    var position = window.viewManager.translateToSection('network', new THREE.Vector3(0,0,0));
    setTimeout(function() {
        window.camera.move(position.x, position.y, self.NET_RADIOUS + 10000, 2000);
        
        self.show.call(self);
        
    }, 5000);

    setTimeout(function() {
        self.setCameraTarget();
    }, 7500);
};

/**
 * @override
 * Resets the network and unload its children
 * @author Miguel Celedon
 */
NetworkViewer.prototype.reset = function() {
    
    BaseNetworkViewer.prototype.reset.call(this);
    
    this.close();
};

/**
 * Closes and unloads the child, if the child is open, closes it
 * @author Miguel Celedon
 * @returns {object} The reference to itself, if there was no children I'll return null
 */
NetworkViewer.prototype.closeChild = function() {
    
    var self = null;
    
    if(this.childNetwork !== null) {
        
        //If the child is closed we need the parent to reset focus
        var parent = this.childNetwork.parentNode;
        
        this.childNetwork = this.childNetwork.closeChild();
        self = this;
        
        //If closed, reset focus
        if(this.childNetwork !== null)
            BaseNetworkViewer.prototype.onNodeClick.call(this, parent);
    }
    
    //Finally
    if(this.childNetwork === null)
    {
        this.reset();
        self = null;
    }
    
    return self;
};