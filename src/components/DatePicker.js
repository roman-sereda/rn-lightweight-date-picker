import React, { PureComponent } from 'react';
import {Animated, View} from 'react-native';
import formatDate from '../FormatDate';
import CustomDate from '../CustomDate';
import { MODE } from '../constants';
import Swiper from './Swiper';
import Days from './Dates';
import helper from "../helper";
import DatesManager from "../DatesManager";

class DatePicker extends PureComponent{
  constructor(props){
    super(props);

    let { start, end } = this.props;
    start = !!start && new CustomDate(start);
    end = !!end && new CustomDate(end);
    this.state = {
      start,
      end,
    };

    this.dates = new Days((date) => this.select(date), () => this.reset());
    this.updateDates();
  }

  componentDidUpdate(prevProps){
    const { userStyles, rowHeight, rowPadding, colors } = this.props;

    if (prevProps.userStyles !== userStyles || prevProps.colors !== colors ||
        prevProps.rowHeight !== rowHeight || prevProps.rowPadding !== rowPadding) {

      this.updateDates();
      this.forceUpdate();
    }
  }

  updateDates(){
    const { userStyles, colors, rowHeight, rowPadding } = this.props;
    this.dates.update(userStyles, colors, rowHeight, rowPadding );
  }

  reset(){
    this.setState({ start: false, end: false}, () => { this.sendCallback() });
  }

  formatDate(date){
    const { format, locale } = this.props;

    if(date){
      let newDate = new Date(date.year, date.month, date.day);
      if(format){
        return formatDate(newDate, format, locale);
      }

      return newDate;
    }

    return date;
  }

  sendCallback(){
    const { mode, onDateChange } = this.props;
    const { start, end } = this.state;

    if(mode === MODE.SINGLE){
      onDateChange(this.formatDate(start));
    }else{
      onDateChange({ start: this.formatDate(start), end: this.formatDate(end) });
    }
  }

  select(date){
    const { mode } = this.props;
    const { start, end } = this.state;

    let newDate = new CustomDate(date), newState = {};

    if(start !== false && end === false && start.isBefore(newDate) && mode !== MODE.SINGLE){
      newState = { end: newDate };
    }else{
      newState = { start: newDate, end: false };
    }

    this.setState(newState, () => { this.sendCallback() });
  }

  render(){
    const { start, end } = this.state;
    const { swipeDuration, week } = this.props;

    let params = Object.assign({}, this.props);
    params.start = start;
    params.end = end;

    let nextDatePicker = helper.addMonth({ month: this.props.month, year: this.props.year });
    let prevDatePicker = helper.subtractMonth({ month: this.props.month, year: this.props.year });

    let datesManager = new DatesManager({ ...params, week: params.minimized ? params.week : null });
    let prevDatesManager = {}, nextDatesManager = {}, padding = 1;

    if(params.minimized){
      if(week === 0){
        if(datesManager.weeks[0][0].day === 1){
          padding = 0;
        }
        prevDatesManager = new DatesManager({ ...params, week: 'last', month: prevDatePicker.month, year: prevDatePicker.year, padding });
      }else{
        prevDatesManager = new DatesManager({ ...params, week: week - 1 });
      }

      if(datesManager.weeksCount <= week + 2){
        nextDatesManager = new DatesManager({ ...params, week: 0, month: nextDatePicker.month, year: nextDatePicker.year });
      }else{
        nextDatesManager = new DatesManager({ ...params, week: week + 1 });
      }
    }else{
      prevDatesManager = new DatesManager({ ...params, month: prevDatePicker.month, year: prevDatePicker.year, padding });
      nextDatesManager = new DatesManager({ ...params, month: nextDatePicker.month, year: nextDatePicker.year });
    }

    return(
      <Swiper next = {(c) => this.props.next(c)} prev = {(c) => this.props.prev(c, padding)} swipeDuration={swipeDuration}>
        { <View style={{ width: '33.3333%' }}>
          { this.dates.renderDates(prevDatesManager) }
        </View> }
        { <View testID="couldBeTested" style={{ width: '33.3333%' }}>{ this.dates.renderDates(datesManager) }</View> }
        { <View style={{ width: '33.3333%' }}>
          { this.dates.renderDates(nextDatesManager) }
        </View> }
      </Swiper>
    );
  }
}

export default DatePicker;
