import Diner from "./diner";

export default class DinerGroup extends Diner{
    constructor( public name : string, public diners : Diner[], public amount : number = 0.00 ){
        super( name, amount );
    }
}