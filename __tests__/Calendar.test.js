import Calendar from '../src/components/Calendar';
import helper from '../src/helper';
import { render, fireEvent } from 'react-native-testing-library';
import React from 'react';
import { Text } from 'react-native';

jest.useFakeTimers();

let months = helper.getMonthNames('en');

describe("Calendar with default props should", () => {

    const { debug, update, getByText, getByTestId, queryByText } = render(<Calendar showControls />);
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    it("render days of the week", () => {
        let days = helper.getDayNames('en');

        days.forEach(day => {
            getByText(day);
        });
    });

    it("render month name", () => {
        let month = months[currentMonth];
        getByText(month);
    });

    it("render year", () => {
        getByText(currentYear.toString());
    });

    it("switch month after pressing next month", async () => {

        fireEvent.press(getByTestId("rightController"));

        jest.runAllTimers();

        expect(queryByText(months[currentMonth])).toBeNull();
        currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        getByText(months[currentMonth]);
    });

    it("switch month after pressing previous month", async () => {

        fireEvent.press(getByTestId("leftController"));

        jest.runAllTimers();

        expect(queryByText(months[currentMonth])).toBeNull();
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        getByText(months[currentMonth]);
    })
});

describe("Calendar with specified props should", () => {

    it("render specified date", () => {
        const { getByText } = render(<Calendar showControls initialDate = { new Date(2018,1,5) } />);

        getByText("2018");
        getByText(months[1]);
    });

    it("render specified controllers", () => {
        const { getByText } = render(<Calendar showControls leftControl = {<Text>ZZ</Text>} rightControl = {<Text>XX</Text>} />);

        getByText("ZZ");
        getByText("XX");
    });

    it("render correct localized date of weeks and month with specified locale", () => {
        const { getByText } = render(<Calendar locale = "ru" />);

        let russianMonth = helper.getMonthNames('ru');
        let russianDaysOfWeek = helper.getDayNames('ru');

        russianDaysOfWeek.forEach(day => {
            getByText(day);
        });

        getByText(russianMonth[new Date().getMonth()]);
    });

    it("have working callback", () => {

        let returned = "";

        const { getByText, getAllByText } = render(<Calendar
            nitialDate = {new Date(2018,1,1)}
            onDateChange = {(data) => { returned = data } }
        />);

        fireEvent.press(getAllByText("15")[0]);
        expect(returned.start instanceof Date).toBe(true);

        fireEvent.press(getAllByText("25")[0]);
        expect(returned.start instanceof Date).toBe(true);
        expect(returned.end instanceof Date).toBe(true);
    });

    it("return formatted data in callback", () => {

        let returned = "";

        const { getByText, getAllByText } = render(<Calendar
            initialDate = {new Date(2018,1,1)}
            format = "mm-dd-yyyy"
            onDateChange = {(data) => { returned = data } }
        />);

        fireEvent.press(getAllByText("15")[0]);
        expect(returned.start).toBe("01-15-2018");

        fireEvent.press(getAllByText("25")[0]);
        expect(returned.start).toBe("01-15-2018");
        expect(returned.end).toBe("01-25-2018");
    });

    it("have working callback in single mode", () => {

        let returned = "";

        const { getByText, getAllByText } = render(<Calendar
            initialDate = {new Date(2018,1,1)}
            format = "mm-dd-yyyy"
            mode = "single"
            userColors = {{ title: 'red' }}
            onDateChange = {(data) => { returned = data } }
        />);

        fireEvent.press(getAllByText("15")[0]);
        expect(returned).toBe("01-15-2018");
    });

    it("be updated when props changed", () => {
        let { update, getByText } = render(<Calendar locale = "en" userStyles = {{ title: { color: 'red' }}} />);
        update(<Calendar locale = "ru" userStyles = {{ title: { color: 'blue' }}} />);

        let russianMonth = helper.getMonthNames('ru');
        getByText(russianMonth[new Date().getMonth()]);
    });
});


