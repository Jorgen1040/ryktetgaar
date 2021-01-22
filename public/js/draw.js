window.onload=function(){
    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");
    var drawing = false;

    canvas.height = 500;
    canvas.width = 500;

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
        var posX = e.offsetX;
        var posY = e.offsetY;

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
    const dataURL = canvas.toDataURL();
    fetch('/send', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            //playerID: playerID,
            // word: drawingWord,
            drawing: dataURL
        })
    });
}
