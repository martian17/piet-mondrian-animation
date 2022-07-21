//first prepare a grid pattern
//then clear the walls


let randRange = function(a,b){
    return a+Math.floor(Math.random()*(b+1-a));
};

let makeArray = function(n){
    let arr = [];
    for(let i = 0; i < n; i++){
        arr.push(0);
    }
    return arr;
};

let width = 500;
let height = 500;

let edges = makeArray(10).map(()=>{
    let priority = Math.random();
    let x = Math.random()*width;
    let y = Math.random()*height;
    let arr = [];
    let direction = randRange(0,3);
    for(let i = 0; i < 4; i++){
        if(i === direction){
            continue;
        }
        arr.push({
            x,y,priority,direction:i
        });
    }
    return arr;
}).reduce((a,b)=>{
    return a.concat(b);
});

let body = new ELEM(document.body);

let canvas = body.add("canvas").e;
canvas.width = width;
canvas.height = height;
let ctx = canvas.getContext("2d");


let drawGrid = function(verts){
    ctx.clearRect(0,0,width,height);
    //make a valid pairs
    let pairs = new MaxHeap();//queue
    for(let i = 0; i < verts.length-1; i++){
        for(let j = i+1; j < verts.length; j++){
            let v1 = verts[i];
            let v2 = verts[j];
            let dx = v2.x-v1.x > 0 ? 1:0;
            let dy = v2.y-v1.y > 0 ? 1:0;
            let quadrant = dx+dy*2;
        }
    }
};

let ts = makeArray(10).map(()=>{
    return {
        priority:Math.random(),
        x:Math.random()*width,
        y:Math.random()*height,
        direction:randRange(0,3)
    }
});

/*
let randRange = function(a,b){
    return a+Math.floor(Math.random()*(b+1-a));
}*/
/*
if(Math.random() > 0.5){
    removeVertical(vert,hor,randRange(1,9),randRange(0,10));
    drawGrid(vert,hor);
}else{
    removeHorizontal(vert,hor,randRange(0,10),randRange(1,9));
    drawGrid(vert,hor);
}
*/

