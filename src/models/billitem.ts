let billItemIDX = 1;

export default class BillItem{
    protected billItemID : number;

    constructor( public description : string, public price : number, public owner?: number ){
        this.billItemID = billItemIDX++;
    }

    getID() : number {
        return this.billItemID;
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