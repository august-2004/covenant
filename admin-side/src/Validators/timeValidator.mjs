import {Mealtime} from '../Schemas/MealtimeSchema.mjs'

export const timeValidator = async (mealtime)=>{
    const {closingTime} = await Mealtime.findOne({mealtime});
    if(!closingTime)
        return false;
    
    const [closeHours , closeMins] = closingTime.split(':').map(Number);
    const closingTimeCalculated = (closeHours * 60) + closeMins;

    const now = new Date();
    const currTime = (now.getHours() * 60) + now.getMinutes();

    if (currTime<closingTimeCalculated)
        return true
    return false
}

