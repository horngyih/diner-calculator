export class NumberGenerator {
    protected init: number;
    protected inc: number;
    protected max: number;

    protected curr: number;

    constructor(initial: number = 1, increment: number = 1, limit?: number) {
        this.init = initial;
        this.inc = increment;
        this.max = limit;
    }

    public current(): number {
        if (this.curr) {
            return this.curr;
        } else {
            return this.init;
        }
    }

    public next(): number {
        let nextValue = this.current() + this.inc;
        if (nextValue <= this.max) {
            this.curr = nextValue;
        }
        return this.current();
    }

    public hasNext(): boolean {
        return this.current() < this.max;
    }
}
