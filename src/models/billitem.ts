let billItemIDX = 1;

export default class BillItem{
    protected billItemID : number;

    constructor( public description : string, public price : number, public owner?: number ){
        this.billItemID = billItemIDX++;
    }

    getID() : number {
        return this.billItemID;
    }
}