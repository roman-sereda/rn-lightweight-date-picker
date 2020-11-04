import React, { PureComponent, Component } from 'react';
import { Text, View, Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import DatePicker from './DatePicker';
import helper from '../helper';

const rotateValues = {
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg'],
};

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
    const { titleFadeDuration } = this.props;

    return new Promise((resolve, reject) => {
      Animated.timing(this.state.fade, { toValue: value, duration: titleFadeDuration / 2 })
      .start(() => {
        resolve();
      });
    });
  }

  switchMonth(date, callback){
    this.state.fade.setValue(0);

    this.fade(90).then(() => {
      if(callback) callback();
      this.setState({ month: date.month, year: date.year }, () => {
        this.fade(0);
      });
    })
  }

  next(callback){
    const { month, year } = this.state;
    this.switchMonth(helper.addMonth({ month, year }), callback);
  }

  prev(callback){
    const { month, year } = this.state;
    this.switchMonth(helper.subtractMonth({ month, year }), callback);
  }

  renderTopBar(){
    const { year, month, monthNames, styles, fade } = this.state;

    let monthName = monthNames[month];

    return (
      <View style = {styles.topBar}>
        <Animated.View style = {[styles.head, { transform: [{ rotateX: this.state.fade.interpolate(rotateValues) }] }]}>
          <Text style = {styles.subtitle}>{ year }</Text>
          <Text style = {styles.title}>{ monthName }</Text>
        </Animated.View>
      </View>
    );
  }

  renderTopBarWithControls(){
    const { year, month, monthNames, fade, styles } = this.state;
    const { leftControl, rightControl } = this.props;

    let monthName = monthNames[month];

    return (
        <View style = {styles.topBar}>
          <TouchableOpacity
              testID="leftController"
              style = {[ styles.leftControl, styles.controls ]} onPress={() => this.prev()}>
            { leftControl }
          </TouchableOpacity>
          <Animated.View style = {[styles.head, { transform: [{ rotateX: fade.interpolate(rotateValues) }] }]}>
            <Text style = {styles.subtitle}>{ year }</Text>
            <Text style = {styles.title}>{ monthName }</Text>
          </Animated.View>
          <TouchableOpacity
              testID="rightController"
              style = {[ styles.rightControl, styles.controls ]} onPress={() => this.next()}>
            { rightControl }
          </TouchableOpacity>
        </View>
    );
  }

  renderDatePicker(){
    const { month, year, colors } = this.state;
    const {
      userStyles, minDate, maxDate, maxRange, minRange, mode, onDateChange, format, initialDate, rowPadding, rowHeight,
      highlightToday, locale, swipeDuration, start, end } = this.props;

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
        swipeDuration = {swipeDuration}
        month = {month}
        minDate = {minDate} maxDate = {maxDate}
        minRange = {minRange} maxRange = {maxRange}
        rowHeight = {rowHeight} rowPadding = {rowPadding}
        highlightToday = {highlightToday}
        start={start}
        end={end}
        next = {(c) => this.next(c)}
        prev = {(c) => this.prev(c)}
      />
    )
  }

  render(){
    const { styles } = this.state;
    const { showControls, rowHeight, rowPadding } = this.props;

    return(
      <View style = {[ styles.wrapper ]}>
        { showControls ? this.renderTopBarWithControls() : this.renderTopBar() }
        <View style = {[ styles.calendar ]}>
          { this.renderDaysOfTheWeek() }
          <View style={{}}>
            { this.renderDatePicker() }
          </View>
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
  swipeDuration: 300,
  titleFadeDuration: 300,
  mode: 'range',
  onDateChange: () => {},
  maxRange: false,
  minRange: false,
  maxDate: false,
  minDate: false,
  initialDate: new Date(),
  showControls: false,
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
  titleFadeDuration: PropTypes.number,
  swipeDuration: PropTypes.number,
  mode: PropTypes.oneOf([ 'both', 'single', 'range' ]),
  onDateChange: PropTypes.func,
  maxRange: PropTypes.oneOfType([ PropTypes.number, PropTypes.oneOf([false]) ]),
  minRange: PropTypes.oneOfType([ PropTypes.number, PropTypes.oneOf([false]) ]),
  maxDate: PropTypes.oneOfType([ PropTypes.instanceOf(Date), PropTypes.oneOf([false]) ]),
  minDate: PropTypes.oneOfType([ PropTypes.instanceOf(Date), PropTypes.oneOf([false]) ]),
  initialDate: PropTypes.instanceOf(Date),
  showControls: PropTypes.bool,
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
    justifyContent: 'space-around',
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
    overflow: 'hidden',
    height: 7 * sizes.rowHeight + sizes.rowPadding * 6,
  },
  daysOfTheWeek: {
    flexDirection: 'row',
    height: sizes.rowHeight,
    marginBottom: sizes.rowPadding,
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
