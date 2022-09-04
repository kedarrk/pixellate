var canvas= document.getElementById("canvas")
canvas.width=600;
canvas.height=600;
var ctx= canvas.getContext("2d");
var body = document.getElementsByName("Body")
var pixels= new Array();
var color="#000000";
var tool=1;
var scale=10;
var cl = canvas.width/scale;
var ch = canvas.height/scale;


for(var i=0;i<cl;i++){
    pixels[i]=new Array();
    for(var j=0;j<ch;j++){ 
        pixels[i][j]="#b1b5c4"; 
        ctx.fillStyle=pixels[i][j];
        ctx.fillRect(i*scale,j*scale,scale,scale);
    }
}
var canvasState=[];
// hovering over canvas
canvas.addEventListener("mouseover",hovering)
function hovering(){
    console.log("cx")
    canvas.style.cursor ="crosshair"
}
// mouse event
canvas.addEventListener('contextmenu', function (e) { 
    // do something here... 
    e.preventDefault(); 
  }, false);
canvas.addEventListener("mousedown",mouseclick);

function mouseclick(event){
    //event.preventDefault();
    if(event.button != 0){
        return;
    }
    var box=canvas.getBoundingClientRect();
    var x = event.clientX-box.x;
    var y = event.clientY-box.y;
    var temp=[];
    for(var i=0;i<cl;i++){
        temp[i]=[];
        for(j=0;j<ch;j++){
            temp[i][j]=pixels[i][j];
          //  colorCanvasT(i,j,temp);
        }
    }
    canvasState.push(temp);
    if(tool===3){
        fillcolor(x/scale,y/scale);
    }if(tool===4){
        colorDetection(x/scale,y/scale);
    }
    else{
    
    canvas.addEventListener("mousemove",mousemve=(event)=>{
        mouseMove(event,x,y,temp);
    });
    window.addEventListener("mouseup",mouseup);
    colorCanvas(Math.floor(x/scale),Math.floor(y/scale));
    }
}

var temp;
function mouseMove(event,x,y,temp){
    // redraw for rect
    if(tool===2 || tool ===5)
    {for(var i=0;i<cl;i++){
        for(j=0;j<ch;j++){
            colorCanvasT(i,j,temp);
        }
    }}
    var box=canvas.getBoundingClientRect();
    var currx = event.clientX-box.x;
    var curry = event.clientY-box.y;
    
    if(tool===2){
        colorrect(x/scale,y/scale,currx/scale,curry/scale);
    }if(tool === 5){
        colorcircle(x/scale,y/scale,currx/scale,curry/scale)
    }
    else{
        colorCanvas(currx/scale,curry/scale);
    }
}
function mouseup (event){
    
    canvas.removeEventListener("mousemove" ,mousemve);
    window.removeEventListener("mouseup",mouseup)
}
// canvas color
function colorCanvasT(x,y,temp){
   // pixels[x][y]="green";
    ctx.fillStyle=temp[x][y];
    pixels[x][y]=temp[x][y];
  //  console.log(temp[x][y])
    ctx.fillRect(x*scale,y*scale,scale,scale)
}
function colorCanvas(x,y){
    x= Math.floor(x);
    y= Math.floor(y);
    pixels[x][y]=color;
    ctx.fillStyle=pixels[x][y];
   //canvasState.push(pixels);
    ctx.fillRect(x*scale,y*scale,scale,scale)
    //console.log(canvasState)
}
// color rectangle
function colorrect(x,y,currx,curry){
    for(var i=Math.min(x,currx);i<=Math.max(x,currx);i++){
        for(var j=Math.min(y,curry);j<=Math.max(y,curry);j++){
            
            colorCanvas(Math.floor(i),Math.floor(j));
        }
    }
}

// color circle
function colorcircle(x,y,endx,endy){
    x=Math.floor(x);
    y=Math.floor(y);
    endx=Math.floor(endx);
    endy=Math.floor(endy)

    var dis= (Math.sqrt((endx-x)**2 + (endy-y)**2));
    for(var i=Math.max(0,x-Math.floor(dis));i<Math.min(cl,x+Math.floor(dis)+1);i++){
        for(var j=Math.max(0,y-Math.floor(dis));j<Math.min(ch,y+Math.floor(dis)+1);j++){
            var curdis= (Math.sqrt((i-x)**2 + (j-y)**2))
            console.log(curdis)
            if(curdis < dis){
                colorCanvas(i,j);
            }
        }
    }
}
// undo canvas
function undoColor(x,y){
    ctx.fillStyle=pixels[x][y];
   //canvasState.push(pixels);
    ctx.fillRect(x*scale,y*scale,scale,scale)
}

