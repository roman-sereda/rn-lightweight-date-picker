# React Native Light DatePicker
<a href="https://codeclimate.com/github/roman-sereda/react-native-light-datepicker/test_coverage"><img src="https://api.codeclimate.com/v1/badges/7c85ed35de65972f2131/test_coverage" /></a> <a href="https://codeclimate.com/github/roman-sereda/react-native-light-datepicker/maintainability"><img src="https://api.codeclimate.com/v1/badges/7c85ed35de65972f2131/maintainability" /></a> [![Build Status](https://travis-ci.org/roman-sereda/react-native-light-datepicker.svg?branch=develop)](https://travis-ci.org/roman-sereda/react-native-light-datepicker)
## Example
```javascript
  render(){
    let currentDate = new Date();
    
    return(
      <Calendar
        locale = {"ru"}
        mode = {"range"}
        userColors = {{
          
        }}
        minDate = {currentDate}
        maxRange = {10}
        fadeDuration = {500}
      />)
  }
```


## Properties
| Prop | Type | Default | Desc |
:------------ |:---------------| :-----| :-----|
| **`locale`** | `String` | Device language | Calendar localization. If not set the device language will be used. |
| **`onDateChange`** | `Function` | (date) => {} | Will be called every time user select or unselect date. Format: { start: `date object`, `string` or `false`, end: `date object`, `string` or `false` }. If the `format` is specified, it will return date string in this format, if not - `date object`. If date not selected will return `false`. |
| **`format`** | `String` or `false` | false | Example: `"dddd, mmmm dS, yyyy, h:MM:ss TT"` |
| **`userColors`** | `Object`| {} | Override colors. See below for details. |
| **`userStyles`** | `Object`| {} | Override styles. See below for details. |
| **`minRange`** | `Number` or `false` | false | Minimal avaliable size of selected range. |
| **`maxRange`** | `Number` or `false` | false |  Maximal avaliable size of selected range. |
| **`minDate`** | `Date` or `false` | false | Minimal avaliable date to be selected. . |
| **`maxDate`** | `Date` or `false` | false | Maximal avaliable date to be selected. |
| **`mode`** | `String` | `both` | `single`, `range` or `both`. Give opportunity to select only one date, range, or both. |
| **`fadeDuration`** | `Number` | 300 | Month switching duration in ms. |
| **`initialDate`** | `Date` | new Date() | This date will be shown in calendar on load. Default is Current Time. |
| **`leftControl`** | `Component` | `<Text>{ "<" }</Text>` | Specified left control. |
| **`RightControl`** | `Component` | `<Text>{ ">" }</Text>` | Specified right control. |
| **`highlightToday`**| `Bool` | true | Specified if current date should be highlighted. |

## Date Format
| Prop | Type | Default | Desc | Default | Desc |
:------------ |:---------------| :-----| :-----|:-----| :-----|
| dn | T | mn | S | yy | 19 |
| d | 1-31| m | 1-12 | yyyy | 2019 |
| dd | 01-31| mm | 01-12 |||
| ddd | Thu | mmm | Sep |||
| dddd | Thursday| mmmm | September |||




## Styles
If you want to change only colors of datepicker, you can use userColors property

If you need  to customize styles, you can use userStyles property. UserStyles has higher priority than userColors. 
