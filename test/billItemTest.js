var BillItem = require("../dist/billitem").default;
var _assert = require("assert");

describe("Test Bill Items", ()=>{
    let billItemDesc = "Lunch Set A";
    let billPrice = 19.90;
    let billOwner = 9;
    let billItem = new BillItem( billItemDesc, billPrice );
    it("Should instantiate a new bill item", ()=>{_assert(billItem)});
    it("Should intantiate a bill item with an ID", ()=>{ _assert(billItem.getID())} );

    let anotherBillItem = new BillItem("no desc", 0.00 );
    it("Should instantiate a bill item with a Unique ID", ()=>{_assert(billItem.getID() !== anotherBillItem.getID())});

    it("Should instantiate a bill item with the specified description", ()=>{_assert(billItem.description===billItemDesc)});
    it("Should instantiate a bill item with the specified price", ()=>{_assert(billItem.price === billPrice)});

    billItem.owner = billOwner;
    it("Should be able to set a Bill Item's owner ID", ()=>{_assert(billItem.owner === billOwner)});
});