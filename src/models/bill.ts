import Diner from "./diner";
import BillItem from "./billitem";

export default class Bill {
    protected shared : Diner;
    protected diners: Diner[];
    protected items: BillItem[];

    constructor() {
        this.shared = new Diner( "Shared" );
        this.diners = [];
        this.items = [];
    }

    getDiners() : Diner[]{
        return [this.shared].concat(this.diners);
    }

    getItems() : BillItem[]{
        return [].concat(this.items);
    }

    addDiner(diner: Diner) {
        this.diners.push(diner);
    }

    removeDiner(diner: Diner) {
        if (diner) {
            this.diners = this.diners.filter(item => item.getID() !== diner.getID());
        }
    }

    getItemByID( id : number ){
        for( let item of this.items ){
            if( item.getID() === id ){
                return item;
            }
        }
        return null;
    }

    getDinerByID( id : number ){
        for( let diner of this.diners ){
            if( diner.getID() === id ){
                return diner;
            }
        }
        return null;
    }

    addItem(item: BillItem) {
        this.items.push(item);
    }

    removeItem(item: BillItem) {
        if (item) {
            this.items = this.items.filter(billItem => billItem.getID() !== item.getID());
        }
    }

    calculateDinerAmount( diner : Diner ) : number{
        let dinerItems = this.items.filter(item=> item.owner === diner.getID() );
        let amount = dinerItems.reduce((total, item)=>{
            total += item.price;
            return total;
        }, 0 );
        return amount;
    }

    getBillTotal() : number {
        return this.items.reduce((total, item)=>{
            total += item.price;
            return total;
        }, 0 );
    }
}