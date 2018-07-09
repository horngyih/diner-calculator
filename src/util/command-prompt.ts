import { createInterface } from "readline";
import Bill from "../models/bill";
import Diner from "../models/diner";
import BillItem from "../models/billitem";

const INPUT_TOKEN_PATTERN = /\/?[-0-9.]+|".+"|'.+'|\w+/g;

export default class CommandPrompt{

    protected aliasMap;
    protected actionMap;
    protected documentationMap;
    protected bill : Bill;

    constructor( public promptCharacter : string = ">" ){
        this.init();
    }

    init(){
        this.initAction();
    }

    initAction(){
        this.aliasMap = {};
        this.actionMap = {};
        this.documentationMap = {};

        let newBillCommand = 'newbill';
        let newBillAction = this.newBill.bind(this);
        let newBillDoc = 'Create a new bill; this will drop any existing bill details';
        this.addAction( newBillCommand, newBillAction, newBillDoc, ['nb']);

        let showBillCommand = 'showBill';
        let showBillAction = this.showBill.bind(this);
        let showBillDoc = 'Show bill details';
        this.addAction( showBillCommand, showBillAction, showBillDoc, ['sb'] );

        let addDinerCommand = 'adddiner';
        let addDinerAction = this.addDiner.bind(this);
        let addDinerDoc = 
        `Add a new diner; diner name must be unique
        addDiner <dinerName>
        `;
        this.addAction( addDinerCommand, addDinerAction, addDinerDoc, ['diner', 'd']);

        let listDinersCommand = 'listDiners';
        let listDinersAction = this.listDiners.bind(this);
        let listDinersDoc = 'List current bill\'s diners';
        this.addAction( listDinersCommand, listDinersAction, listDinersDoc, ['diners', 'ld' ] );

        let removeDinerCommand = 'removeDiner';
        let removeDinerAction = ()=> "Not implemented";
        let removeDinersDoc = 
        `Remove diner from bill
        removeDiner <dinerIndex>
        `;
        this.addAction( removeDinerCommand, removeDinerAction, removeDinersDoc, ['rd']);
        
        let addItemCommand = 'addItem';
        let addItemAction = this.addItem.bind(this);
        let addItemDoc = 
        `Add a new bill item
        addItem <ItemDesc> <ItemPrice> [ <Quantity> | '\'<DividedByQuantity> ]
        - <ItemDesc> - Item description for the bill item
        - <ItemPrice> - Item Price for the bill item
        - <Quantity> - The number of items to be added to the bill (optional, def = 1 )
        - <DividedByQuantity> - This indicates the Item Price is to be divided into this quantity`;
        this.addAction( addItemCommand, addItemAction, addItemDoc, ['item', 'i']);

        let listItemCommand = 'listItems';
        let listItemAction = this.listItems.bind(this);
        let listItemDoc = 'List current bill items';
        this.addAction( listItemCommand, listItemAction, listItemDoc, ['items', 'li'] );

        let unassignedItemsCommand = 'listUnassigned';
        let unassignedItemsAction = this.listUnassigned.bind(this);
        let unassignedItemsDoc = 'List current bill items that are unassigned to any diners.';
        this.addAction( unassignedItemsCommand, unassignedItemsAction, unassignedItemsDoc, ['unassigned','ua']);

        let billTotalCommand = 'billTotal';
        let billTotalAction = this.billTotal.bind(this);
        let billTotalDoc = 'Show the current bill\s total';
        this.addAction( billTotalCommand, billTotalAction, billTotalDoc, ['tt']);

        let assignItemCommand = 'assign';
        let assignItemAction = this.assignOwner.bind(this);
        let assignItemDoc = 
        `Assign the specified bill item to a diner
assign <ItemIndex> <DinerIndex>
- <ItemIndex> Index of the item to be assigned,
- <DinerIndex> Index of the diner the item to be assigned to.`;
        this.addAction( assignItemCommand, assignItemAction, assignItemDoc, ['a'] );

        let finalizeBillCommand = 'finalize';
        let finalizeBillAction = this.finalize.bind(this);
        let finalizeBillDoc = 
        `Finalize the bill, distribute shared amount and calculate individual diner's amount due.`;
        this.addAction( finalizeBillCommand, finalizeBillAction, finalizeBillDoc, ['closebill', 'c', 'f'] );
    }

    createAlias( originalAction : string, alias : string ){
        if( this.aliasMap[ alias ] ){
            console.error( `Alias ${alias} already exists for ${this.aliasMap[alias]}` );
        } else{
            this.aliasMap[alias] = originalAction;
        }
    }

