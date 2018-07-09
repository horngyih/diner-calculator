import "mocha";
import * as _assert from "assert";
import Diner from '../../src/models/diner';
import DinerGroup from '../../src/models/diner-group';

describe("Test Diner Group", ()=>{
    let dinerA = new Diner("Diner A" );
    let dinerB = new Diner("Diner B" );
    let dinerGroup = new DinerGroup( 'Diner Group', [dinerA, dinerB] );
    it("Should insantiate a new Diner Group", ()=>{
        _assert(dinerGroup);        
    });

    it("Should have a new DinerID", ()=>{
        _assert(dinerGroup.getID());
    });

    it("Should have a list of diners", ()=>{
        _assert(dinerGroup.diners);
    });

    it("Should have a list of diners that it instantiated with", ()=>{
        _assert(dinerGroup.diners.indexOf(dinerA) >= 0 );
        _assert(dinerGroup.diners.indexOf(dinerB) >= 0 );
    });

    let dinerC = new Diner("Diner C");
    dinerGroup.diners.push(dinerC);
    it("Should be able to add a new Diner to the group", ()=>{
        _assert(dinerGroup.diners.indexOf(dinerC) >= 0 );
    });
});