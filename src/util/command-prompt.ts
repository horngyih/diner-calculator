import { createInterface } from "readline";
import Bill from "../models/bill";
import Diner from "../models/diner";
import BillItem from "../models/billitem";

const INPUT_TOKEN_PATTERN = /\/?[-0-9.]+|".+"|'.+'|\w+/g;

const NUMBER_PATTERN = /[0-9]+/;

const ARRAY_PATTERN = /^[.+]/;

export default class CommandPrompt {


    protected actionMap;
    protected bill: Bill;

    constructor(public promptCharacter: string = ">") {
        this.init();
    }

    init() {
        this.actionMap = {};
        this.actionMap['newbill'] = this.newBill.bind(this);
        this.actionMap['nb'] = this.newBill.bind(this);

        let showBillAction = this.requireBill(this.showBill.bind(this));
        this.actionMap['showbill'] = showBillAction;
        this.actionMap['sb'] = showBillAction;

        let addDinerAction = this.requireBill(this.addDiner.bind(this));
        this.actionMap['adddiner'] = addDinerAction
        this.actionMap['diner'] = addDinerAction;
        this.actionMap['d'] = addDinerAction;

        let listDinerAction = this.requireBill(this.listDiners.bind(this));
        this.actionMap['listdiners'] = listDinerAction;
        this.actionMap['diners'] = listDinerAction;

        let addItemAction = this.requireBill(this.addItem.bind(this));
        this.actionMap['additem'] = addItemAction;
        this.actionMap['item'] = addItemAction;
        this.actionMap['i'] = addItemAction;

        let listItemsAction = this.requireBill(this.listItems.bind(this));
        this.actionMap['listitems'] = listItemsAction;
        this.actionMap['items'] = listItemsAction;

        let listUnassignedAction = this.requireBill(this.listUnassigned.bind(this));
        this.actionMap['listunassigned'] = listUnassignedAction;
        this.actionMap['unassigned'] = listUnassignedAction;
        this.actionMap['ua'] = listUnassignedAction;

        let billTotalAction = this.requireBill(this.billTotal.bind(this));
        this.actionMap['billtotal'] = billTotalAction;
        this.actionMap['tt'] = billTotalAction;

        let assignOwnerAction = this.requireBill(this.assignOwner.bind(this));
        this.actionMap['assign'] = assignOwnerAction;
        this.actionMap['a'] = assignOwnerAction;

        let finalizeAction = this.requireBill(this.finalize.bind(this));
        this.actionMap['finalize'] = finalizeAction;
        this.actionMap['closebill'] = finalizeAction;
        this.actionMap['c'] = finalizeAction;
    }

