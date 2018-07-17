import Diner from "../models/diner";
import BillItem from "../models/billitem";
import { BillController, DefaultBillController } from "../controller/bill-controller";
import Bill from "../models/bill";

export default class BillControllerAdapter {
    protected controller: BillController;

    constructor() {
        this.controller = new DefaultBillController();
    }

    newBill(): string {
        let bill = this.controller.newBill();
        return this.printBill(bill);
    }

    closeBill(): string {
        let bill = this.controller.closeBill();
        return this.printBill(bill);
    }

    addDiner(params: string[]): string {
        if (params && params.length > 0) {
            let dinerName = params[0];
            let existing = this.controller.getDinerByName(dinerName);
            if (!existing) {
                let newDiner = new Diner(dinerName);
                this.controller.addDiner(newDiner);
                return 'Diner added \n' + this.listDiners();
            } else {
                return `Diner ${dinerName} already exists \n`;
            }

        }
        return 'No diner details provided';
    }

    removeDiner(params: string[]): string {
        if( params && params.length > 0 ){
           // TODO: Continue implementation 
        }
        return 'No diner specified';
    }

    updateDiner(params: string[]): string {
        return null;
    }

    listDiners(): string {
        try {
            let diners = this.controller.listDiners();
            let response = "Current Diners : \n";
            diners.forEach((diner, i) => { response += `${i} : ${diner.name} \n` });
            return response;

        } catch (error) {
            return error;
        }
    }

    getDinerByIndex(params: string[]): string {
        return null;
    }

    getDinerByID(params: string[]): string {
        return null;
    }

    getDinerByName(params: string[]): string {
        return null;
    }

    getDinerName(id: number): string {
        try {
            let diner = this.controller.getDinerByID(id);
            return diner ? diner.name : '';
        } catch (error) {
            return error;
        }
    }

    addItem(params: string[]): string {
        return null;
    }

    removeItem(params: string[]): string {
        return null;
    }

    updateItem(params: string[]): string {
        return null;
    }

    listItems(): string {
        try {
            let items = this.controller.listItems();
            let response = "Current Items : ";
            items.forEach((item, i) => {
                response += `${i}: ${item.description} - ${item.price} - ${this.getDinerName(item.owner)} \n`
            });
        } catch (error) {
            return error;
        }
    }

    getItemByIndex(params: string[]): string {
        return null;
    }

    getItemByID(params: string[]): string {
        return null;
    }

    getItemByOwner(params: string[]): BillItem[] {
        return null;
    }

    printBill(bill: Bill): string {
        try {
            let response = "Current Bill\n";
            response += this.listDiners();
            response += "\n";
            response += this.listItems();
            response += "\n";
            response += this.controller.billTotal();
            return response;

        } catch (error) {
            return error;
        }
    }
}