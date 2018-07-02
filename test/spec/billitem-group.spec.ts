import "mocha";
import * as _assert from "assert";

import BillItem from '../../src/models/billitem';
import BillItemGroup from '../../src/models/billitem-group';

describe("Test Bill Item Group", ()=>{
    let itemGroupName = 'Item Group A-B';

    let itemA = new BillItem( 'Item A', 10.00 );
    let itemB = new BillItem( 'Item B', 19.00 );
    let itemGroup = new BillItemGroup( itemGroupName, [itemA, itemB] );
    it("Should be able to instantiate a new Bill Group",()=>{
        _assert(itemGroup);
    });

    it("Should have the specified name", ()=>{
        _assert(itemGroupName === itemGroup.name);
    });

    it("Should contain the grouped bill items", ()=>{
        let items = itemGroup.items;
        _assert( items.indexOf( itemA ) >= 0 );
        _assert( items.indexOf( itemB ) >= 0 );
    });

    it("Should have the return the price of the summed total of grouped bill items", ()=>{
        let summed = [itemA, itemB].reduce((total, item)=>{ total += item.price; return total }, 0.00 );
        _assert( itemGroup.price === summed );
    });

    let itemC = new BillItem( 'Item C', 9.00 );
    it( "Should be able to add a new Item", ()=>{
        itemGroup.addItem( itemC );
        _assert( itemGroup.items.indexOf( itemC ) >= 0 );
    });

    it("Should reflect the added item's price", ()=>{
        let summed = [itemA, itemB, itemC].reduce((total,item)=>{ total += item.price; return total}, 0.00 );
        _assert(itemGroup.price === summed );
    });

    it( "Should be able to remove an item", ()=>{
        itemGroup.removeItem( itemB );
        _assert(itemGroup.items.indexOf( itemB ) < 0 );
    });

    it("Should reflect the removed item's prce", ()=>{
        let summed = [ itemA, itemC].reduce((total,item)=>{ total += item.price; return total }, 0.00 );
        _assert(itemGroup.price === summed );
    })
});