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
        createSectors();
    }


    function createTools() {
        var pen = new Tool();
        // The mouse has to drag at least 20pt
        // before the next drag event is fired:
        pen.minDistance = 3;

        pen.onMouseDown = function(event) {
            if (config.path) {
                config.path.selected = false;
            };
            var newPath = new Path();
            newPath.strokeColor = 'black'; // TODO make configurable
            newPath.strokeWidth = 10; // TODO make configurable
            newPath.fullySelected = true; 
            newPath.strokeCap = 'round'; // TODO make configurable
            newPath.strokeJoin = 'round'; // TODO make configurable

            config.path = newPath;
        }

        pen.onMouseDrag = function(event) {
            config.path.add(event.point);
        }

        pen.onMouseUp = function(event) {
            config.path.selected = false;
            
            config.path.simplify();
            // config.path.smooth(); // TODO make configurable



            // config.path.selected = true;
        }
    }

    function createSectors() {
        var start = new Point(paper.view.center.x, paper.view.center.y-130);
        var through = new Point(paper.view.center.x-90, paper.view.center.y-94);
        var to = new Point(paper.view.center.x-113, paper.view.center.y-64);
        var sector = Path.Arc(start, through, to);

        sector.add(new Point(paper.view.center.x, paper.view.center.y));
        sector.closed = true;

        sector.strokeColor = 'red';
        sector.strokeWidth = 1;
    }

    window.Symmetry = {
        // Do something
    }

})(this);











