import CustomDate from "./CustomDate";
import {MODE} from "./constants";
import helper from './helper';

const DatesManager = function(props){
    const { month, year, initialDate, start, end, maxDate, minDate, minRange, maxRange, mode, highlightToday } = props;

    /* calendar has limits, if date is before minLimit or after maxLimit - it will become unavailable to select
     limits calculates from minDate / maxDate or minRange / maxRange (false values == no limits)
     if you have chosen start date, then all dates that before start + minRange or after start + maxRange will become
     unavailable to select too */
    this.calculateBoundaries = () => {
        let maxLimit = maxDate ? new CustomDate(maxDate) : false;
        let minLimit = minDate ? new CustomDate(minDate) : false;

        if(start && end === false && mode !== MODE.SINGLE){
            if(minRange) minLimit = start.addDays(minRange - 1);

            if(maxRange){
                let newMaxLimit = start.addDays(maxRange - 1);
                maxLimit = maxLimit && maxLimit.isBefore(newMaxLimit) ? maxLimit : newMaxLimit;
            }

            let newMinLimit = start;
            minLimit = minLimit && minLimit.isAfter(newMinLimit) ? minLimit : newMinLimit;
        }

        return { maxLimit, minLimit };
    };

    this.chooseType = (date, dayIndex) => {
        if(!startReached && start && start.isEqualTo(date)){
            startReached = true;
            return { isSelected: true, side: 'left', back: start && end }
        }

        if(!endReached && end && end.isEqualTo(date)){
            endReached = true;
            return { isSelected: true, side: 'right', back: start && end };
        }

        if(end !== false && startReached && !endReached) return { date, isRanged: true };
        if(this.isBeforeMinLimit(date) || this.isAfterMaxLimit(date)){
            return { isUnavailable: true };
        }
        if(initialDay.isEqualTo(date) && highlightToday) return { date, isInitial: true };

        return { isWeekend: dayIndex === 0 };
    };

    this.isBeforeMinLimit = (date) => {
        if(minLimit && beforeMinLimit){
            if(minLimit.isAfter(date)){
                return true;
            }else{
                beforeMinLimit = false;
            }
        }

        return false;
    };

    this.isAfterMaxLimit = (date) => {
        return maxLimit && maxLimit.isBefore(date);
    };

    const { minLimit, maxLimit } = this.calculateBoundaries();

    // here we get array of weeks with dates of chosen month
    this.weeks = helper.getMonth(year, month);
    let weeksCount = this.weeks.length - 1;
    let initialDay = new CustomDate(initialDate);
    // we iterate calendar page, this variables shows if iteration has reached `start` and `end` of selected date range
    let startReached = false, endReached = false;
    // just to prevent unnecessary iterations
    let beforeMinLimit = !!minLimit;
    // this is the first date in our calendar page(calendar page could also show some days from previous or next month
    // because we show every week that has at least one day from chosen month)
    let startDate = this.weeks[0][0];
    // if `start` and/or `end` of the range is before start of calendar page then
    // we have already reached them
    if(start && start.isBefore(startDate)) startReached = true;
    if(end && end.isBefore(startDate)) endReached = true;
};

export default DatesManager;
