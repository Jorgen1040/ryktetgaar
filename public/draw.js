window.onload=function(){
    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");
    var drawing = false;

    canvas.height = 800;
    canvas.width = 800;


    function startDrawing(e){
        drawing = true;
        draw(e);
    }

    function stopDrawing(){
        drawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        var posX = e.clientX - canvas.offsetLeft;
        var posY = e.clientY - canvas.offsetTop;

        ctx.lineTo(posX, posY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(posX, posY);
    }

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseout", stopDrawing);
}

function submitDrawing(){
    const canvas = document.getElementById("drawCanvas");
    fetch('/send', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(canvas.toDataURL())
    });
}
