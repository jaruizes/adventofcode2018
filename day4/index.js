const readline = require('readline');
const fs = require('fs');
const moment = require('moment');

const log = [];
let logObjets = [];

const sortLog = () => {
    // year-month-day hour:minute
    const regex = new RegExp(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2})/);
    log.sort((a, b) => {
        const dateAStr = regex.exec(a)[0];
        const dateBStr = regex.exec(b)[0];
        const dateA = moment(dateAStr, 'YYYY-MM-DD HH:mm');
        const dateB = moment(dateBStr, 'YYYY-MM-DD HH:mm');
        return dateA.diff(dateB);

    });
};

const writeFileSort = () => {
    const file = fs.createWriteStream('output.txt');

    file.on('error', function(err) { /* error handling */ });
    log.forEach(function(v) { file.write(v + '\n'); });
    file.end();
};

const getAsleepTime = () => {
    let asleepMinute = 0;
    let wakeMinute = 0;
    const idRegexp = new RegExp(/#\d*/);
    const minutesRegExp = new RegExp(/:\d{2}/);
    const fallsasleepRegExp = new RegExp(/falls asleep/);
    const wakesupRegExp = new RegExp(/wakes up/);
    let currentId = '';
    let currentLogObj;


    log.forEach((item) => {
        const id = idRegexp.exec(item);
        if (id && id[0] && id[0] !== currentId) {
            currentId = id[0];
            currentLogObj = logObjets.find((log) => {
                return log.id === currentId;
            });

            if (!currentLogObj) {
                currentLogObj = {
                    "id": currentId,
                    "sleepMinutes": [],
                    "total": 0
                };

                logObjets.push(currentLogObj);
            }
        }

        if (fallsasleepRegExp.test(item)) {
            asleepMinute = parseInt(minutesRegExp.exec(item)[0].replace(':', ''));
        }

        if (wakesupRegExp.test(item)) {
            wakeMinute = parseInt(minutesRegExp.exec(item)[0].replace(':', ''));

            for (let i = asleepMinute; i < wakeMinute; i++) {
                currentLogObj.total++;
                currentLogObj.sleepMinutes.push(parseInt(i));
            }
        }

    });
};

const getGuardMostAsleep = () => {
    let max = -1;
    let id = '';

    let objects = [];
    logObjets.forEach((item) => {
        if (item.sleepMinutes.length > max) {
            max = item.sleepMinutes.length;
            id = item.id;
        }

        objects.push({
            "id": item.id,
            "minutes": item.sleepMinutes.length
        });
    });

    const guard = logObjets.find((item) => {
        return item.id = id;
    });

    // objects.forEach((o) => {
    //     console.log(`Id: ${o.id} / minutes: ${o.minutes}`);
    // });

    return guard;
};

const getMaxMinuteAsleep = (guard) => {
    const minutesAsleep = guard.sleepMinutes;
    minutesAsleep.sort((a,b) => {
        return parseInt(a) - parseInt(b);
    });

    let ocurrences = 0;
    let potentialMinute = -1;
    let currentMinute = -1;
    let max = 0;

    let occurrencesObj = [];

    minutesAsleep.forEach((minute, index) => {
        if (currentMinute === minute) {
            ocurrences++;
        }

        if (currentMinute !== minute || index === minutesAsleep.length - 1) {
            if (max <= ocurrences) {
                max = ocurrences;
                potentialMinute = currentMinute;
            }

            occurrencesObj.push({
                "minute": currentMinute,
                "occurs": ocurrences
            });

            currentMinute = minute;
            ocurrences = 1;
        }
    });

    occurrencesObj.forEach((o) => {
       //console.log(`Minute: ${o.minute} / occurs: ${o.occurs}`);
    });

    return parseInt(potentialMinute);
};

const readEntries = () => {
    // [1518-05-27 00:42] falls asleep
    const rl = readline.createInterface({
        input: fs.createReadStream('input.txt'),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        log.push(line);
    });

    rl.on('close', () => {
        sortLog();
        writeFileSort();
        getAsleepTime();
        const maxSleepGuard = getGuardMostAsleep();
        const minuteMostAsleep = getMaxMinuteAsleep(maxSleepGuard);

        console.log('ID: ' + maxSleepGuard.id + ' / minute: ' + minuteMostAsleep);
        const res = parseInt(maxSleepGuard.id.replace('#', '')) * minuteMostAsleep;
        console.log('Res: ' + res);

    });
};


readEntries();
