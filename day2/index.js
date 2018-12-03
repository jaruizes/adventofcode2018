const readline = require('readline');
const fs = require('fs');

let twoTotal = 0;
let threeTotal = 0;

const readFilePart1 = () => {
    const rl = readline.createInterface({
        input: fs.createReadStream('input.txt'),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        const result = processLine(line);
        twoTotal = twoTotal + result[0];
        threeTotal = threeTotal + result[1];
    });

    rl.on('close', () => {
        console.log('Two founds: ' + twoTotal);
        console.log('Three founds: ' + threeTotal);
        console.log('Checksum: ' + (twoTotal * threeTotal));
    });
};

const readFilePart2 = () => {
    const rl = readline.createInterface({
        input: fs.createReadStream('input.txt'),
        crlfDelay: Infinity
    });

    let arrayIDs = [];
    rl.on('line', (line) => {
        arrayIDs.push(line);
    });

    rl.on('close', () => {
        const foundID = findIDsWithOneLetterDistinct(arrayIDs);
        console.log('foundID: ' + foundID);
    });
};

const processLine = (line) => {
    let twoFound = 0;
    let threeFound = 0;
    let result = [0,0];
    let count = 1;

    let array = line.split('').sort();
    array.reduce((lastItem, item, index) => {
        if (lastItem === item) {
            count++;
        }

        if (lastItem !== item || index === (array.length - 1)) {
            if (count === 2) {
                result[0] = 1;
                twoFound++;
            } else if (count === 3) {
                result[1] = 1;
                threeFound++;
            }
            count = 1;
        }

        return item;
    },'');

    return result;
};

const findIDsWithOneLetterDistinct = (array) => {
    let foundID = '';
    array.some((parentItem) => {
        let found = array.find((item) => {
            foundID = findOneDifference(parentItem, item);
            return foundID;
        });

        return found;
    });

    return foundID;
};

const findOneDifference = (stringA, stringB) => {
    const stringAArray = stringA.split('');
    const stringBArray = stringB.split('');

    let differences = [];
    let count = 0;
    for (let i=0; i < stringAArray.length; i++) {
        if (stringAArray[i] === stringBArray[i]) {
            differences.push(stringAArray[i])
        } else {
            count++;
        }
    }

    if (count === 1) {
        return differences.join('');
    }

    return '';
};

readFilePart1();
readFilePart2();
