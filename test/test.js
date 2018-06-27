var Bill = require("../dist/bill").default;
var BillItem = require("../dist/billitem").default;
var Diner = require("../dist/diner").default;
var _assert = require("assert");

describe("Test Bill", () => {
    var bill = null;
    it("Should be able to instantiate a new bill", () => {
        bill = new Bill();
        _assert(bill);
    });
    it("Should have a list of diners", () => {
        _assert(Array.isArray(bill.getDiners()));
    });
    it("Should have a list of bill items", () => {
        _assert(Array.isArray(bill.getItems()));
    });
});

describe("Test Bill Functions", () => {
    var bill = null;
    it("Should be able to instantiate a new bill", () => {
        bill = new Bill();
        _assert(bill);
    });

    var diner = new Diner("TestDiner");
    it("Should be able to add a new Diner", () => {
        var dinerListLength = bill.getDiners().length;
        bill.addDiner(diner);
        var dinerList = bill.getDiners();
        _assert(dinerList.length === dinerListLength + 1);
        _assert(dinerList.filter(item => item.getID() === diner.getID()).length === 1);
        var retrieved  = bill.getDinerByID(diner.getID());
        _assert(retrieved);
        _assert(diner.getID() === retrieved.getID() && diner.name === retrieved.name);
    });

    var dinerItems = [];
    var dinerAmount = null;
    var billTotal = null;

    var newItem = new BillItem("NewItem", 10.00);
    it("Should be able to add items", () => {
        var itemListLength = bill.getItems().length;
        bill.addItem(newItem);
        var itemList = bill.getItems();
        _assert(itemList.length === itemListLength + 1);
        _assert(itemList.filter(item => item.getID() === newItem.getID()).length === 1);
        var item = bill.getItemByID(newItem.getID());
        _assert(item);
        _assert(item.getID() === newItem.getID() && item.description === newItem.description);
        dinerItems.push(newItem);
    });

    it("Should be able to add new Bill Items", () => {
        for (var i = 0; i < 8; i++) {
            var billItem = new BillItem("Item " + i, (Math.random() * 10));
            if (i % 2 === 0) {
                billItem.owner = diner.getID();
            }
            dinerItems.push(billItem);
            bill.addItem(billItem);
        }
    });

    it("Should tally up the selected Diner's Bill Items", () => {
        dinerAmount = dinerItems
            .filter(item => item.owner === diner.getID())
            .reduce((total, item) => {
                total += item.price;
                return total;
            }, 0);
        _assert( bill.calculateDinerAmount(diner) === dinerAmount );
    });

    it("Should tally up the bill total correctly", ()=>{
        billTotal = dinerItems.reduce((total, item)=>{ return total + item.price }, 0 );
        _assert( bill.getBillTotal() === billTotal );
    });
});