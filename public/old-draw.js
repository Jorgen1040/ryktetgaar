window.onload=function(){
    // TODO: Fix this, use example from stackoverflow
    // https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
    var canvas = document.getElementById("drawCanvas")
    var ctx = canvas.getContext("2d")
    var x = 0
    var y = 0;
    canvas.addEventListener("mousedown", setPosition(e));


    canvas.addEventListener("mousemove", draw(e));


    canvas.addEventListener("mouseup", (e) => {

    });

    canvas.addEventListener("mousenter", setPosition(e));
}

function setPosition(e) {
    x = e.clientX;
    y = e.clientY;
}

function draw(e) {
    ctx.beginPath();
    //ctx.lineWidth = 5;
    //ctx.lineCap = 'round';
    ctx.moveTo(x, y);
    setPosition(e);
    ctx.lineTo(x, y);
    ctx.stroke();
}
