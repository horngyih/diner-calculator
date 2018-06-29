import Bill from '../../src/models/bill';
import * as _assert from 'assert';
import 'mocha';

describe( 'Test Bill', ()=>{
    let bill : Bill = new Bill();
    it("Should instantiate a new Bill object", ()=>{
        _assert(bill);
    });

    it("Should have a default Shared diner", ()=>{
        _assert(bill.getShared());
    });

    it("Should have a list of diners", ()=>{
        let diners = bill.getDiners();
        _assert(diners);
        _assert(Array.isArray(diners));
    });

    it("Should have a list of items", ()=>{
        let items = bill.getItems();
        _assert(items);
        _assert(Array.isArray(items));
    });
});