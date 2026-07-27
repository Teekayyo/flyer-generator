const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const template = new Image();
template.src = "template.png";

const nameInput = document.getElementById("nameInput");
const photoInput = document.getElementById("photoInput");
const zoom = document.getElementById("zoom");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

let userImage = null;

let scale = 1;

let photo = {
    x:315,
    y:250,
    w:450,
    h:520
};

let drag=false;

let startX=0;
let startY=0;

template.onload=draw;

photoInput.addEventListener("change",function(e){

const file=e.target.files[0];

if(!file)return;

const reader=new FileReader();

reader.onload=function(ev){

userImage=new Image();

userImage.onload=draw;

userImage.src=ev.target.result;

}

reader.readAsDataURL(file);

});

nameInput.addEventListener("input",draw);

zoom.addEventListener("input",function(){

scale=parseFloat(this.value);

draw();

});

resetBtn.addEventListener("click",function(){

photo.x=315;

photo.y=250;

scale=1;

zoom.value=1;

draw();

});

canvas.addEventListener("mousedown",function(e){

drag=true;

startX=e.offsetX;

startY=e.offsetY;

});

canvas.addEventListener("mouseup",function(){

drag=false;

});

canvas.addEventListener("mouseleave",function(){

drag=false;

});

canvas.addEventListener("mousemove",function(e){

if(!drag)return;

photo.x+=e.offsetX-startX;

photo.y+=e.offsetY-startY;

startX=e.offsetX;

startY=e.offsetY;

draw();

});

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(template,0,0,canvas.width,canvas.height);

ctx.save();

ctx.beginPath();

ctx.rect(315,250,450,520);

ctx.clip();

if(userImage){

const w=450*scale;

const h=520*scale;

ctx.drawImage(userImage,photo.x,photo.y,w,h);

}

ctx.restore();

let name=nameInput.value;

let size=52;

ctx.fillStyle="white";

ctx.textAlign="center";

ctx.textBaseline="middle";

do{

ctx.font="bold "+size+"px Arial";

size--;

}while(ctx.measureText(name).width>650 && size>22);

ctx.fillText(name,540,818);

}

downloadBtn.addEventListener("click",function(){

draw();

const link=document.createElement("a");

link.download="flyer.png";

link.href=canvas.toDataURL("image/png");

link.click();

});
