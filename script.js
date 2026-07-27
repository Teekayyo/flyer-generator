const canvas=document.getElementById("canvas");

const ctx=canvas.getContext("2d");

canvas.width=1080;

canvas.height=1350;

const template=new Image();

template.src="template.png";

function generate(){

const name=document.getElementById("name").value;

const file=document.getElementById("photo").files[0];

const reader=new FileReader();

reader.onload=function(e){

const img=new Image();

img.onload=function(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(template,0,0);

ctx.drawImage(img,

315,

250,

450,

520

);

ctx.fillStyle="white";

ctx.font="bold 48px Arial";

ctx.textAlign="center";

ctx.fillText(name,540,820);

};

img.src=e.target.result;

};

reader.readAsDataURL(file);

}

function downloadImage(){

const link=document.createElement("a");

link.download="flyer.png";

link.href=canvas.toDataURL();

link.click();

}
