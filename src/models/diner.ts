let dinerIDX = 1;

export default class Diner{
    protected dinerID : number;

    constructor( public name : string, public amount: number = 0.00 ){
        this.dinerID = dinerIDX++;
    }
    getID() : number{
        return this.dinerID;
    }

    static clone( diner : Diner ) : Diner {
        let dinerClone = new Diner( diner.name, diner.amount );
        dinerClone.dinerID = diner.getID();
        return dinerClone;
    }
}