    unalias( actionCommand : string ) : string|null{
        actionCommand = actionCommand.toLowerCase();
        if( this.aliasMap[actionCommand] ){
            return this.aliasMap[actionCommand];
        }
        return actionCommand;
    }

    addAction( actionCommand : string, action : any, documentation? : string, aliases? : string|string[] ){
        if( typeof action === "function" ){
            actionCommand = actionCommand.toLowerCase();
            this.actionMap[actionCommand] = action;
            if( documentation ){
                this.documentationMap[actionCommand] = documentation;
            }

            if( aliases ){
                if( typeof aliases === "string" ){
                    aliases = [ aliases ];
                }
                aliases.forEach( alias => this.createAlias( actionCommand, alias ) );
            }
        }
    }

    getAction( actionCommand : string ){
        return this.actionMap[this.unalias(actionCommand)];
    }

    getDocumentation( actionCommand : string ){
        return this.documentationMap[this.unalias(actionCommand)];
    }

    showDocumentation( actionCommand? : string ) : string{
        let doc = "\n"
        if( actionCommand ){
            doc += this.getDocumentation(actionCommand);
        } else {
            doc += "Commands:\n";
            let commands = Object.keys( this.actionMap );//.sort();
            commands.push( "help" );
            commands.push( "exit" );
            doc += commands.join( ", ");
        }
        return doc;
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
            let cmds = line.split(";");
            let executions = cmds.filter(cmd=>cmd.trim().length !==0 ).map(cmd=>this.exec(cmd));
            Promise.all(executions)
            .then(responses=>responses.forEach(response=>console.log(">> " + response )))
            .catch(error=>console.log("ERROR :" + error));
        } else {
            process.exit(0);
        }
    }

    exec( line : string ){
        return new Promise((resolve, reject)=>{
            this.parse(line)
            .then(this.interpret.bind(this))
            .then(response=>resolve(response))
            .catch(err=>reject(err));
        });
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
            if( tokens[0].toLowerCase() === 'help' ){
                if( tokens.length > 1 ){
                    resolve( this.showDocumentation(tokens[1]));
                } else{ 
                    resolve( this.showDocumentation() );
                }
            } else {
                let action = this.getAction(tokens[0].toLowerCase());
                if( action ){
                    resolve( action(tokens.slice(1)) );
                } else {
                    resolve( "Unrecognized command : " + tokens[0] );
                }
            }
        });
    }

    protected addDiner( args : string[] ) : string{
        let response = "";
        if( this.bill ){
            if( args.length <= 0 ){
                return "addDiner <Diner Name>";
            }
            let responses = args.map(dinerName=>this.addNewDiner(dinerName));
            return responses.join("\n>>");
        } else {
            response += "No bill created yet";
        }
        return response;
    }

    protected addNewDiner( dinerName : string ) : string{
        let response = "New Diner ";
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
            let itemDesc = this.formatDescription( (args.length>0)? args[0].trim() : null );
            let itemPrice : any = (args.length>1)? args[1].trim() : null;
            let itemQty : any = (args.length>2)? args[2].trim() : 1;
            if( itemDesc ){
                if( itemPrice ){
                    let dividePrice : boolean = false;
                    try{
                        if( itemQty[0] === '/' ){
                            dividePrice = true;
                            itemQty = itemQty.substring(1);
                        }
                        itemQty = parseInt(itemQty);
                        if( itemQty < 0 ){
                            itemQty = 1;
                        }
                    } catch( err ){
                        return "Invalid quanity - " + itemQty;
                    }

                    try{
                        itemPrice = parseFloat(itemPrice);
                        if( dividePrice ){
                            itemPrice = itemPrice / itemQty;
                        }
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

    protected getItems( filter : (string)=>boolean = (item)=>true ) : string{
        if( this.bill ){
            let response = "Current items :\n";
            this.bill.getItems().filter(filter).forEach((item, index)=> response += `${index}:${item.description} - ${item.price} - ${this.getDinerName(item.owner)}\n`);
            return response;
        } else {
            return "No bill created yet";
        }
    }

    protected listItems() : string {
        return this.getItems();
    }

    protected listUnassigned() : string {
        return this.getItems( (item)=>item.owner === this.bill.getShared().getID() );
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

    protected formatDescription( desc : string ) : string{
        if( desc ){
            return desc.replace( /_/g, " " ).split(" ").map(word=>word.charAt(0).toUpperCase() + word.substring(1)).join(" " );
        } else {
            return desc;
        }
    }

    static printDiners( diners : Diner[] ) : string{
        let response = "Current diners :\n";
        diners.forEach((diner, index)=>response += `${index}:${diner.name} - ${diner.amount}\n`);
        return response;
    }
}
