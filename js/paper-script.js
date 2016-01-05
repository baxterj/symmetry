(function(window) {

    paper.install(window);

    var global = {
        currentPath: undefined, // The path we are drawing
        sectors: [], // sector outlines, superficial only
        activePaths: [], // the paths currently being drawn
        layers: [] // paths from every action go into a new layer
    }

    var config = {
        radius: 200,
        numSectors: 8
    }

    window.onload = function() {
        // Get a reference to the canvas object
        var canvas = document.getElementById('myCanvas');
        // Create an empty project and a view for the canvas:
        paper.setup(canvas);       

        paper.view.onFrame = function(event) {
            paper.view.draw();
        }

        createTools();
        createSectors();
    }

    /**
     * Deselect all active paths that exist
     */
    function deselectPaths() {
        for (var i = 0; i < config.numSectors; i++) {
            if (global.activePaths[i]) {
                global.activePaths[i].selected = false;
            }
        }
    }

    function createTools() {
        var pen = new Tool();
        // The mouse has to drag at least minDistance pt
        // before the next drag event is fired:
        pen.minDistance = 2;

        pen.onMouseDown = function(event) {
            deselectPaths();
            global.activePaths = [];

            var layer = new Layer();
            global.layers.push(layer);
            for (var i = 0; i < config.numSectors; i++) {
                var newPath = new Path();
                newPath.strokeColor = 'black'; // TODO make configurable
                newPath.strokeWidth = 1; // TODO make configurable
                newPath.fullySelected = true; 
                newPath.strokeCap = 'round'; // TODO make configurable
                newPath.strokeJoin = 'round'; // TODO make configurable
                global.activePaths.push(newPath);
            }
            deselectPaths();
        }

        // Add a point to all active paths with the required rotation
        pen.onMouseDrag = function(event) {
            var incrementAngle = 360 / config.numSectors;

            for (var i = 0; i < config.numSectors; i++) {
                var newPoint = new Point(event.point);

                var rotationAngle = radiansFromDegrees(incrementAngle * i);
                var newX = paper.view.center.x + ((newPoint.x - paper.view.center.x) * Math.cos(rotationAngle)) - ((newPoint.y - paper.view.center.y) * Math.sin(-rotationAngle));
                var newY = paper.view.center.y + ((newPoint.x - paper.view.center.x) * Math.sin(-rotationAngle)) + ((newPoint.y - paper.view.center.y) * Math.cos(rotationAngle));

                newPoint.x = newX;
                newPoint.y = newY;
                global.activePaths[i].add(newPoint);
            }
        }

        pen.onMouseUp = function(event) {
            for (var i = 0; i < config.numSectors; i++) {
                global.activePaths[i].simplify();
                // global.currentPath.smooth(); // TODO make configurable
                // global.currentPath.selected = true; // use to debug vertices
            }
            deselectPaths();
        }
    }

    function radiansFromDegrees(degrees) {
        return degrees * (Math.PI / 180);
    }

    function createArc(startAngleInDegrees) {
        var startAngleInRadians = radiansFromDegrees(startAngleInDegrees);
        var arcAngleInRadians = radiansFromDegrees(360 / config.numSectors);

        var fromPoint = new Point(
            paper.view.center.x + config.radius * Math.cos(startAngleInRadians),
            paper.view.center.y + config.radius * Math.sin(startAngleInRadians));
        var throughPoint = new Point(
            paper.view.center.x + config.radius * Math.cos(startAngleInRadians + arcAngleInRadians / 2),
            paper.view.center.y + config.radius * Math.sin(startAngleInRadians + arcAngleInRadians / 2));
        var toPoint = new Point(
            paper.view.center.x + config.radius * Math.cos(startAngleInRadians + arcAngleInRadians),
            paper.view.center.y + config.radius * Math.sin(startAngleInRadians + arcAngleInRadians))

        return Path.Arc(fromPoint, throughPoint, toPoint);
    }

    function createSectors() {
        for (var i = 0; i < config.numSectors; i++) {
            var sector = createArc(i * (360 / config.numSectors));

            sector.add(new Point(paper.view.center.x, paper.view.center.y));
            sector.closed = true;

            sector.strokeColor = 'red';
            sector.strokeWidth = 1;
            sector.dashArray = [2, 10];

            global.sectors.push(sector);
        }
    }

    function recreateSectors(number) {
        // Clear up old sectors
        for (var i = 0; i < config.numSectors; i++) {
            global.sectors[i].remove();
        }
        global.sectors = [];
        // Draw new sectors
        config.numSectors = number;
        createSectors();
    }

    window.Symmetry = {
        undo: function() {
            global.layers[global.layers.length - 1].remove();
            global.layers.splice(global.layers.length - 1);
        },

        changeSymmetry: function(number) {
            recreateSectors(number);
        }
    }

})(this);
