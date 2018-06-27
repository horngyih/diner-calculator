import { createInterface } from "readline";
import { resolve } from "path";
import Bill from "../models/bill";
import Diner from "../models/diner";
import BillItem from "../models/billitem";

const INPUT_TOKEN_PATTERN = /[-0-9.]+|".+"|'.+'|\w+/g;

export default class CommandPrompt{

    protected actionMap;
    protected bill : Bill;

    constructor( public promptCharacter : string = ">" ){
        this.init();
    }

    init(){
        this.actionMap = {};
        this.actionMap['newbill'] = this.newBill.bind(this);
        this.actionMap['showbill'] = this.showBill.bind(this);

        this.actionMap['adddiner'] = this.addDiner.bind(this);
        this.actionMap['listdiners'] = this.listDiners.bind(this);

        this.actionMap['additem'] = this.addItem.bind(this);
        this.actionMap['listitems'] = this.listItems.bind(this);

        this.actionMap['billtotal'] = this.billTotal.bind(this);

        this.actionMap['assign'] = this.assignOwner.bind(this);

        this.actionMap['finalize'] = this.finalize.bind(this);
    }

    start(){
        console.log( "Starting command prompt with prompt char " + this.promptCharacter );
        let lineReader = createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: this.promptCharacter
        });

        lineReader.on("line", this.handleLine.bind(this) );
    }

    handleLine( line ){
        if( line.trim() !== "exit" ){
            this.parse(line)
            .then(this.interpret.bind(this))
            .then((response)=>console.log( ">>" + response))
            .catch((err)=>console.log(">>"+err));
        } else {
            process.exit(0);
        }
    }

    parse( command:string ) : Promise<string[]>{
        return new Promise((resolve, reject)=>{
            if( command && command.trim().length > 0 ){
                let tokens = command.match(INPUT_TOKEN_PATTERN);
                if( tokens ){
                    tokens = tokens.map(token=>{
                        return token
                        .trim()
                        .replace(/^["']{1}/, "" )
                        .replace(/['"]{1}$/, "" );
                    });
                }
                resolve(tokens);
            } else {
                reject("");
            }
        });
    }

    interpret( tokens : string[] ) : Promise<string>{
        return new Promise((resolve, reject)=>{
            let action = this.actionMap[tokens[0].toLowerCase()];
            if( action ){
                resolve( action(tokens.slice(1)) );
            } else {
                resolve( "Unrecognized command : " + tokens[0] );
            }
        });
    }

    protected addDiner( args : string[] ) : string{
        let response = "";
        if( this.bill ){
            if( args.length <= 0 ){
                return "addDiner <Diner Name>";
            }
            response += "New Diner ";
            let dinerName = (args.length > 0 )? args[0] : "";
            if( dinerName ){
                let existingDiner = this.bill.getDiners().filter((diner)=>diner.name === dinerName );
                if( existingDiner.length === 0 ){
                    this.bill.addDiner( new Diner(dinerName) );
                    response += "added";
                } else {
                    response += `\n Diner with the name ${dinerName} already exists`;
                }
            } else {
                response += "\n Please specify diner name";
            }
        } else {
            response += "No bill created yet";
        }
        return response;
    }

    protected listDiners() : string{
        if( this.bill ){
            return CommandPrompt.printDiners(this.bill.getDiners());
        } else {
            return "No bill created yet";
        }
    }

    protected addItem( args : string[] ) : string {
        if( this.bill ){
            if( args.length <= 0 ){
                return "addItem <Item Description> <Item Price> [ <Item Quantity> ]";
            }
            let itemDesc = (args.length>0)? args[0] : null;
            let itemPrice : any = (args.length>1)? args[1] : null;
            let itemQty : any = (args.length>2)? args[2] : 1;
            if( itemDesc ){
                if( itemPrice ){
                    try{
                        itemQty = parseInt(itemQty);
                        if( itemQty < 0 ){
                            itemQty = 1;
                        }
                    } catch( err ){
                        return "Invalid quanity - " + itemQty;
                    }

                    try{
                        itemPrice = parseFloat(itemPrice);
                    } catch( err ){
                        return "Invalid price - " + itemPrice;
                    }

                    let shared = this.bill.getDiners()[0];
                    for( let i = 0; i < itemQty; i++ ){
                        let newItem = new BillItem(itemDesc, itemPrice);
                        this.bill.addItem( newItem );
                    }
                    return `Added ${itemQty} items`;
                } else {
                    return "No item price provided";
                }
            } else {
                return "No item description provided";
            }
        } else {
            return "No bill created yet";
        }
    }

    protected listItems() : string{
        if( this.bill ){
            let response = "Current items :\n";
            this.bill.getItems().forEach((item, index)=> response += `${index}:${item.description} - ${item.price} - ${this.getDinerName(item.owner)}\n`);
            return response;
        } else {
            return "No bill created yet";
        }
    }

    protected assignOwner( args : string[] ) : string{
        if( this.bill ){
            if( args.length <=0 ){
                return "assign <item no> <diner no>";
            }
            let itemIndex = null;
            let dinerIndex = 0;
            if( args.length > 0 ){
                try{
                    itemIndex = parseInt(args[0]);
                } catch( err ){
                    return "Invalid item no - " + args[0];
                }
            }

            if( args.length > 1 ){
                try{
                    dinerIndex = parseInt(args[1]);
                } catch( err ){
                    return "Invalid diner no - " + args[1];
                }
            }

            if( itemIndex != null && dinerIndex != null ){
                let diner = this.bill.getDiners()[dinerIndex];
                let item = this.bill.getItems()[itemIndex];
                console.log( "Assign Item-" + item.getID() + " to Diner-" + diner.getID() );
                this.bill.assignOwner( item.getID(), diner.getID() );
            }
            return this.showBill();
        } else {
            return "No bill created yet";
        }
    }

    protected newBill() : string{
        let response = "";
        response += "New Bill ";
        this.bill = new Bill();
        response += ( this.bill )? "created " : "not created ";
        return response;
    }

    protected showBill() : string{
        if( this.bill ){
            let response = "Current Bill\n";
            response += this.listDiners();
            response += "\n";
            response += this.listItems();
            response += "\n";
            response += this.billTotal();
            return response;
        } else {
            return "No existing bill";
        }
    }

    protected billTotal() : string{
        if( this.bill ){
            let response : string = "Bill total :\n";
            response += this.bill.getBillTotal();
            return response;
        } else {
            return "No bill created yet";
        }
    }

    protected finalize() : string{
        if( this.bill ){
            let response = "";
            response += this.billTotal();
            response += "\n";
            response += "Shared Amount per diner : " + this.bill.getSharedAmountPerDiner();
            response += "\n";
            let diners = this.bill.finalize();
            response += CommandPrompt.printDiners(diners);
            return response;
        } else {
            return "No bill created yet";
        }
    }

    protected getDinerName( id : number ) : string{
        if( this.bill ){
            let result = this.bill.getDiners().filter(diner=>diner.getID()===id);
            if( result.length == 1 ){
                return result[0].name;
            }
        }
        return "";
    }

    static printDiners( diners : Diner[] ) : string{
        let response = "Current diners :\n";
        diners.forEach((diner, index)=>response += `${index}:${diner.name} - ${diner.amount}\n`);
        return response;
    }
}
