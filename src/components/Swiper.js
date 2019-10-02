import React, { Component } from 'react';
import { PanResponder, Dimensions, Animated } from 'react-native';
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
    const touchThreshold = 10;

    this.startPosition = 1;
    this.position = new Animated.Value(1);

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const {dx, dy} = gestureState;
        return (Math.abs(dx) > touchThreshold) || (Math.abs(dy) > touchThreshold);
      },
      onPanResponderGrant: (evt, gestureState) => { console.log('start'); swiping = true },
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
    return(
      <Animated.View style={{ flexDirection: 'row', width: '300%', marginLeft: this.position.interpolate(marginValues) }} {...this.panResponder.panHandlers}>
        { this.props.children }
      </Animated.View>
    );
  }
}
