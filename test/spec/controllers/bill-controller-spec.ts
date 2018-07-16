import * as _assert from "assert";
import "mocha";

import { DefaultBillController, BillController } from "../../../src/controller/bill-controller";
import Diner from "../../../src/models/diner";
import BillItem from "../../../src/models/billitem";
//import { BillItem } from "../../../src/models/billitem";
//import { Diner } from "../../../src/models/diner";

describe( "Test Default Bill Controller", ()=>{
    let billController : BillController = new DefaultBillController();
    it("Should be able to instantiate a new BillController", ()=>{
        _assert(billController);
    });

    it("Should throw error when no bill has been created", ()=>{
        try{
            billController.listItems();
        } catch( error ){
            _assert(error);
        }
    });

    it("Should not throw error when a new bill has been created", ()=>{
        billController.newBill();
        try{
            billController.listItems();
        } catch( error ){
            _assert(!error);
        }
    });

    it("Should be able to add a new Diner", ()=>{
        let newDiner = new Diner( "Test Diner", 0.00 );
        let beforeAddDiner = billController.listDiners().length;
        billController.addDiner(newDiner);
        let afterAddDiner = billController.listDiners().length;
        _assert( afterAddDiner > beforeAddDiner );

        let retrievedDiner = billController.getDinerByID(newDiner.getID());
        _assert(retrievedDiner);
        _assert(retrievedDiner.getID() === newDiner.getID());
    });

    it("Should be able to update a Diner", ()=>{
        let existingDiner = billController.listDiners()[1];
        existingDiner.name = "Test Diner Updated";

        let beforeUpdateDiner = billController.listDiners().length;
        billController.updateDiner(existingDiner);
        let afterUpdateDiner = billController.listDiners().length;
        _assert( beforeUpdateDiner === afterUpdateDiner );

        let retrievedDiner = billController.getDinerByID(existingDiner.getID());
        _assert(retrievedDiner);
        _assert(retrievedDiner.getID() === existingDiner.getID());
        _assert(retrievedDiner.name === existingDiner.name );
    });

    it("Should be able to remove a Diner", ()=>{
        let beforeRemoveDiner = billController.listDiners().length;
        let diner = billController.listDiners()[1];
        billController.removeDiner(diner);
        let afterRemoveDiner = billController.listDiners().length;
        _assert( afterRemoveDiner < beforeRemoveDiner );

        let retrievedDiner = billController.getDinerByID(diner.getID());
        _assert(!retrievedDiner);
    });

    it("Should be able to add a new Item", ()=>{
        let item = new BillItem( "Bill Item", 19.00 );
        let beforeAddItem = billController.listItems().length;
        billController.addItem(item);
        let afterAddItem = billController.listItems().length;
        _assert(afterAddItem > beforeAddItem);

        let retrievedItem = billController.getItemByID(item.getID());
        _assert(retrievedItem);
        _assert(retrievedItem.getID() === item.getID() );
        _assert(retrievedItem.description === item.description );
        _assert(retrievedItem.price === item.price );
        _assert(retrievedItem.owner === item.owner );
    });

    it("Should be able to update a new Item", ()=>{
        let existingItem = billController.listItems()[0];
        existingItem.description = "Bill Item Updated";
        existingItem.price = 20.00;

        let beforeUpdateItem = billController.listItems().length;
        billController.updateItem(existingItem);
        let afterUpdateItem = billController.listItems().length;
        _assert(afterUpdateItem === beforeUpdateItem );

        let retrievedItem = billController.getItemByID(existingItem.getID());
        _assert(retrievedItem);
        _assert( retrievedItem.getID() === existingItem.getID());
        _assert( retrievedItem.description === existingItem.description );
        _assert( retrievedItem.price === existingItem.price );
    });

    it("Should be able to remove a Diner", ()=>{
        let existingItem = billController.listItems()[0];
        
        let beforeRemoveItem = billController.listItems().length;
        billController.removeItem(existingItem);
        let afterRemoveItem = billController.listItems().length;

        _assert( afterRemoveItem < beforeRemoveItem );

        let retrievedItem = billController.getItemByID( existingItem.getID() );
        _assert(!retrievedItem);
    });

});