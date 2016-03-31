// add all image paths to this array
function preLoad(onLoadAll) {
    
    var finished = false;
    
    var progressBar = {
        max : 0,
        loaded : 0
    };
    
    var updateBar = function() {
        
        var percnt = ((progressBar.loaded * 100) / progressBar.max) >> 0;
        $("#progress-bar").width(percnt + '%');
    };
    
    var loadImage = function(img) {
        
        var e = document.createElement('img');

        e.onload = function() {

            progressBar.loaded++;
            updateBar();

            if(progressBar.loaded >= progressBar.max) {
                // once we get here, we are pretty much done, so redirect to the actual page
                if(!finished) {
                    finished = true;
                    helper.hide('progress-bar', 1000, false);
                    onLoadAll();
                }
            }
        };
        
        e.onerror = e.onload;
        
        // this will trigger your browser loading the image (and caching it)
        e.src = img;
        };
    
    //Preload images
    $.ajax({
        url: "./json/images.json",
        success: function(images) {
            'use strict';

            progressBar.max = images.length;

            var i = 0;

            while(i < images.length) {
                loadImage(images[i]);
                i++;
            }
        }
    });
    
    //Preload fonts
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.font = '12px Canaro';
    ctx.fillText('.', 0, 0);
}