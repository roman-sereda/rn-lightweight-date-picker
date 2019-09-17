import React, { PureComponent, Component } from 'react';
import { Text, View, Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import DatePicker from './DatePicker';
import helper from '../helper';

class Calendar extends PureComponent{
  constructor(props){
    super(props);

    let newState = this.update();

    this.state = {
      ...newState,
      fade: new Animated.Value(1),
    };
  }

  componentDidUpdate(prevProps, prevState){
    let newState = this.update(prevProps);
    if(Object.keys(newState).length > 0) this.setState(newState);
  }

  // just a little trick to update locales and initialDate only when  props has changed
  update(prevProps = {}){
    const { locale, initialDate, userColors, userStyles, rowPadding, rowHeight } = this.props;
    let newState = {};

    if(prevProps.userColors !== userColors || prevProps.userStyles !== userStyles ||
        prevProps.rowHeight !== rowHeight || prevProps.rowPadding !== rowPadding) {
      let colors = helper.mergeColors(userColors);
      let sizes = { rowHeight, rowPadding };
      let styles = helper.mergeStyles(getStyles, userStyles, colors, sizes);
      newState = { styles, colors }
    }

    if(!prevProps.initialDate || (prevProps.initialDate.getTime() !== initialDate.getTime())){
      newState.month = initialDate.getMonth();
      newState.year = initialDate.getFullYear();
    }

    if(prevProps.locale !== locale){
      newState.dayNames = helper.getDayNames(locale);
      newState.monthNames = helper.getMonthNames(locale);
    }

    return newState;
  }

  renderDaysOfTheWeek(){
    const { dayNames, styles } = this.state;

    return(
      <View style = {styles.daysOfTheWeek}>
        { dayNames.map(day => {
          return <View style = {styles.dayOfTheWeekWrapper} key = {"name" + day}>
            <Text style = {styles.dayOfTheWeek}>
             { day }
            </Text>
          </View>
        }) }
      </View>
    )
  }

  fade(value){
    const { fade } = this.state;
    const { fadeDuration } = this.props;

    return new Promise((resolve, reject) => {
      Animated.timing(this.state.fade, { toValue: value, duration: fadeDuration / 2 })
      .start(() => {
        resolve();
      });
    });
  }

  switchMonth(date){
    this.fade(0).then(() => {

      this.setState({ month: date.month, year: date.year }, () => {
        this.fade(1);
      });
    })
  }

  nextMonth(){
    const { month, year, fade } = this.state;
    this.switchMonth(helper.addMonth({ month, year }));
  }

  prevMonth(){
    const { month, year, fade } = this.state;
    this.switchMonth(helper.subtractMonth({ month, year }));
  }

  renderTopBar(){
    const { year, month, monthNames, fade, styles } = this.state;
    const { leftControl, rightControl } = this.props;

    let monthName = monthNames[month];

    return (
        <View style = {styles.topBar}>
          <TouchableOpacity
              testID="leftController"
              style = {[ styles.leftControl, styles.controls ]} onPress={() => this.prevMonth()}>
            { leftControl }
          </TouchableOpacity>
          <Animated.View style = {[styles.head, { opacity: fade } ]}>
            <Text style = {styles.subtitle}>{ year }</Text>
            <Text style = {styles.title}>{ monthName }</Text>
          </Animated.View>
          <TouchableOpacity
              testID="rightController"
              style = {[ styles.rightControl, styles.controls ]} onPress={() => this.nextMonth()}>
            { rightControl }
          </TouchableOpacity>
        </View>
    )
  }

  renderDatePicker(){
    const { month, year, colors } = this.state;
    const {
      userStyles, minDate, maxDate, maxRange, minRange, mode, onDateChange, format, initialDate, rowPadding, rowHeight,
      highlightToday, locale } = this.props;

    let pickerMode = ['single', 'range', 'both'].indexOf(mode) + 1;
    if(pickerMode === -1) pickerMode = 2;

    return(
      <DatePicker
        initialDate = {initialDate}
        colors = {colors}
        userStyles = {userStyles}
        year = {year}
        locale = {locale}
        onDateChange = {onDateChange}
        mode = {pickerMode}
        format = {format}
        month = {month}
        minDate = {minDate} maxDate = {maxDate}
        minRange = {minRange} maxRange = {maxRange}
        rowHeight = {rowHeight} rowPadding = {rowPadding}
        highlightToday = {highlightToday}
      />
    )
  }

  render(){
    const { fade, styles } = this.state;

    return(
      <View style = {styles.wrapper}>
        { this.renderTopBar() }
        <View style = {styles.calendar}>
          { this.renderDaysOfTheWeek() }
          <Animated.View style = {{ opacity: fade }}>
            { this.renderDatePicker() }
          </Animated.View>
        </View>
      </View>
    )
  }
}

Calendar.defaultProps = {
  locale: 'en',
  format: false,
  userColors: {},
  userStyles: {},
  fadeDuration: 300,
  mode: 'range',
  onDateChange: () => {},
  maxRange: false,
  minRange: false,
  maxDate: false,
  minDate: false,
  initialDate: new Date(),
  leftControl: <Text>{ "<" }</Text>,
  rightControl: <Text>{ ">" }</Text>,
  rowHeight: 30,
  rowPadding: 7,
  highlightToday: true,
};

Calendar.propTypes = {
  locale: PropTypes.string,
  format: PropTypes.oneOfType([ PropTypes.string, PropTypes.oneOf([false]) ]),
  userColors: PropTypes.object,
  userStyles: PropTypes.object,
  fadeDuration: PropTypes.number,
  mode: PropTypes.oneOf([ 'both', 'single', 'range' ]),
  onDateChange: PropTypes.func,
  maxRange: PropTypes.oneOfType([ PropTypes.number, PropTypes.oneOf([false]) ]),
  minRange: PropTypes.oneOfType([ PropTypes.number, PropTypes.oneOf([false]) ]),
  maxDate: PropTypes.oneOfType([ PropTypes.instanceOf(Date), PropTypes.oneOf([false]) ]),
  minDate: PropTypes.oneOfType([ PropTypes.instanceOf(Date), PropTypes.oneOf([false]) ]),
  initialDate: PropTypes.instanceOf(Date),
  leftControl: PropTypes.node,
  rightControl: PropTypes.node,
  rowHeight: PropTypes.number,
  rowPadding: PropTypes.number,
  highlightToday: PropTypes.bool,
};

const getStyles = (colors, sizes) => ({
  wrapper: {
    backgroundColor: colors.wrapper,
    paddingBottom: 10,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  topBar: {
    backgroundColor: colors.topBar,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.title
  },
  subtitle: {
    color: colors.subtitle,
    fontSize: 13,
  },
  head: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  dayOfTheWeekWrapper: {
    width: "14.2857142857%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendar: {
    backgroundColor: colors.calendar,
    height: 6 * sizes.rowHeight + sizes.rowPadding * 5,
  },
  daysOfTheWeek: {
    flexDirection: 'row',
    height: 30,
    marginBottom: 7,
  },
  dayOfTheWeek: {
    color: colors.dayOfTheWeek
  },
  controls: {
    flex: 1,
    justifyContent: 'center'
  },
  controlsText: {

  },
  leftControl: {
    paddingLeft: 10,
  },
  rightControl: {
    alignItems: 'flex-end',
    paddingRight: 10,
  }
});

export default Calendar;
