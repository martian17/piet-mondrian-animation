//first prepare a grid pattern
//then clear the walls


let makeArray = function(n){
    let arr = [];
    for(let i = 0; i < n; i++){
        arr.push(0);
    }
    return arr;
}

let body = new ELEM(document.body);

//make a partition thing
let makeGrid = function(w,h){//width, height in cells
    let vert = makeArray(h).map(()=>makeArray(w+1).map(()=>1));
    let hori = makeArray(h+1).map(()=>makeArray(w).map(()=>1));
    //console.log(vert,hori);
    return [vert,hori];
};

let [vert,hor] = makeGrid(10,10);

let canvas = body.add("canvas").e;
let width = 500;
let height = 500;
let r = 50;
canvas.width = width;
canvas.height = height;
let ctx = canvas.getContext("2d");

let drawGrid = function(v,h){
    ctx.clearRect(0,0,width,height);
    //drawing vertical lines
    for(let i = 0; i < v.length; i++){
        let row = v[i];
        for(let j = 0; j < row.length; j++){
            if(!row[j]){
                continue;
            }
            ctx.beginPath();
            ctx.moveTo(j*r,i*r);
            ctx.lineTo(j*r,(i+1)*r);
            ctx.stroke();
        }
    }
    //drawing horizontal lines
    for(let i = 0; i < h.length; i++){
        let row = h[i];
        for(let j = 0; j < row.length; j++){
            if(!row[j]){
                continue;
            }
            ctx.beginPath();
            ctx.moveTo(j*r,i*r);
            ctx.lineTo((j+1)*r,i*r);
            ctx.stroke();
        }
    }
};

let removeVertical = function(v,h,x,y){
    //range
    if(x < 0 || x >= v[0].length || y < 0 || y >= v.length)return;
    if(v[y][x] === 0)return;
    v[y][x] = 0;
    if(!(h[y][x-1] && h[y][x])){
        //remove the upper part
        removeVertical(v,h,x,y-1);
        removeHorizontal(v,h,x-1,y);
        removeHorizontal(v,h,x,y);
    }
    if(!(h[y+1][x-1] && h[y+1][x])){
        //do the lower part
        removeVertical(v,h,x,y+1);
        removeHorizontal(v,h,x-1,y+1);
        removeHorizontal(v,h,x,y+1);
    }
};

let removeHorizontal = function(v,h,x,y){
    //range
    if(x < 0 || x >= h[0].length || y < 0 || y >= h.length)return;
    if(h[y][x] === 0)return;
    h[y][x] = 0;
    if(!(v[y-1][x] && v[y][x])){
        //remove the left part
        removeHorizontal(v,h,x-1,y);
        removeVertical(v,h,x,y-1);
        removeVertical(v,h,x,y);
    }
    if(!(v[y-1][x+1] && v[y][x+1])){
        //do the right part
        removeHorizontal(v,h,x+1,y);
        removeVertical(v,h,x+1,y-1);
        removeVertical(v,h,x+1,y);
    }
};



drawGrid(vert,hor);

let randRange = function(a,b){
    return a+Math.floor(Math.random()*(b+1-a));
}

for(let i = 0; i < 30; i++){
if(Math.random() > 0.5){
    removeVertical(vert,hor,randRange(1,9),randRange(0,10));
}else{
    removeHorizontal(vert,hor,randRange(0,10),randRange(1,9));
}
}
drawGrid(vert,hor);
/*
if(Math.random() > 0.5){
    removeVertical(vert,hor,randRange(1,9),randRange(0,10));
    drawGrid(vert,hor);
}else{
    removeHorizontal(vert,hor,randRange(0,10),randRange(1,9));
    drawGrid(vert,hor);
}
*/

