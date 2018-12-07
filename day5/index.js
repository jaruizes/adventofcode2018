const readline = require('readline');
const fs = require('fs');

const readEntries = () => {
    const rl = readline.createInterface({
        input: fs.createReadStream('input2.txt'),
        crlfDelay: Infinity
    });

    let input = '';
    rl.on('line', (line) => {
        input = line;
    });

    rl.on('close', () => {
        part1(input);
    });
};

const part1 = (input) => {
    const units = getFinalUnits(input);
    console.log('Res 1: ' + units);
};

const part2 = (input) => {
    const reactorSet = getPotentialReactors(input);
    let results = [];
    reactorSet.forEach((unit) => {
        const inputProcessed = input.replace(new RegExp(unit,'g'),'').replace(new RegExp(unit.toLowerCase(),'g'),'');
        const value = getFinalUnits(inputProcessed);
        results.push(value);
    });

    let min = results[0];
    results.forEach((res) => {
        if (res <= min) {
            min = res;
        }
    });

    console.log('Res 2: ' + min);
};

const getPotentialReactors = (input) => {
    const reactorSet = new Set();
    const inputArr = input.split('');

    inputArr.forEach((unit) => {
       reactorSet.add(unit.toUpperCase());
    });

    return reactorSet;
};

const simulateReactions = (reactorSet, input) => {

};

const getFinalUnits = (input) => {
    let res = '';
    let repeat = true;
    while (repeat) {
        res = processReactions(input);
        repeat = res !== input;
        input = res;
    }

    return res.length;
};

const processReactions = (input) => {
    // 32 between lowercase and uppercase (9562)
    const inputArr = input.split('');

    // dabAcCaCBAcCcaDA
    for (let i=0; i<inputArr.length-1; i++) {
        const a = inputArr[i].charCodeAt(0);
        const b = inputArr[i+1].charCodeAt(0);

        if (Math.abs(a-b) === 32) {
            const reactionStart = i;
            const reactionEnds = i + 2;
            return inputArr.slice(0, reactionStart).join('').concat(inputArr.slice(reactionEnds).join(''));
        }
    }

    return input;
};

readEntries();
