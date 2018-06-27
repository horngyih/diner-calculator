let dinerIDX = 1;

export default class Diner{
    protected dinerID : number;

    constructor( public name : string, public amount: number = 0.00 ){
        this.dinerID = dinerIDX++;
    }
    getID() : number{
        return this.dinerID;
    }
}