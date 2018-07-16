import Bill from "../models/bill";
import Diner from "../models/diner";
import BillItem from "../models/billitem";
import ItemAdjustment from "../models/item-adjustment";

export interface BillController {
    newBill(): Bill;
    closeBill(): Bill;

    addDiner(diner: Diner): Diner;
    removeDiner(diner: Diner): Diner;
    updateDiner(diner: Diner): Diner;
    listDiners(): Diner[];

    getDinerByIndex(idx: number): Diner;
    getDinerByID(id: number): Diner;
    getDinerByName(name: string): Diner;

    addItem(item: BillItem): BillItem;
    removeItem(item: BillItem): BillItem;
    updateItem(item: BillItem): BillItem;
    listItems(): BillItem[];

    getItemByIndex(idx: number): BillItem;
    getItemByID(id: number): BillItem;
    getItemByOwner(id: number): BillItem[];
}

export class DefaultBillController implements BillController {

    protected bill: Bill;

    constructor(defaultBill?: Bill) {
        if (defaultBill) {
            this.bill = defaultBill;
        }
    }

    newBill(): Bill {
        this.bill = new Bill();
        return this.bill;
    }

    closeBill(): Bill {
        this.requireBill();
        this.bill.finalize();
        return this.bill;
    }

    addDiner(diner: Diner): Diner {
        this.requireBill();
        if (diner) {
            let existing = this.getDinerByName(diner.name) || this.getDinerByID(diner.getID());
            if (!existing) {
                this.bill.addDiner(diner);
            } else {
                throw "Diner already added to the bill";
            }
        }
        return diner;
    }

    removeDiner(diner: Diner): Diner {
        this.requireBill();
        if (diner) {
            this.bill.removeDiner(diner);
        }
        return diner;
    }

    updateDiner(diner: Diner): Diner {
        this.requireBill();
        if (diner) {
            this.bill.removeDiner(diner);
            this.bill.addDiner(diner);
        }
        return diner;
    }

    listDiners(): Diner[] {
        this.requireBill();
        return this.bill.getDiners();
    }

    getDinerByIndex(id: number): Diner {
        this.requireBill();
        return this.bill.getDiners()[id];
    }

    getDinerByID(id: number): Diner {
        this.requireBill();
        let diners = this.bill.getDiners();
        let idx = diners.findIndex(diner => diner.getID() === id);
        if (idx >= 0 ){
            return diners[idx];
        } else {
            return null;
        }
    }

    getDinerByName(name: string): Diner {
        this.requireBill();
        let diners = this.bill.getDiners();
        let idx = diners.findIndex(diner=>diner.name === name);
        if( idx >= 0 ){
            return diners[idx];
        } else {
            return null;
        }
    }

    addItem(item: BillItem): BillItem {
        this.requireBill();
        this.bill.addItem( item );
        return item;
    }

    removeItem(item: BillItem): BillItem {
        this.requireBill();
        this.bill.removeItem(item);
        return item;
    }

    updateItem(item: BillItem): BillItem {
        this.requireBill();
        if( item ){
            this.bill.removeItem( item );
            this.bill.addItem(item);
        }
        return item;
    }

    listItems(): BillItem[] {
        this.requireBill();
        return this.bill.getItems();
    }

    getItemByIndex(idx: number): BillItem {
        this.requireBill();
        return this.bill.getItems()[idx];
    }

    getItemByID(id: number): BillItem {
        this.requireBill();
        let items = this.bill.getItems();
        let idx = items.findIndex(item=>item.getID()===id);
        if( idx >= 0 ){
            return items[idx];
        } else {
            return null;
        }
    }

    getItemByOwner(id: number): BillItem[] {
        this.requireBill();
        return this.bill.getItems().filter(item=>item.getID()===id);
    }

    private requireBill(): void {
        if (!this.bill) {
            throw "No bill created";
        }
    }
}