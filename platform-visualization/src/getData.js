//var URL = "get_plugins.php";
//var URL = "http://52.11.156.16:3000/repo/comps";

function getData() {
    animate();
    
    var url = window.helper.getAPIUrl("comps");
    
    //url += "?env=development"; //When needed the development branch, for lab.fermat.org

    window.helper.getCompsUser(function (list){ 

        window.loadMap(function() {

            window.tileManager.JsonTile(function() {

                window.preLoad(function() {

                    window.tileManager.fillTable(list);
                    TWEEN.removeAll();
                    window.logo.stopFade();
                    window.helper.hide('welcome', 1000, true);
                    init();

                });
            });
        });
    });

 
//Use when you don't want to connect to server
/*setTimeout(function(){
        var l = JSON.parse(testData);
        
        window.preLoad(function() {
            
            window.tileManager.JsonTile(function() {
    
                window.loadMap(function() {
                    tileManager.fillTable(l);

                    TWEEN.removeAll();
                    logo.stopFade();
                    init();
                });
            })
        });

    }, 6000);*/
}