var canvas= document.getElementById("canvas")
canvas.width=600;
canvas.height=600;
var ctx= canvas.getContext("2d");
var body = document.getElementsByName("Body")
var pixels= new Array();
var color="#000000";
var tool=6;
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
    if(tool===2 || tool ===5 || tool===6)
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
    if(tool===6){
        drawLine(x/scale,y/scale,currx/scale,curry/scale);
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
    for(var i=Math.floor(Math.min(x,currx));i<=Math.floor(Math.max(x,currx));i++){
        for(var j=Math.floor(Math.min(y,curry));j<=Math.floor(Math.max(y,curry));j++){
            
            colorCanvas((i),(j));
            //console.log(i,j);
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
// tool selector
var toolactive= document.getElementById("toolAct")


var rect=document.getElementById("rectBtn");
rect.addEventListener("click" , function click(){
onBtnclick(2)
toolactive.innerHTML="<p>tool: <img src=\"./"+`rect`+".png\" height=\"20\" widht=\"20\" align=\"center\"></p>"
});

var fill=document.getElementById("fillBtn");
fill.addEventListener("click", function click(){
    toolactive.innerHTML="<p>tool: <img src=\"./"+`fill`+".png\" height=\"20\" widht=\"20\" align=\"center\"></p>"
    onBtnclick(3);
    
} );

var draw=document.getElementById("drawBtn");
draw.addEventListener("click", function click(){
    toolactive.innerHTML="<p>tool: <img src=\"./"+`draw`+".png\" height=\"20\" widht=\"20\" align=\"center\"></p>"
    onBtnclick(1);
} );

var circle=document.getElementById("circleBtn")
circle.addEventListener("click", function click(){
    toolactive.innerHTML="<p>tool: <img src=\"./"+`circle`+".png\" height=\"20\" widht=\"20\" align=\"center\"></p>"
    onBtnclick(5);
} );

function onBtnclick(btn){
  //  console.log(btn);
    tool=btn;
   // toolactive.innerHTML="<p>tool: <img src=\"./"+`${tool}`+".png\" height=\"20\" widht=\"20\"></p>"
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
    toolactive.innerHTML="<p>tool: <img src=\"./"+`pick`+".png\" height=\"20\" widht=\"20\" align=\"center\"></p>"
    onBtnclick(4);
} );

function colorDetection(x,y){
    x= Math.floor(x);
    y=Math.floor(y);
    color=pixels[x][y];
    colorPicker.value=color;
}



// line draw
var lineDetect = document.getElementById("lineBtn");
lineDetect.addEventListener("click", function click(){
    toolactive.innerHTML="<p>tool: <img src=\"./"+`line`+".png\" height=\"20\" widht=\"20\" align=\"center\"></p>"
    onBtnclick(6);
} );
//  drawLine(0,0,13,49)
function sign(x){
if(x>0)
    return 1;
else if(x<0)
    return -1;
else
    return 0;
}


function drawLine( x1, y1,  x2,  y2)
{
    var x,y,dx,dy,swap,temp,s1,s2,p,i;
    x2=Math.min(canvas.width/scale,x2);
    y2=Math.min(canvas.height/scale,y2);
    x2=Math.max(0,x2);
    y2=Math.max(0,y2);
    x=x1;
    y=y1;
    dx=Math.abs(x2-x1);
    dy=Math.abs(y2-y1);
    s1=sign(x2-x1);
    s2=sign(y2-y1);
    swap=0;
    colorCanvas(x1,y1);
    if(dy>dx){
        temp=dx;
        dx=dy;
        dy=temp;
        swap=1;
    }
    p=2*dy-dx;
    for(i=0;i<dx;i++){
        colorCanvas(x,y)
        while(p>=0){
        p=p-2*dx;
        if(swap)
            x+=s1;
        else
            y+=s2;
        }
        p=p+2*dy;
        if(swap)
            y+=s2;
        else
            x+=s1;
    }
    colorCanvas(x,y);
}





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
var activeTool="draw";
//toolactive.innerHTML='tool:' + `${activeTool}`;
toolactive.innerHTML="<p>tool: <img src=\"./"+`${activeTool}`+".png\" height=\"20\" widht=\"20\" align=\"center\"></p>"