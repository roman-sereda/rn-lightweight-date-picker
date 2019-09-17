const keyWords = /(d{1,4}|m{1,4}|w{1,3}|(yy){1,2})n*/g;

const format = {
    mn: { month: 'narrow' },
    m: { month: 'numeric' },
    mm: { month: '2-digit' },
    mmm: { month: 'short' },
    mmmm: { month: 'long' },
    yy: { year: '2-digit' },
    yyyy: { year: 'numeric' },
    d: { day: 'numeric' },
    dd: { day: '2-digit' },
    wn: { weekday: 'narrow' },
    w: { weekday: 'short' },
    ww: { weekday: 'long' }
};

export default (date, formatString, locale) => {
    return formatString.replace(keyWords, (key) => {
        if(format[key]){
            let replacement = date.toLocaleDateString(locale, format[key]);
            return (replacement.charAt(0).toUpperCase() + replacement.slice(1)).replace(/\.$/, "");
        }

        return key;
    })
}
