var path;

// The mouse has to drag at least 20pt
// before the next drag event is fired:
tool.minDistance = 20;

function onMouseDown(event) {
    if (path) {
        path.selected = false;
    };
    path = new Path();
    path.strokeColor = 'black';
    path.fullySelected = true;
}

function onMouseDrag(event) {
    path.add(event.point);
}

function onMouseUp(event) {
    path.selected = false;
    path.smooth();
}