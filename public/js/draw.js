const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
var drawing = false;
var erase = false;
const eraseButton = document.querySelector("#eraseButton");
const resetButton = document.querySelector("#resetButton");

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
    ctx.lineCap = "round";
    var posX = e.offsetX;
    var posY = e.offsetY;

    ctx.lineTo(posX, posY);
    if (erase) {
        ctx.lineWidth = 15;
        ctx.globalCompositeOperation="destination-out";
    } else {
        ctx.lineWidth = 5;
        ctx.globalCompositeOperation="source-over";
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(posX, posY);
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseout", stopDrawing);

eraseButton.addEventListener("click", () => {
    erase = !erase;
    eraseButton.textContent = erase ? "Tegne" : "Viskelær";
});

resetButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, 500, 500);
});

document.querySelector("#submitButton").addEventListener("click", () => {
    submitDrawing();
});

function submitDrawing(){
    const canvas = document.querySelector("#drawCanvas");
    const dataURL = canvas.toDataURL();
    
}
