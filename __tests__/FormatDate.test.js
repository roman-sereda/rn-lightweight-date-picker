import formatDate from '../src/FormatDate';

describe('Format en data', () => {

    it(" should return correct data", () => {

        let date = new Date(2009, 1, 9);

        let formats = {
            mn: 'F',
            m: '2',
            mm: '02',
            mmm: 'Feb',
            mmmm: 'February',
            yyyy: '2009',
            yy: '09',
            d: '9',
            dd: '09',
            wn: 'M',
            w: 'Mon',
            ww: 'Monday'
        };

        let keys = Object.keys(formats);

        for(let i = 0; i < keys.length; i++){
            expect(formatDate(date, keys[i], 'en')).toBe(formats[keys[i]]);
        }
    });

    it('should format only keywords', () => {

        expect(formatDate(new Date(), 'salo dn', 'en')).toBe('salo dn');
    });

    it('should capitalize words and remove dots', () => {
        expect(formatDate(new Date(2019, 0, 1), 'mmmm', 'ru')).toBe('Январь');
    })
});
