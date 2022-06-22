import moment from 'moment';

import {
  getAvailableYears,
  isNextMonthAvailable,
  isPreviousMonthAvailable,
  getNextBestDate,
} from './Datepicker.utils';

describe('isNextMonthAvailable', () => {
  it('should return true when the last available month is after the currently selected month', () => {
    const maxDate = moment.utc('2020-03-03');
    const selectedDay = moment.utc('2020-02-02');
    const isAvailable = isNextMonthAvailable(maxDate, selectedDay);
    expect(isAvailable).toBe(true);
  });

  it('should return false when the last available month is the same as the currently selected month', () => {
    const maxDate = moment.utc('2020-02-02');
    const selectedDay = moment.utc('2020-02-02');
    const isAvailable = isNextMonthAvailable(maxDate, selectedDay);
    expect(isAvailable).toBe(false);
  });

  it('should return false when the last available month is before the currently selected month', () => {
    const maxDate = moment.utc('2020-01-01');
    const selectedDay = moment.utc('2020-02-02');
    const isAvailable = isNextMonthAvailable(maxDate, selectedDay);
    expect(isAvailable).toBe(false);
  });
});

describe('isPreviousMonthAvailable', () => {
  it('should return true when the first available month is before the currently selected month', () => {
    const minDate = moment.utc('2020-01-01');
    const selectedDay = moment.utc('2020-02-02');
    const isAvailable = isPreviousMonthAvailable(minDate, selectedDay);
    expect(isAvailable).toBe(true);
  });

  it('should return false when the first available month is the same as the currently selected month', () => {
    const minDate = moment.utc('2020-02-02');
    const selectedDay = moment.utc('2020-02-02');
    const isAvailable = isPreviousMonthAvailable(minDate, selectedDay);
    expect(isAvailable).toBe(false);
  });

  it('should return false when the first available month is after the currently selected month', () => {
    const minDate = moment.utc('2020-03-03');
    const selectedDay = moment.utc('2020-02-02');
    const isAvailable = isPreviousMonthAvailable(minDate, selectedDay);
    expect(isAvailable).toBe(false);
  });
});

describe('getAvailableYears', () => {
  it('should return an array of available years', () => {
    const fromDate = moment.utc('2019-01-01');
    const toDate = moment.utc('2021-01-01');

    const availableYears = getAvailableYears(fromDate, toDate);
    expect(availableYears).toEqual([2019, 2020, 2021]);
  });

  it('should return only the current year when min and max date are in the same year', () => {
    const fromDate = moment.utc('2019-01-01');
    const toDate = moment.utc('2019-01-01');

    const availableYears = getAvailableYears(fromDate, toDate);
    expect(availableYears).toEqual([2019]);
  });

  it('should return an empty array when from date is after toDate', () => {
    const fromDate = moment.utc('2022-01-01');
    const toDate = moment.utc('2021-01-01');

    const availableYears = getAvailableYears(fromDate, toDate);
    expect(availableYears).toEqual([]);
  });
});

const selectedDayMock = moment.utc('2021-09-18');

function fetchDatesMock(date) {
  const month = date.get('month');
  if (month === 8) {
    return [
      {
        date: moment.utc('2021-09-29'),
        cloudCoverPercent: 78,
      },
      {
        date: moment.utc('2021-09-25'),
        cloudCoverPercent: 66,
      },
      {
        date: moment.utc('2021-09-11'),
        cloudCoverPercent: 33,
      },
      {
        date: moment.utc('2021-09-02'),
        cloudCoverPercent: 32,
      },
    ];
  } else if (month === 7) {
    return [
      {
        date: moment.utc('2021-08-22'),
        cloudCoverPercent: 100,
      },
      {
        date: moment.utc('2021-08-14'),
        cloudCoverPercent: 99,
      },
      {
        date: moment.utc('2021-08-13'),
        cloudCoverPercent: 100,
      },
    ];
  } else if (month === 6) {
    return [
      {
        date: moment.utc('2021-07-29'),
        cloudCoverPercent: 42,
      },
      {
        date: moment.utc('2021-07-27'),
        cloudCoverPercent: 1,
      },
      {
        date: moment.utc('2021-07-16'),
        cloudCoverPercent: 0,
      },
      {
        date: moment.utc('2021-07-06'),
        cloudCoverPercent: 18,
      },
    ];
  } else if (month === 9) {
    return [
      {
        date: moment.utc('2021-10-05'),
        cloudCoverPercent: 90,
      },
      {
        date: moment.utc('2021-10-17'),
        cloudCoverPercent: 3,
      },
      {
        date: moment.utc('2021-10-26'),
        cloudCoverPercent: 89,
      },
    ];
  } else if (month === 10) {
    return [];
  }
}

test.each([
  ['next', 100, 2, moment.utc('2021-09-25')],
  ['prev', 100, 2, moment.utc('2021-09-11')],
  ['next', 5, 2, moment.utc('2021-10-17')],
  ['next', 70, 2, moment.utc('2021-09-25')],
  ['next', 0, 2, moment.utc('2021-10-17')],
  ['prev', 5, 2, moment.utc('2021-07-27')],
  ['prev', 70, 2, moment.utc('2021-09-11')],
  ['prev', 0, 2, moment.utc('2021-07-16')],
  ['prev', 0, 1, moment.utc('2021-09-02')],
])('Test getNextBestDate method', async (direction, maxCC, limitMonths, expectedDate) => {
  const newDate = await getNextBestDate({
    selectedDay: selectedDayMock,
    direction: direction,
    maxCC: maxCC,
    fetchDates: fetchDatesMock,
    limitMonths: limitMonths,
  });
  const datesEqual = newDate.isSame(expectedDate);
  expect(datesEqual).toBe(true);
});
