import 'mocha';
import * as _assert from 'assert';
import BillItem from '../../src/models/billitem';

describe( "Test Bill Item", ()=>{
    let itemDesc : string = 'Lunch Set A';
    let itemPrice : number = 19.90;
    let itemOwner : number = 1;
    let billItem : BillItem = new BillItem( itemDesc, itemPrice );
    let ownedBillItem : BillItem = new BillItem( itemDesc, itemPrice, itemOwner );
    it("Should instantiate a new bill item", ()=>{
        _assert(billItem);
        _assert(ownedBillItem);
    });

    it("Should have the specified bill item description", ()=>{
        _assert(billItem.description === itemDesc );
        _assert(ownedBillItem.description === itemDesc );
    });

    it("Should have the specified bill item price", ()=>{
        _assert(billItem.price === itemPrice );
        _assert(ownedBillItem.price === itemPrice );
    });

    it("Should have the specified item owner", ()=>{
        _assert(ownedBillItem.owner === itemOwner );
    });

    it("Should be able to update the item description", ()=>{
        let newDesc : string = 'Lunch Set B';
        billItem.description = newDesc;
        _assert(billItem.description === newDesc );
    });

    it("Should be able to update the item price", ()=>{
        let newPrice : number = 17.90;
        billItem.price = newPrice;
        _assert(billItem.price === newPrice);
    });

    it("Should be able to assign a new owner", ()=>{
        let newOwner : number = 9;
        billItem.owner = newOwner;
        _assert(billItem.owner === newOwner );
    });

    it("Should be able to clone a given Bill Ite,", ()=>{
        let cloneItem = BillItem.clone(ownedBillItem);
        _assert(cloneItem);
        _assert(cloneItem.getID() === ownedBillItem.getID());
        _assert(cloneItem.description === ownedBillItem.description );
        _assert(cloneItem.price === ownedBillItem.price);
        _assert(cloneItem.owner === cloneItem.owner );
    });
});