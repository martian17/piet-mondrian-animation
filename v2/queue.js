class Queue = {
    head = null;
    tail = null;
    push(item){
        if(this.tail === null){
            this.tail = [item];
            this.head = this.tail;
        }else{
            var newthis.tail = [];
            this.tail[1] = newTail;
            newTail[0] = item;
            this.tail = newTail;
        }
    };
    insert(item){
        if(this.head === null || !this.head[1]){
            this.push(item);
        }else{
            var next = this.head[1];
            this.head[1] = [item,next];
        }
    }
    pop(){
        if(this.head === null)return false;
        var retval = this.head[0];
        if(this.head[1]){
            this.head = this.head[1];
        }else{
            this.head = null;
            this.tail = null;
        }
        return retval;
    };
    peek(){
        if(this.head === null){
            return false;
        }
        return this.head[0];
    }
    empty(){
        if(this.head === null)return true;
        return false;
    }
};