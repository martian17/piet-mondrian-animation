//max heap
class MaxHeap{
    queue = [[Infinity,null]];
    constructor(){
        
    }
    add(val,p){
        let queue = this.queue;
        let i = queue.length;
        while(true){
            let pi = Math.floor(i/2);
            if(queue[pi][0] < p){
                queue[i] = queue[pi];
                i = pi;
            }else{
                queue[i] = [p,val];
                break;
            }
        }
    }
    pop(){
        let queue = this.queue;
        if(queue.length === 1){
            throw new Error("queue length zero");
        }
        let result = queue[1][1];
        let graft = queue.pop();
        let idx = 1;
        while(true){
            let c1idx = idx*2;
            let c2idx = c1idx+1;
            if(c2idx >= queue.length){
                break;
            }
            let cidx = queue[c1idx][0] > queue[c2idx][0] ? c1idx : c2idx;
            let c = queue[cidx];
            if(c[0] > graft[0]){
                queue[idx] = c;
                idx = cidx;
            }else{
                queue[idx] = graft;
                return result;
            }
        }
        //if no child
        if(idx*2 >= queue.length){
            queue[idx] = graft;
            return result;
        }else if(queue[idx*2][0] <= graft[0]){
            queue[idx] = graft;
            return result;
        }else{//swap
            queue[idx] = queue[idx*2];
            queue[idx*2] = graft;
        }
    }
    get length(){
        return this.queue.length-1;
    }
};