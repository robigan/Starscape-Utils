/* eslint-disable */
const CheckForDuplicatesInLinks = async () => {
    const Data = require("./src/Links.json");
    const Duplicates = new Array();
    Data.forEach((val) => {
        if (Array.isArray(val) && val.length === 2) {
            const results = Data.filter((val2) => compareArrays(val2, val));
            results.length >= 2 && !(Duplicates.find(msg => msg === `Duplicate link: ${results[0]}`)) ? Duplicates.push(`Duplicate link: ${results[0]}`) : undefined;
        }
    });
    Duplicates.forEach(msg => console.error(msg));
}

const compareArrays = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === 2 &&
        b.length === 2 &&
        a.every((val, index) => val === b[index]);
        //a.every(val => b.every(val2 => val === val2));
}

CheckForDuplicatesInLinks();