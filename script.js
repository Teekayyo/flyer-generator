const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 1350;

const template = new Image();
template.src = "template.png";

const nameInput = document.getElementById("nameInput");
const photoInput = document.getElementById("photoInput");
const zoomSlider = document.getElementById("zoom");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

const FRAME = {
    x: 315,
    y: 250,
    width: 450,
    height: 520
};

const NAME_BOX = {
    x: 160,
    y: 705,
    width: 760,
    height: 80
};

let photo = null;

let state = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    zoom: 1,
    dragging: false,
    lastX: 0,
    lastY: 0
};

template.onload = draw;

photoInput.addEventListener("change", loadPhoto);

nameInput.addEventListener("input", draw);

zoomSlider.addEventListener("input",function(){

if(!photo) return;

const oldZoom=state.zoom;

const newZoom=Number(this.value);

const centreX=state.x+(state.width*oldZoom)/2;

const centreY=state.y+(state.height*oldZoom)/2;

state.zoom=newZoom;

state.x=centreX-(state.width*newZoom)/2;

state.y=centreY-(state.height*newZoom)/2;

draw();

});

resetBtn.addEventListener("click", function () {

    if (!photo) return;

    fitPhoto();

    zoomSlider.value = 1;

    state.zoom = 1;

    draw();

});

downloadBtn.addEventListener("click", downloadFlyer);

function loadPhoto(e){

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(ev){

photo=new Image();

photo.onload=function(){

fitPhoto();

draw();

};

photo.src=ev.target.result;

};

reader.readAsDataURL(file);

}

function fitPhoto(){

const scale=Math.max(

FRAME.width/photo.width,

FRAME.height/photo.height

);

state.width=photo.width*scale;

state.height=photo.height*scale;

state.x=FRAME.x+(FRAME.width-state.width)/2;

state.y=FRAME.y+(FRAME.height-state.height)/2;

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(template,0,0,canvas.width,canvas.height);

if(photo){

ctx.save();

ctx.beginPath();

ctx.rect(

FRAME.x,

FRAME.y,

FRAME.width,

FRAME.height

);

ctx.clip();

ctx.drawImage(

photo,

state.x,

state.y,

state.width*state.zoom,

state.height*state.zoom

);

ctx.restore();

}

drawName();

}

function drawName(){

const text=nameInput.value.trim();
if(text==="") return;

// Calculate smaller dimensions (10% less from each side)
const paddingReduction = 0.10; // 10%
const reducedWidth = NAME_BOX.width * (1 - paddingReduction * 2);
const reducedHeight = NAME_BOX.height * (1 - paddingReduction * 2);
const offsetX = NAME_BOX.width * paddingReduction;
const offsetY = NAME_BOX.height * paddingReduction;

const ovalX = NAME_BOX.x + offsetX;
const ovalY = NAME_BOX.y + offsetY;
const ovalWidth = reducedWidth;
const ovalHeight = reducedHeight;

// Draw oval (ellipse) background
ctx.save();
ctx.beginPath();
ctx.ellipse(
    ovalX + ovalWidth/2,
    ovalY + ovalHeight/2,
    ovalWidth/2,
    ovalHeight/2,
    0,
    0,
    Math.PI * 2
);
ctx.fillStyle = "#000000";
ctx.fill();
ctx.restore();

// Draw text
let size=50;
ctx.font="bold "+size+"px Arial";

while(ctx.measureText(text).width > reducedWidth - 40 && size > 20){
    size--;
    ctx.font="bold "+size+"px Arial";
}

ctx.fillStyle = "#ffffff";
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(
    text,
    ovalX + ovalWidth/2,
    ovalY + ovalHeight/2
);
}

canvas.addEventListener("mousedown",startDrag);

canvas.addEventListener("mousemove",drag);

canvas.addEventListener("mouseup",stopDrag);

canvas.addEventListener("mouseleave",stopDrag);

function startDrag(e){

if(!photo) return;

e.preventDefault();

state.dragging=true;

state.lastX=e.offsetX;

state.lastY=e.offsetY;

}

function drag(e){

if(!state.dragging || !photo) return;

e.preventDefault();

const dx=e.offsetX-state.lastX;
const dy=e.offsetY-state.lastY;

state.x+=dx;
state.y+=dy;

const drawWidth=state.width*state.zoom;
const drawHeight=state.height*state.zoom;

const minX=FRAME.x+FRAME.width-drawWidth;
const maxX=FRAME.x;

const minY=FRAME.y+FRAME.height-drawHeight;
const maxY=FRAME.y;

state.x=Math.max(minX,Math.min(maxX,state.x));
state.y=Math.max(minY,Math.min(maxY,state.y));

state.lastX=e.offsetX;
state.lastY=e.offsetY;

draw();

}

function stopDrag(){

state.dragging=false;

}


canvas.addEventListener("touchstart", touchStart, { passive: false });
canvas.addEventListener("touchmove", touchMove, { passive: false });
canvas.addEventListener("touchend", touchEnd);

function touchStart(e){

if(!photo) return;

e.preventDefault();

state.dragging=true;

const rect=canvas.getBoundingClientRect();

state.lastX=(e.touches[0].clientX-rect.left)*(canvas.width/rect.width);

state.lastY=(e.touches[0].clientY-rect.top)*(canvas.height/rect.height);

}

function touchMove(e){

if(!state.dragging) return;

e.preventDefault();

const rect=canvas.getBoundingClientRect();

const x=(e.touches[0].clientX-rect.left)*(canvas.width/rect.width);

const y=(e.touches[0].clientY-rect.top)*(canvas.height/rect.height);

state.x+=x-state.lastX;
state.y+=y-state.lastY;

const drawWidth=state.width*state.zoom;
const drawHeight=state.height*state.zoom;

// Prevent white gaps in the frame
const minX=FRAME.x+FRAME.width-drawWidth;
const maxX=FRAME.x;
const minY=FRAME.y+FRAME.height-drawHeight;
const maxY=FRAME.y;

state.x=Math.min(maxX,Math.max(minX,state.x));
state.y=Math.min(maxY,Math.max(minY,state.y));

state.lastX=x;
state.lastY=y;

draw();

}

function touchEnd(){

state.dragging=false;

}

function downloadFlyer(){

draw();

const link=document.createElement("a");

link.download="flyer.png";

link.href=canvas.toDataURL("image/png",1);

link.click();

}

window.onload=function(){

draw();

};
