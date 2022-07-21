let xdirs = [1,0,-1,0];
let ydirs = [0,1,0,-1];


let log = function(){
    //console.log(...arguments);
};


let seed = 100;
let rng = PRNG_SEEDFLOAT(seed);


class Spy extends ELEM{
    w = window.innerWidth;
    h = window.innerHeight;
    constructor(){
        super("canvas");
        let that = this;
        let canvas = this.e;
        let {w,h} = this;
        canvas.width = w;
        canvas.height = h;
        this.ctx = canvas.getContext("2d");
        
        let N = 10;
        
        let points = [];
        for(let i = 0; i < N; i++){
            points.push({
                x:rng()*w,
                y:rng()*h,
                direction:Math.floor(rng()*4),
                importance:rng()
            });
        }
        log(points);
        
        this.points = points;
    }
    render(){
        //get the intersections first
        //intersection is the search space
        let {points,w,h,ctx} = this;
        ctx.clearRect(0,0,w,h);
        let vertices = [];
        for(let i = 0; i < points.length; i++){
            let point = points[i];
            for(let j = 0; j < 4; j++){
                if(j === point.direction)continue;
                let v = Object.create(point);
                v.importance = hashNums2(point.importance,j);
                v.direction = j;
                v.segments = [];
                vertices.push(v);
            }
        }
        
        //let hsegs = [];
        //let vsegs = [];
        //add segments leading to the edge
        for(let i = 0; i < vertices.length; i++){
            let v1 = vertices[i];
            let seg = {vh:v1.direction%2};
            v1.segments.push(seg);
            if(v1.direction === 0){
                seg.v1 = v1;
                seg.v2 = {x:w,y:v1.y};
            }else if(v1.direction === 1){
                seg.v1 = v1;
                seg.v2 = {x:v1.x,y:h};
            }else if(v1.direction === 2){
                seg.v1 = {x:0,y:v1.y};
                seg.v2 = v1;
            }else if(v1.direction === 3){
                seg.v1 = {x:v1.x,y:0};
                seg.v2 = v1;
            }
        }
        
        for(let i = 0; i < vertices.length-1; i++){
            for(let j = i+1; j < vertices.length; j++){
                
                let v1 = vertices[i];
                let v2 = vertices[j];
                if(Object.getPrototypeOf(v1) === Object.getPrototypeOf(v2))continue;
                if(v1.direction%2 === v2.direction%2)continue;
                if(v1.direction%2 !== 0){
                    [v1,v2] = [v2,v1];
                }
                let cx = v2.x;
                let cy = v1.y;
                let cross = {
                    x:cx,
                    y:cy
                };
                
                let seg1 = {vh:0};
                let seg2 = {vh:1};
                //seg1 horizontal seg2 vertical
                if(v1.direction === 0){
                    if(v1.x > cx)continue;
                    seg1.v1 = v1;
                    seg1.v2 = cross;
                }else{//v1 === 2
                    if(v1.x < cx)continue;
                    seg1.v1 = cross;
                    seg1.v2 = v1;
                }
                
                if(v2.direction === 1){
                    if(v2.y > cy)continue;
                    seg2.v1 = v2;
                    seg2.v2 = cross;
                }else{//v2 === 3
                    if(v2.y < cy)continue;
                    seg2.v1 = cross;
                    seg2.v2 = v2;
                }
                //if(importance === 0.4807676328908739 && direction){
                //    
                //}
                if(v1.importance < v2.importance){
                    v1.segments.push(seg1);
                }else{
                    v2.segments.push(seg2);
                }
            }
        }
        
        
        vertices.sort((v1,v2)=>v2.importance - v1.importance);
        log(vertices);
        
        let usedSegs = [];
        for(let i = 0; i < vertices.length; i++){
            let v1 = vertices[i];
            //sort from long to short
            v1.segments.sort((s1,s2)=>{
                let l1 = (s1.v2.x-s1.v1.x)+(s1.v2.y-s1.v1.y);
                let l2 = (s2.v2.x-s2.v1.x)+(s2.v2.y-s2.v1.y);
                return l2 - l1;
            });
            let segs = v1.segments;
            log(segs);
            for(let j = 0; j < segs.length; j++){
                let seg1 = segs[j];
                //see if seg1 collides with any other segments
                let passed = true;
                for(let k = 0; k < usedSegs.length; k++){
                    let seg2 = usedSegs[k];
                    if(seg1.vh === seg2.vh)continue;
                    let s1 = seg1;
                    let s2 = seg2;
                    if(s2.vh === 0)[s1,s2] = [s2,s1];
                    //now s1 horizontal s2 vertical
                    let cx = s2.v1.x;
                    let cy = s1.v1.y;
                    if((s1.v1.x < cx && cx < s1.v2.x) && (s2.v1.y < cy && cy < s2.v2.y)){
                        //crossing with other one
                        passed = false;
                        break;
                    }
                }
                if(passed){
                    usedSegs.push(seg1);
                    log(seg1);
                    break;
                }
            }
        }
        
        log(usedSegs);
        
        ctx.strokeStyle = "#000";
        for(let i = 0; i < usedSegs.length; i++){
            let seg = usedSegs[i];
            ctx.beginPath();
            ctx.moveTo(seg.v1.x,seg.v1.y);
            ctx.lineTo(seg.v2.x,seg.v2.y);
            ctx.stroke();
        }
        
        for(let i = 0; i < points.length; i++){
            ctx.fillStyle = "#f00";
            ctx.strokeStyle = "#0f0";
            let point = points[i];
            ctx.beginPath();
            ctx.arc(point.x,point.y,2,0,6.28);
            ctx.closePath();
            ctx.fill();
            for(let j = 0; j < 4; j++){
                if(j === point.direction)continue;
                ctx.beginPath();
                ctx.moveTo(point.x,point.y);
                ctx.lineTo(point.x+4*xdirs[j],point.y+4*ydirs[j]);
                ctx.stroke();
            }
            ctx.fillStyle = "#f00";
            ctx.fillText((point.importance+"").slice(0,5),point.x+10,point.y-10);
        }
    }
};

let Frame = (function(){
    let start = 0;
    let resolver = ()=>{};
    let animate = function(t){
        ret.t = t;
        if(start === 0)start = t;
        let dt = t-start;
        start = t;
        resolver(t,dt);
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    let ret = function(){
        return new Promise((res,rej)=>{
            resolver = res;
        });
    };
    ret.t = 0;
    return ret;
})();


let interpolate = function(r){
    return ((Math.sin((r-0.5)*Math.PI)+1)/2)**2
};


let main = async function(){
    let body = new ELEM(document.body);
    let spy = body.add(new Spy());
    
    while(true){
        //set the transition
        let c0 = spy.points.map(p=>{return {x:p.x,y:p.y}});
        let c1 = spy.points.map(p=>{return {x:spy.w*rng(),y:spy.h*rng()}});
        let t0 = Frame.t;
        let duration = 700;
        while(Frame.t-t0 < duration){
            spy.render();
            let r = (Frame.t-t0)/duration;
            let rr = interpolate(r);
            //console.log(rr,r,Frame.t);
            spy.points.map((p,i)=>{
                p.x = c0[i].x+(c1[i].x-c0[i].x)*rr;
                p.y = c0[i].y+(c1[i].y-c0[i].y)*rr;
            });
            await Frame();
        }
        //break;
    }
};

main();
