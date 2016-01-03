(function(window) {

    paper.install(window);

    var global = {
        currentPath: undefined // The path we are drawing
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


    function createTools() {
        var pen = new Tool();
        // The mouse has to drag at least 20pt
        // before the next drag event is fired:
        pen.minDistance = 3;

        pen.onMouseDown = function(event) {
            if (global.currentPath) {
                global.currentPath.selected = false;
            };
            var newPath = new Path();
            newPath.strokeColor = 'black'; // TODO make configurable
            newPath.strokeWidth = 1; // TODO make configurable
            newPath.fullySelected = true; 
            newPath.strokeCap = 'round'; // TODO make configurable
            newPath.strokeJoin = 'round'; // TODO make configurable

            global.currentPath = newPath;
        }

        pen.onMouseDrag = function(event) {
            global.currentPath.add(event.point);
        }

        pen.onMouseUp = function(event) {
            global.currentPath.selected = false;
            
            global.currentPath.simplify();
            // global.currentPath.smooth(); // TODO make configurable



            // global.currentPath.selected = true; // use to debug vertices
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
        }
        
    }

    window.Symmetry = {
        // Do something
    }

})(this);








/*
fromPoint = Point(Center.X + Radius * Math.Cos(StartAngleInRadians), Center.Y + Radius * Math.Sin(StartAngleInRadians))
throughPoint = Point(Center.X + Radius * Math.Cos(StartAngleInRadians + ArcAngle/2), Center.Y + Radius * Math.Sin(StartAngleInRadians + ArcAngle/2))
toPoint = Point(Center.X + Radius * Math.Cos(StartAngleInRadians + ArcAngle), Center.Y + Radius * Math.Sin(StartAngleInRadians + ArcAngle))

*/


