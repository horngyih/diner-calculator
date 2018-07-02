import "mocha";
import * as _assert from "assert";

import Diner from '../../src/models/diner';

describe( "Test Diner", ()=>{
    let dinerName = 'New Diner';
    let dinerAmount = 9.0;
    let diner : Diner = new Diner(dinerName);
    it("Should be able to instantiate a Diner", ()=>{
        _assert(diner);
    });

    it("Should have the specified name", ()=>{
        _assert(dinerName === diner.name);
    });

    it("Should have the default amount", ()=>{
        _assert(diner.amount === 0.00 );
    });

    let dinerTwo = new Diner( dinerName, dinerAmount );
    it("Should be able to instantiate a Diner with an amount", ()=>{
        _assert(dinerTwo);
    });

    it("Should have the specified name", ()=>{
        _assert(dinerName === dinerTwo.name);
    });

    it("Should have the specified amount", ()=>{
        _assert(dinerAmount === dinerTwo.amount);
    });

    let newName = 'Diner New Name';
    let newAmount = 19.00;
    it("Should be able to change the diner's name", ()=>{
        diner.name = newName;
        _assert(newName === diner.name);
    });

    it("Should be able to change the amount", ()=>{
        diner.amount = newAmount;
        _assert( newAmount === diner.amount);
    });
});