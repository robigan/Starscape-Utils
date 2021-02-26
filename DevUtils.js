/* eslint-disable */
const CheckForErrorsInLinks = async () => {
    const Data = require("./src/Links.json");
    const Duplicates = new Array();
    Data.forEach((val) => {
        if (Array.isArray(val) && val.length === 2 && val[0] !== val[1]) {
            const results = Data.filter((val2) => compareArrays(val2, val));
            results.length >= 2 && !(Duplicates.find(msg => msg === `Duplicate link: ${results[0]}`)) ? Duplicates.push(`Duplicate link: ${results[0]}`) : undefined;
        } else if (val.length !== 2) {
            Duplicates.push(`Invalid link: ${val}`);
        } else if (val[0] === val[1]) {
            Duplicates.push(`Useless link: ${val}`);
        }
    });
    Duplicates.length >= 1 ? Duplicates.forEach(msg => console.error(msg)) : console.error("Links data seeems to be fine");
}

const compareArrays = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        (a.every((val, index) => val === b[index]) ||
        a.reverse().every((val, index) => val === b[index]));
}

CheckForErrorsInLinks();