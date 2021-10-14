import { colors } from "./constants";

let getMonthSize = (year, month) => new Date(year, month + 1, 0).getDate();
let firstDayOfMonth = (year, month) => new Date(year, month, 1);

// this method returns arrays of integers with dates for calendar page
// how do we get this?

const getMonth = (year, month) => {
  let prevMonth = subtractMonth({ year, month });
  prevMonth.size = getMonthSize(prevMonth.year, prevMonth.month);

  let nextMonth = addMonth({ year, month });
  nextMonth.size = getMonthSize(nextMonth.year, nextMonth.month);

  let monthSize = getMonthSize(year, month),
    data = [];
  let firstDay = firstDayOfMonth(year, month),
    firstDayWeekIndex = firstDay.getDay();
  let weeksCount = Math.ceil((monthSize + firstDayWeekIndex) / 7);

  let getDate = (index) => {
    if (index < firstDayWeekIndex) {
      return {
        year: prevMonth.year,
        month: prevMonth.month,
        day: prevMonth.size - (firstDayWeekIndex - index) + 1,
      };
    } else if (index >= monthSize + firstDayWeekIndex) {
      return {
        year: nextMonth.year,
        month: nextMonth.month,
        day: index - monthSize - firstDayWeekIndex + 1,
      };
    }
    return { year, month, day: index - firstDayWeekIndex + 1 };
  };

  for (let week = 0; week < weeksCount; week++) {
    data.push([]);
    for (let day = 0; day < 7; day++) data[week].push(getDate(week * 7 + day));
  }
  return data;
};

const subtractMonth = (_date) => {
  let date = _date;

  date.month--;

  if (date.month < 0) {
    date.month = 11;
    date.year--;
  }

  return date;
};

const addMonth = (_date) => {
  let date = _date;

  date.month++;

  if (date.month > 11) {
    date.month = 0;
    date.year++;
  }

  return date;
};

const getDayNames = (locale) => {
  // some random Sunday date
  let date = new Date(1567951846289),
    days = [];

  for (let i = 0; i < 7; i += 1) {
    days.push(date.toLocaleString(locale, { weekday: "short" }));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

const getMonthNames = (locale) => {
  // some random January date
  let date = new Date(1546874284089),
    months = [];

  for (let i = 0; i < 12; i++) {
    months.push(date.toLocaleString(locale, { month: "long" }));
    date.setMonth(date.getMonth() + 1);
  }

  return months;
};

const mergeColors = (_newColors = {}) => {
  let defaultColors = Object.assign({}, colors);

  Object.keys(_newColors).forEach((key) => {
    if (defaultColors[key]) {
      defaultColors[key] = _newColors[key];
    }
  });

  return defaultColors;
};

const mergeStyles = (_styles, _newStyles, userColors, sizes = {}) => {
  let styles = _styles(userColors, sizes);

  Object.keys(_newStyles).forEach((key) => {
    if (styles[key]) {
      styles[key] = Object.assign({}, styles[key], _newStyles[key]);
    }
  });

  return styles;
};

export default {
  mergeStyles,
  mergeColors,
  getMonthNames,
  getDayNames,
  subtractMonth,
  getMonth,
  addMonth,
};
