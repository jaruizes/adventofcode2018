const readline = require('readline');
const fs = require('fs');

const idboard = [];
const board = new Set();
const overlapsArray = new Set();

const setBoard = () => {

    const rl = readline.createInterface({
        input: fs.createReadStream('input.txt'),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        // #1 @ 604,670: 22x16
        const lineArray = line.split(' ');
        const id = lineArray[0];

        const postition = lineArray[2].replace(':','').split(',');
        const x = parseInt(postition[0]);
        const y = parseInt(postition[1]);

        const size = lineArray[3].split('x');
        const sizeX = parseInt(size[0]);
        const sizeY = parseInt(size[1]);

        let coordinates = new Set();
        let overlapPartial = false;
        for (let i=1; i <= sizeX; i++) {
            for (let j=1; j <= sizeY; j++) {
                const coord = `(${x+i}, ${y+j})`;
                coordinates.add(coord);
                overlapPartial = addCoordinate(id, coord) || overlapPartial;
            }
        }

        const obj = {
            "id": id,
            "coordinates": coordinates,
            "overlap": overlapPartial
        };

        idboard.push(obj);
    });

    rl.on('close', () => {
        const idNotOverlap = idboard.filter(item => !item.overlap);
        console.log(`Overlaps: ${overlapsArray.size}`);
        console.log(`idNotOverlap: ${idNotOverlap[0].id}`);
    });
};

const addCoordinate = (id, coord) => {
    let isOverlap = false;
    if (board.has(coord)) {
        overlapsArray.add(coord);
        isOverlap = true;
        searchClaimsAffected(coord);
    }
    board.add(coord);

    return isOverlap;
};

const searchClaimsAffected = (coord) => {
    const notOverlapped = idboard.filter(item => !item.overlap);
    notOverlapped.forEach((item) => {
        if (item.coordinates.has(coord)) {
            item.overlap = true;
        }
    });
};

setBoard();
