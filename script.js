const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 1350;

const template = new Image();
template.src = "template.png";

const photoInput = document.getElementById("photoInput");
const nameInput = document.getElementById("nameInput");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const zoomSlider = document.getElementById("zoom");

let uploadedImage = null;

const FRAME = {
    x:315,
    y:250,
    width:450,
    height:520
};

let photo = {
    x:FRAME.x,
    y:FRAME.y,
    width:FRAME.width,
    height:FRAME.height,
    scale:1
};

let dragging=false;

let dragStart={
    x:0,
    y:0
};

photoInput.addEventListener("change",loadPhoto);

nameInput.addEventListener("input",draw);

zoomSlider.addEventListener("input",function(){

photo.scale=parseFloat(this.value);

draw();

});

resetBtn.addEventListener("click",function(){

photo.x=FRAME.x;

photo.y=FRAME.y;

photo.scale=parseFloat(zoomSlider.value);

zoomSlider.value=1;

draw();

});

downloadBtn.addEventListener("click",downloadFlyer);

canvas.addEventListener("mousedown",startDrag);

canvas.addEventListener("mousemove",dragImage);

canvas.addEventListener("mouseup",stopDrag);

canvas.addEventListener("mouseleave",stopDrag);

canvas.addEventListener("touchstart",touchStart,{passive:false});

canvas.addEventListener("touchmove",touchMove,{passive:false});

canvas.addEventListener("touchend",touchEnd);

template.onload=draw;

function loadPhoto(e){

const file=e.target.files[0];

if(!file)return;

const reader=new FileReader();

reader.onload=function(ev){

uploadedImage=new Image();

uploadedImage.onload=function(){

const ratio=uploadedImage.width/uploadedImage.height;

photo.width=FRAME.width;

photo.height=FRAME.width/ratio;

if(photo.height<FRAME.height){

photo.height=FRAME.height;

photo.width=FRAME.height*ratio;

}

photo.x=FRAME.x+(FRAME.width-photo.width)/2;

photo.y=FRAME.y+(FRAME.height-photo.height)/2;

draw();

};

uploadedImage.src=ev.target.result;

};

reader.readAsDataURL(file);

}

function startDrag(e){

if(!uploadedImage)return;

dragging=true;

dragStart.x=e.offsetX;

dragStart.y=e.offsetY;

}

function dragImage(e){

if(!dragging)return;

const dx=e.offsetX-dragStart.x;

const dy=e.offsetY-dragStart.y;

photo.x+=dx;

photo.y+=dy;

dragStart.x=e.offsetX;

dragStart.y=e.offsetY;

draw();

}

function stopDrag(){

dragging=false;

}

function touchStart(e){

if(!uploadedImage)return;

e.preventDefault();

dragging=true;

const rect=canvas.getBoundingClientRect();

dragStart.x=e.touches[0].clientX-rect.left;

dragStart.y=e.touches[0].clientY-rect.top;

}

function touchMove(e){

if(!dragging)return;

e.preventDefault();

const rect=canvas.getBoundingClientRect();

const x=e.touches[0].clientX-rect.left;

const y=e.touches[0].clientY-rect.top;

photo.x+=x-dragStart.x;

photo.y+=y-dragStart.y;

dragStart.x=x;

dragStart.y=y;

draw();

}

function touchEnd(){

dragging=false;

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(template,0,0,canvas.width,canvas.height);

ctx.save();

ctx.beginPath();

ctx.rect(

FRAME.x,

FRAME.y,

FRAME.width,

FRAME.height

);

ctx.clip();

if(uploadedImage){

ctx.drawImage(

uploadedImage,

photo.x,

photo.y,

photo.width*photo.scale,

photo.height*photo.scale

);

}

ctx.restore();

drawName();

}

function drawName(){

const text=nameInput.value.trim();

if(text==="") return;

let fontSize=54;

ctx.fillStyle="#ffffff";
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.font="bold "+fontSize+"px Arial";

while(ctx.measureText(text).width>640 && fontSize>22){

fontSize--;

ctx.font="bold "+fontSize+"px Arial";

}

ctx.shadowColor="rgba(0,0,0,.35)";
ctx.shadowBlur=8;

ctx.fillText(

text,

540,

817

);

ctx.shadowBlur=0;

}

function downloadFlyer(){

draw();

const link=document.createElement("a");

link.download="30th Anniversary Flyer.png";

link.href=canvas.toDataURL("image/png",1);

link.click();

}

canvas.addEventListener("dblclick",function(){

photo.x=FRAME.x;

photo.y=FRAME.y;

photo.scale=1;

zoomSlider.value=1;

draw();

});

window.addEventListener("resize",draw);

template.onerror=function(){

alert("template.png could not be loaded.");

};

draw();