// color fill
var xAxis=[0,0,-1,1];
var yAxis=[-1,1,0,0];
function fillcolor(x,y){
    //console.log(xAxis);
    x=Math.floor(x);
    y=Math.floor(y);
    var currcolor=pixels[x][y]
    if(currcolor===color){
     //   console.log(currcolor, color)
        return
    }
    var vis= new Array();
    
    for(var i=0;i<cl;i++){
        vis[i]=new Array();
        for(var j=0;j<ch;j++){
            vis[i][j]=0;
        }
    }
    var queue=[[x,y]];
    while(queue.length>0){
        var top=queue.shift();
      //  console.log(top[0],top[1]);
        colorCanvas(top[0],top[1]);
        vis[top[0]][top[1]]=1;
        for(var i=0;i<4;i++){
            var tempX=top[0]+xAxis[i];
            var tempY=top[1]+yAxis[i];
            if(tempX>=0 && tempX <cl && tempY >=0 && tempY <ch && vis[tempX][tempY]!=1 && pixels[tempX][tempY]===currcolor){
                vis[tempX][tempY]=1;
                queue.push([tempX,tempY]);
                
            }
        }
    }
}
//line tool
function lineDraw(x,y){
    x=Math.floor(x);
    y=Math.floor(y);
}
// tool selector
var toolactive= document.getElementById("toolAct")


var rect=document.getElementById("rectBtn");
rect.addEventListener("click" , function click(){
onBtnclick(2)
toolactive.innerText='tool:' + "Rect";
});

var fill=document.getElementById("fillBtn");
fill.addEventListener("click", function click(){
    toolactive.innerText='tool:' + "Fill";
    onBtnclick(3);
    
} );

var draw=document.getElementById("drawBtn");
draw.addEventListener("click", function click(){
    toolactive.innerText='tool:' + "Draw";
    onBtnclick(1);
} );

var circle=document.getElementById("circleBtn")
circle.addEventListener("click", function click(){
    toolactive.innerText='tool:' + "Circle";
    onBtnclick(5);
} );

function onBtnclick(btn){
  //  console.log(btn);
    tool=btn;
}

//color picker
var colorPicker= document.getElementById("picker");
colorPicker.addEventListener("change", watchColorPicker, false);

function watchColorPicker(event) {
    color = event.target.value;
  //  console.log(color)
}

// undo button 
var undo= document.getElementById("undoBtn");
undo.addEventListener("click", undoFunction);

function undoFunction(){
    if(canvasState.length<=0){
        return;
    }
    var tempPixels=canvasState.pop();
   // console.log(tempPixels);
    for(var i=0;i<cl;i++){
        for(var j=0;j<ch;j++){
            pixels[i][j]=tempPixels[i][j];
            undoColor(i,j);
        }
    }
   // console.log(pixels);
    
}

//color detector
var colorDetect = document.getElementById("colorDetect");
colorDetect.addEventListener("click", function click(){
    toolactive.innerText='tool:' + "Pick";
    onBtnclick(4);
} );

function colorDetection(x,y){
    x= Math.floor(x);
    y=Math.floor(y);
    color=pixels[x][y];
    colorPicker.value=color;
}



// line draw
// drawLine(0,0,13,49)
// function drawLine(startX,startY,endX,endY){
//     var slope=(endY-startY)/(endX-startX);
//     var currSlope=1000;
//     for(var i=startX+1;i<cl;i++){
//         for(var j=startY+1;j<ch;j++){
//             currSlope=(j-startY)/(i-startX);
//             if(currSlope<slope){
//                 var x=i;
//                 var y=j;
//             }
//         }
//         colorCanvas(x,y);
//     }
// }

var download = document.getElementById("downBtn");
download.addEventListener("click",downloadfn);
function downloadfn(){
    image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
  var link = document.createElement('a');
  link.download = "my-image.png";
  link.href = image;
  link.click();
}

// too active
var activeTool="Draw";
toolactive.innerText='tool:' + `${activeTool}`;