import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import helper from "../helper";
import DatesManager from "../DatesManager";

export default class {
  constructor(select, reset) {
    this.select = select;
    this.reset = reset;
  }

  update(userStyles, colors, rowHeight, rowPadding) {
    this.styles = helper.mergeStyles(getStyles, userStyles, colors, {
      rowHeight,
      rowPadding,
    });
  }

  selectedDay(props) {
    let style = {},
      bg = null;

    let params = {
      date: props.date,
      key: props.key,
      testID: "selected",
      style: {},
    };

    if (props.back) {
      if (props.side === "left") {
        style = this.styles.selectedStartBg;
        params.testID = "selectedLeft";
      }
      if (props.side === "right") {
        style = this.styles.selectedEndBg;
        params.testID = "selectedRight";
      }

      bg = <View style={[this.styles.selectedBg, style]} />;
    }

    let date = this.getText(props.date.day, this.styles.selectedText);
    let dayWrapper = (
      <View>
        {bg}
        {this.getCircle(date, this.styles.selected)}
      </View>
    );

    return this.getWrapper(dayWrapper, params);
  }

  rangedDay(props) {
    let day = this.getText(props.date.day, this.styles.rangedText);
    return this.getWrapper(day, {
      date: props.date,
      key: props.key,
      testID: "ranged",
      style: this.styles.ranged,
    });
  }

  unAvailableDay(props) {
    let day = this.getText(props.date.day, this.styles.unavailableText);
    let params = {
      date: props.date,
      key: props.key,
      testID: "unavailable",
      callback: this.reset,
    };
    return this.getWrapper(day, params);
  }

  initialDay(props) {
    let day = this.getText(props.date.day, this.styles.initialDayText);
    let params = {
      date: props.date,
      key: props.key,
      testID: "initial",
      style: this.styles.initialDay,
    };
    return this.getWrapper(day, params);
  }

  regularDay(props) {
    let day = this.getText(
      props.date.day,
      props.isWeekend ? this.styles.weekend : {}
    );
    let params = {
      date: props.date,
      key: props.key,
      testID: props.isWeekend ? "weekend" : "regular",
      style: {},
    };
    return this.getWrapper(day, params);
  }

  getDay(props) {
    if (props.isSelected) return this.selectedDay(props);
    if (props.isRanged) return this.rangedDay(props);
    if (props.isUnavailable) return this.unAvailableDay(props);
    if (props.isInitial) return this.initialDay(props);

    return this.regularDay(props);
  }

  getText(day, style = {}) {
    return <Text style={[this.styles.dayText, style]}>{day}</Text>;
  }

  getWrapper(child, props) {
    return (
      <TouchableOpacity
        underlayColor="white"
        style={[this.styles.day, props.style]}
        onPress={
          props.callback
            ? () => props.callback()
            : () => this.select(props.date)
        }
        testID={props.testID}
        key={props.key}
      >
        {child}
      </TouchableOpacity>
    );
  }

  getCircle(child, style = {}) {
    return <View style={[this.styles.circle, style]}>{child}</View>;
  }

  getDates(props) {
    let datesManager = new DatesManager(props);

    return datesManager.weeks.map((week, weekIndex) => {
      return (
        <View
          style={this.styles.week}
          key={week[0].day + " week" + week[0].month}
        >
          {week.map((date, dayIndex) => {
            let params = datesManager.chooseType(date, dayIndex);
            params.key = date.day + " " + date.month;
            params.date = date;
            return this.getDay(params);
          })}
        </View>
      );
    });
  }
}

const getStyles = (colors, sizes) => ({
  day: {
    width: "14.2857142857%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBg: {
    position: "absolute",
    top: sizes.rowPadding / 2,
    backgroundColor: colors.range,
    width: "50%",
    height: sizes.rowHeight,
  },
  selectedEndBg: {
    right: "50%",
  },
  selectedStartBg: {
    left: "50%",
  },
  circle: {
    width: sizes.rowHeight + sizes.rowPadding,
    height: sizes.rowHeight + sizes.rowPadding,
    borderRadius: (sizes.rowHeight + sizes.rowPadding) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    backgroundColor: colors.selectedDay,
  },
  ranged: {
    backgroundColor: colors.range,
  },
  dayText: {
    color: colors.dayText,
  },
  selectedText: {
    color: colors.selectedDayText,
  },
  weekend: {
    color: colors.weekend,
  },
  rangedText: {
    color: colors.rangeText,
  },
  unavailableText: {
    color: colors.unavailable,
  },
  initialDay: {
    borderBottomColor: colors.initialDay,
    borderBottomWidth: 3,
  },
  initialDayText: {
    borderBottomColor: "red",
    borderBottomWidth: 1,
  },
  week: {
    flexDirection: "row",
    height: sizes.rowHeight,
    marginBottom: sizes.rowPadding,
  },
});