    start() {
        console.log("Starting command prompt with prompt char " + this.promptCharacter);
        let lineReader = createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: this.promptCharacter
        });

        lineReader.on("line", this.handleLine.bind(this));
    }

    handleLine(line) {
        if (line.trim() !== "exit") {
            let cmds = line.split(";");
            let executions = cmds.filter(cmd => cmd.trim().length !== 0).map(cmd => this.exec(cmd));
            Promise.all(executions)
                .then(responses => responses.forEach(response => console.log(">> " + response)))
                .catch(error => console.log("ERROR :" + error));
        } else {
            process.exit(0);
        }
    }

    exec(line: string) {
        return new Promise((resolve, reject) => {
            this.parse(line)
                .then(this.interpret.bind(this))
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
    }

    parse(command: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            if (command && command.trim().length > 0) {
                let tokens = command.match(INPUT_TOKEN_PATTERN);
                if (tokens) {
                    tokens = tokens.map(token => {
                        return token
                            .trim()
                            .replace(/^["']{1}/, "")
                            .replace(/['"]{1}$/, "");
                    });
                }
                resolve(tokens);
            } else {
                reject("");
            }
        });
    }

    interpret(tokens: string[]): Promise<string> {
        return new Promise((resolve, reject) => {
            let action = this.actionMap[tokens[0].toLowerCase()];
            if (action) {
                resolve(action(tokens.slice(1)));
            } else {
                resolve("Unrecognized command : " + tokens[0]);
            }
        });
    }

    protected addDiner(args: string[]): string {
        let response = "";
        if (this.bill) {
            if (args.length <= 0) {
                return "addDiner <Diner Name>";
            }
            let responses = args.map(dinerName => this.addNewDiner(dinerName));
            return responses.join("\n>>");
        } else {
            response += "No bill created yet";
        }
        return response;
    }

    protected addNewDiner(dinerName: string): string {
        let response = "New Diner ";
        if (dinerName) {
            let existingDiner = this.bill.getDiners().filter((diner) => diner.name === dinerName);
            if (existingDiner.length === 0) {
                this.bill.addDiner(new Diner(dinerName));
                response += "added";
            } else {
                response += `\n Diner with the name ${dinerName} already exists`;
            }
        } else {
            response += "\n Please specify diner name";
        }
        return response;
    }

    protected listDiners(): string {
        return CommandPrompt.printDiners(this.bill.getDiners());
    }

    protected addItem(args: string[]): string {
        if (args.length <= 0) {
            return "addItem <Item Description> <Item Price> [ <Item Quantity> ]";
        }
        let itemDesc = this.formatDescription((args.length > 0) ? args[0].trim() : null);
        let itemPrice: any = (args.length > 1) ? args[1].trim() : null;
        let itemQty: any = (args.length > 2) ? args[2].trim() : 1;
        if (itemDesc) {
            if (itemPrice) {
                let dividePrice: boolean = false;
                try {
                    if (itemQty[0] === '/') {
                        dividePrice = true;
                        itemQty = itemQty.substring(1);
                    }
                    itemQty = parseInt(itemQty);
                    if (itemQty < 0) {
                        itemQty = 1;
                    }
                } catch (err) {
                    return "Invalid quanity - " + itemQty;
                }

                try {
                    itemPrice = parseFloat(itemPrice);
                    if (dividePrice) {
                        itemPrice = itemPrice / itemQty;
                    }
                } catch (err) {
                    return "Invalid price - " + itemPrice;
                }

                let shared = this.bill.getDiners()[0];
                for (let i = 0; i < itemQty; i++) {
                    let newItem = new BillItem(itemDesc, itemPrice);
                    this.bill.addItem(newItem);
                }
                return `Added ${itemQty} items`;
            } else {
                return "No item price provided";
            }
        } else {
            return "No item description provided";
        }
    }

    protected getItems(filter: (string) => boolean = (item) => true): string {
        let response = "Current items :\n";
        this.bill.getItems().filter(filter).forEach((item, index) => response += `${index}:${item.description} - ${item.price} - ${this.getDinerName(item.owner)}\n`);
        return response;
    }

    protected listItems(): string {
        return this.getItems();
    }

    protected listUnassigned(): string {
        return this.getItems((item) => item.owner === this.bill.getShared().getID());
    }

    protected assignOwner(args: string[]): string {
        if (args.length <= 0) {
            return "assign <item no> <diner no>";
        }
        let itemIndex = null;
        let dinerIndex = 0;
        if (args.length > 0) {
            try {
                itemIndex = parseInt(args[0]);
            } catch (err) {
                return "Invalid item no - " + args[0];
            }
        }

        if (args.length > 1) {
            try {
                dinerIndex = parseInt(args[1]);
            } catch (err) {
                return "Invalid diner no - " + args[1];
            }
        }

        if (itemIndex != null && dinerIndex != null) {
            let diner = this.bill.getDiners()[dinerIndex];
            let item = this.bill.getItems()[itemIndex];
            console.log("Assign Item-" + item.getID() + " to Diner-" + diner.getID());
            this.bill.assignOwner(item.getID(), diner.getID());
        }
        return this.showBill();
    }

    protected newBill(): string {
        let response = "";
        response += "New Bill ";
        this.bill = new Bill();
        response += (this.bill) ? "created " : "not created ";
        return response;
    }

    protected showBill(): string {
        let response = "Current Bill\n";
        response += this.listDiners();
        response += "\n";
        response += this.listItems();
        response += "\n";
        response += this.billTotal();
        return response;
    }

    protected billTotal(): string {
        let response: string = "Bill total :\n";
        response += this.bill.getBillTotal();
        return response;
    }

    protected finalize(): string {
        let response = "";
        response += this.billTotal();
        response += "\n";
        response += "Shared Amount per diner : " + this.bill.getSharedAmountPerDiner();
        response += "\n";
        let diners = this.bill.finalize();
        response += CommandPrompt.printDiners(diners);
        return response;
    }

    protected getDinerName(id: number): string {
        if (this.bill) {
            let result = this.bill.getDiners().filter(diner => diner.getID() === id);
            if (result.length == 1) {
                return result[0].name;
            }
        }
        return "";
    }

    protected mapDinerByIndex(diners: string[]): string[] {
        if (diners) {
            let dinerNames = this.bill.getDiners().map(diner => diner.name);
            return diners.map(diner => {
                if (!NUMBER_PATTERN.test(diner.trim())) {
                    return "" + dinerNames.indexOf(diner);
                } else {
                    return diner;
                }
            });
        }
        return diners;
    }

    protected formatDescription(desc: string): string {
        if (desc) {
            return desc.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
        } else {
            return desc;
        }
    }

    protected requireBill(fn) {
        let self = this;
        return function () {
            if (self.bill) {
                return fn.apply(self, arguments);
            } else {
                return "No bill created yet";
            }

        };
    }

    static printDiners(diners: Diner[]): string {
        let response = "Current diners :\n";
        diners.forEach((diner, index) => response += `${index}:${diner.name} - ${diner.amount}\n`);
        return response;
    }
}
