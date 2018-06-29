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

    getShared() : Diner{
        return this.shared;
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
        let result = this.items.filter(item=>item.getID()===id);
        return (result.length===1)?result[0]:null;
    }

    getDinerByID( id : number ){
        let result = this.diners.filter(diner=>diner.getID()===id);
        return ( result.length===1)?result[0]:null;
    }

    addItem(item: BillItem) {
        this.items.push(item);
        if( item.owner == null ){
            this.assignOwner( item.getID(), this.shared.getID() );
        }
    }

    removeItem(item: BillItem) {
        if (item) {
            this.items = this.items.filter(billItem => billItem.getID() !== item.getID());
        }
    }

    assignOwner( itemID : number, dinerID : number ) : BillItem{
        let item = this.getItemByID(itemID);
        let diner = (this.shared.getID() === dinerID )? this.shared : this.getDinerByID(dinerID);
        if( item && diner ){
            let previousOwnerID = item.owner;
            item.owner = diner.getID();
            if( previousOwnerID != null ){
                let previousOwner =(this.shared.getID() === previousOwnerID )? this.shared : this.getDinerByID(previousOwnerID);
                if( previousOwner ){
                    previousOwner.amount = this.calculateDinerAmount(previousOwner);
                }
            }
            diner.amount = this.calculateDinerAmount(diner);
        }
        return item;
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

    getSharedAmountPerDiner() : number {
        let sharedAmount = this.calculateDinerAmount(this.shared);
        if( this.diners.length > 0 ){
            let distributedAmount = sharedAmount /this.diners.length;
            return distributedAmount;
        } else {
            return sharedAmount;
        }
    }

    finalize() : Diner[]{
        let result = [];
        let distributedAmount = this.getSharedAmountPerDiner();
        result = this.diners
        .map(diner=>Diner.clone(diner))
        .map(diner=>{ 
            diner.amount = this.calculateDinerAmount(diner) + distributedAmount;
            return diner;
        });

        let finalAmount = result.reduce((total,diner)=>{
            total+=diner.amount;
            return total;
        }, 0);

        if( Math.abs( finalAmount - this.getBillTotal() ) > 0.01 ){
            console.log( "Warning : final amount may not tally" );
        }

        return result;
    }
}