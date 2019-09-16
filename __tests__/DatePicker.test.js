import Calendar from '../src/components/Calendar';
import DatePicker from '../src/components/DatePicker';
import React from 'react';
import helper from '../src/helper';
import { render, fireEvent } from 'react-native-testing-library';

jest.useFakeTimers();

describe("'DatePicker' should ", () => {

    const leftController = () => (queryByText("selectedRight"));
    const rightController = () => (queryByText("selectedRight"));
    const date = (num) => (getByText(num));
    const randomUnavailable = () => (getAllByTestId('unavailable')[0]);
    const all = (testID) => (getAllByTestId(testID));
    const isNull = (testID) => (queryByText(testID));

    let { debug, queryByText, getByText, getAllByTestId, getByTestId } = render(<Calendar />);
    let weeks = helper.getMonth(new Date().getFullYear(), new Date().getMonth());

    it("highlight sundays", () => {
        let sundays = weeks.length;
        expect(getAllByTestId("weekend").length).toEqual(sundays);
    });

    it("highlight selected dates and range between them", () => {

        fireEvent.press(date("15"));
        expect(all("selected").length).toEqual(1);
        expect(isNull("ranged")).toBeNull();

        fireEvent.press(date("25"));
        leftController();
        rightController();
        expect(all("ranged").length).toEqual(9);
    });

    it("remove selected dates if clicked on unavailable date", () => {
        fireEvent.press(date("14"));
        fireEvent.press(randomUnavailable());

        expect(leftController()).toBeNull();
        expect(rightController()).toBeNull();
    });

    it("not show leftSelect when switch to next month", () => {
        fireEvent.press(date("15"));
        fireEvent.press(getByTestId("rightController"));
        jest.runAllTimers();

        fireEvent.press(date("15"));

        expect(leftController()).toBeNull();
        rightController();
    })

    it("not show rightSelect when switch to prev month", () => {
        fireEvent.press(date("15"));
        fireEvent.press(getByTestId("rightController"));
        jest.runAllTimers();

        fireEvent.press(date("15"));

        fireEvent.press(getByTestId("leftController"));
        jest.runAllTimers();

        expect(rightController()).toBeNull();
        leftController();
    });

    it("not show any selectors on next month", () => {
        fireEvent.press(date("15"));
        fireEvent.press(date("25"));

        fireEvent.press(getByTestId("rightController"));
        jest.runAllTimers();

        expect(rightController()).toBeNull();
        expect(leftController()).toBeNull();
    });
});

describe("Ranges should work correctly", () => {

    const leftController = () => (queryByText("selectedRight"));
    const rightController = () => (queryByText("selectedRight"));
    const date = (num) => (getByText(num));
    const randomUnavailable = () => (getAllByTestId('unavailable')[0]);
    const all = (testID) => (getAllByTestId(testID));
    const isNull = (testID) => (queryByText(testID));

    let { debug, queryByText, getByText, getAllByTestId } = render(
        <Calendar
            initialDate = { new Date(2019,1,1) }
            minRange = {1}
            maxRange = {5}
            minDate = {new Date(2019,1,9)}
            maxDate = {new Date(2019,1,20)}
        />
    );

    fireEvent.press(date("10"));
    fireEvent.press(date("17"));
    expect(rightController()).toBeNull();
    expect(leftController()).toBeNull();

    fireEvent.press(date("10"));
    fireEvent.press(date("12"));
    rightController()
    leftController()

    fireEvent.press(date("8"));
    expect(rightController()).toBeNull();
    expect(leftController()).toBeNull();

    fireEvent.press(date("25"));
    expect(rightController()).toBeNull();
    expect(leftController()).toBeNull();
});
