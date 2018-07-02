import BillItem from "./billitem";

export default class BillItemGroup extends BillItem{
    protected billItems : BillItem[];

    constructor( public name : string, items : BillItem[], owner? : number ){
        super( name, 0.00 );
        this.billItems = [].concat(items);
    }

    get price():number{
        return this.billItems.reduce( (total, item)=>{
            total += item.price;
            return total;
        }, 0.00 );
    }

    set price( p : number ){
        //No op
    }

    get items(): BillItem[]{
        return [].concat(this.billItems);
    }

    addItem( item : BillItem ){
        this.billItems.push(item);
    }

    removeItem( item : BillItem ){
        let index : number = this.billItems.indexOf(item);
        if( index >= 0 ){
            this.billItems.splice( index, 1 )
        }
    }
}