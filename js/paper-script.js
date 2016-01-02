(function(window) {

    paper.install(window);

    config = {
        path: undefined // The path we are drawing
    }

    window.onload = function() {
        // Get a reference to the canvas object
        var canvas = document.getElementById('myCanvas');
        // Create an empty project and a view for the canvas:
        paper.setup(canvas);
        // Create a Paper.js Path to draw a line into it:
        config.path = new paper.Path();
       

        paper.view.onFrame = function(event) {
            paper.view.draw();
        }

        createTools();
    }


    function createTools() {
        var pen = new Tool();
        // The mouse has to drag at least 20pt
        // before the next drag event is fired:
        pen.minDistance = 2;

        pen.onMouseDown = function(event) {
            if (config.path) {
                config.path.selected = false;
            };
            config.path = new Path();
            config.path.strokeColor = 'black';
            config.path.fullySelected = true;
        }

        pen.onMouseDrag = function(event) {
            config.path.add(event.point);
        }

        pen.onMouseUp = function(event) {
            config.path.selected = false;
            config.path.smooth();
            config.path.simplify();
            // config.path.selected = true;
        }
    }

    window.Symmetry = {
        // Do something
    }

})(this);











