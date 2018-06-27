var Diner = require("../dist/diner").default;
var _assert = require("assert");

describe( "Test Diner construction", ()=>{
    let dinerName = "diner Name";
    let dinerAmount = 19.09;
    let diner = new Diner(dinerName, dinerAmount);
    it("Should instantiate a new diner", ()=>{
        _assert(diner);
    });

    let anotherDiner = new Diner("no name", 0.00 );
    it("Should instantiate a diner with a ID", ()=>{
        _assert(diner.getID());
    });
    it("Should instantiate a diner with an Unique ID", ()=>{
        _assert(diner.getID() !== anotherDiner.getID() );
    });

    it("Should instantiate a diner with the specified diner name", ()=>{
        _assert(diner.name);
        _assert(diner.name === dinerName );
    });
    it("Should instantiate a diner with the specified amount", ()=>{
        _assert(typeof diner.amount !== "undefined" && diner.amount !== null );
        _assert(diner.amount === dinerAmount);
    });
});

describe( "Test Diner Clone", ()=>{
    let diner = new Diner( "DinreName", 0.00 );
    it("Should instantiate a new diner", ()=>{
        _assert(diner);
    });

    let dinerClone = Diner.clone( diner );
    it("Should instantiate a new instance of diner", ()=>{
        _assert(diner != dinerClone);
    });

    it("Clone should have the same attributes as the original", ()=>{
        _assert(diner.getID() === dinerClone.getID() );
        _assert(diner.name === dinerClone.name);
        _assert(diner.amount === dinerClone.amount);
    });

});