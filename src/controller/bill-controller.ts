import Bill from "../models/bill";
import Diner from "../models/diner";
import BillItem from "../models/billitem";

export interface BillController{
    newBill() : Bill;
    closeBill() : Bill;

    addDiner( diner : Diner ) : Diner;
    removeDiner( diner : Diner ) : Diner;
    updateDiner( diner : Diner ) : Diner;
    listDiners() : Diner[];

    getDinerByIndex( idx : number ) : Diner;
    getDinerByID( id : number ) : Diner;
    getDinerByName( name : string ) : Diner;

    addItem( item : BillItem ) : BillItem;
    removeItem( item : BillItem ) : BillItem;
    updateItem( item : BillItem ) : BillItem;
    listItems() : BillItem[];

    getItemByIndex( idx : number ) : BillItem;
    getItemByID( id : number ) : BillItem;
    getItemByOwner( id : number ) : BillItem[];
}

export default class DefaultBillController implements BillController{

    protected bill : Bill;

    constructor( defaultBill?: Bill ){
        if( defaultBill ){
            this.bill = defaultBill;
        }
    }

    newBill() : Bill {
        this.bill = new Bill();
        return this.bill;
    }

    closeBill() : Bill {
        this.requireBill();
        this.bill.finalize();
        return this.bill;
    }

    addDiner( diner : Diner ) : Diner{
        return diner;
    }

    removeDiner( diner : Diner ) : Diner{
        return null;
    }

    updateDiner( diner : Diner ) : Diner{
        return diner;
    }

    listDiners() : Diner[] {
        return [];
    }

    getDinerByIndex( id : number ) : Diner {
        return null;
    }

    getDinerByID( id : number ) : Diner {
        return null;
    }

    getDinerByName( name : string ) : Diner {
        return null;
    }

    addItem( item : BillItem ) : BillItem{
        return null;
    }

    removeItem( item : BillItem ) : BillItem{
        return null;
    }

    updateItem( item : BillItem ) : BillItem{
        return null;
    }

    listItems() : BillItem[]{
        return null;
    }

    getItemByIndex( idx : number ) : BillItem {
        return null;
    }

    getItemByID( id : number ) : BillItem {
        return null;
    }

    getItemByOwner( id : number ) : BillItem[] {
        return null;
    }

    private requireBill() : void{
        if( !this.bill ){
            throw "No bill created";
        }
    }
}