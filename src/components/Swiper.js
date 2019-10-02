import React, { Component } from 'react';
import { PanResponder, Dimensions, Animated } from 'react-native';
import DatePicker from './DatePicker';
import helper from '../helper';

const marginValues = {
  inputRange: [0, 2],
  outputRange: ['0%', '-200%'],
};

export default class extends Component {
  constructor(props){
    super(props);

    let swiping = false;
    const width = Dimensions.get('window').width;
    const minDistToChangeMonth = width / 3;

    this.startPosition = 1;
    this.position = new Animated.Value(1);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => swiping = true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;

        if(swiping){
          if(dx > minDistToChangeMonth){
            this.animate(0, () => { this.props.prev(); });
          } else if(dx < -minDistToChangeMonth / 3){
            this.animate(2, () => { this.props.next(); });
          }else{
            this.animate(this.startPosition, () => {});
          }
        }

        swiping = false;
      },
      onPanResponderMove: (evt, gestureState) => {
        const { vx, dx } = gestureState;

        if(swiping){
          if(vx > 2){
            this.animate(0, () => { this.props.prev(); });
            swiping = false;
          }else if(vx < -2){
            this.animate(2, () => { this.props.next(); });
            swiping = false;
          }else{
            this.position.setValue(this.startPosition - dx / width);
          }
        }
      },
    });
  }

  animate(value, callback){
    Animated.timing(
      this.position,
      {
        toValue: value,
        duration: 400,
      },
    ).start(() => {
      callback();
      this.position.setValue(this.startPosition);
    });
  }

  render(){
    let nextDatePicker = helper.addMonth({ month: this.props.month, year: this.props.year });
    let prevDatePicker = helper.subtractMonth({ month: this.props.month, year: this.props.year });

    return(
      <Animated.View style={[{ flexDirection: 'row', width: '300%' }, { marginLeft: this.position.interpolate(marginValues) }]} {...this.panResponder.panHandlers}>
        <DatePicker {...this.props} month={prevDatePicker.month} year={prevDatePicker.year} colors={{ dayText: 'red' }} />
        <DatePicker {...this.props} colors={{ dayText: 'red' }} />
        <DatePicker {...this.props} month={nextDatePicker.month} year={nextDatePicker.year} colors={{ dayText: 'red' }} />
      </Animated.View>
    );
  }
}
