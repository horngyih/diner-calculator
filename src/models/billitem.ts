let billItemIDX = 1;

export default class BillItem{
    protected billItemID : number;
    protected billPrice : number;

    constructor( public description : string, price : number, public owner?: number ){
        this.billItemID = billItemIDX++;
        this.billPrice = price;
    }

    getID() : number {
        return this.billItemID;
    }

    get price() : number {
        return this.billPrice;
    }

    set price( p : number ) {
        this.billPrice = p;
    }

    static clone( billItem : BillItem ){
        if(billItem){
            let result = new BillItem(billItem.description, billItem.price, billItem.owner);
            result.billItemID = billItem.getID();            
            return result;
        } else {
            return null;
        }
    }
}