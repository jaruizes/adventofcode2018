const readline = require('readline');
const fs = require('fs');

let frecuencyTwice = undefined;
let total = 0;
let results = [];

const readFile = () => {
    const rl = readline.createInterface({
        input: fs.createReadStream('input.txt'),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        let value = parseInt(line);
        total = total + value;

        if (!frecuencyTwice) {
            const frecuencyTwiceIndex = results.indexOf(total);
            if (frecuencyTwiceIndex >= 0) {
                frecuencyTwice = results[frecuencyTwiceIndex];
            } else {
                results.push(total);
            }
        }
    });

    rl.on('close', () => {
        console.log(`Total: ${total}`);
        console.log(`firstRepetition: ${frecuencyTwice}`);

        if (!frecuencyTwice) {
            readFile();
        }
    });
};

readFile();
