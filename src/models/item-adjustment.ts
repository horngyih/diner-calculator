export default class ItemAdjustment{
    constructor( public description : string, public amount : number, public isPercentage : boolean = true, public isCompound : boolean = false ){
    }
}