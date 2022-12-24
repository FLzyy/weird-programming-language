import {readFile} from 'node:fs/promises';
import {ReadLine, createInterface} from 'node:readline';

// Read wpl file
const plain = await readFile('src/index.wpl', 'utf-8');
const data = plain.trim().split(/\n/);
const meta = data[0].split(':');
const maxLength = parseInt(meta[0]);
const strict = meta[1].toLowerCase();

// Initialize array.
const main = new Array(maxLength);
let MAIN_LEN = main.length;
for (let i = 0; i < MAIN_LEN; ++i) main[i] = 0;

let currentIndex = 0;

const input = (rl: ReadLine, q: string): Promise<string> => {
  return new Promise(resolve => {
    rl.question(q, input => resolve(input));
  });
};

const logic = {
  '+': function (i: number) {
    main[currentIndex]++;
    return i;
  },
  '-': function (i: number) {
    main[currentIndex]--;
    return i;
  },
  '<': function (i: number) {
    if (currentIndex - 1 <= 0) {
      if (strict === 'true') {
        throw new Error('UNDERFLOW');
      } else if (strict === 'false') {
        currentIndex = MAIN_LEN - 1;
      }
    } else {
      currentIndex--;
    }
    return i;
  },
  '>': function (i: number) {
    if (currentIndex + 1 >= MAIN_LEN) {
      if (strict === 'true') {
        throw new Error('OVERFLOW');
      } else if (strict === 'false') {
        main[currentIndex + 1] = 0;
        MAIN_LEN++;
        currentIndex++;
      }
    } else {
      currentIndex++;
    }
    return i;
  },
  '.': function (i: number) {
    const newMain = main
      .reduceRight((acc, item) => {
        if (item === 0 && acc.length === 0) {
          return acc;
        }
        return acc.concat(item);
      }, [])
      .reverse();

    console.log(String.fromCharCode(...newMain));
    return i;
  },
  _: function (i: number) {
    const newMain = main
      .reduceRight((acc, item) => {
        if (item === 0 && acc.length === 0) {
          return acc;
        }
        return acc.concat(item);
      }, [])
      .reverse();

    console.log(newMain);
    return i;
  },
  '~': function (i: number) {
    console.log(main);
    return i;
  },
  '[': function (i: number, str: string, b: number) {
    let tempI = i + 1;
    let tempLastI = tempI;
    for (let z = tempI; z <= str.length; z++) {
      if (str[z] === ']') {
        tempLastI = z;
        break;
      }
    }
    const slicedsp = str.slice(tempI, tempLastI).split(':');
    const REPEAT_AMOUNT = parseInt(slicedsp[0]) - 1;
    tempI++;
    const LOGIC_SYMBOL = slicedsp[1];

    let z = 0;
    do {
      z++;
      if (logic[LOGIC_SYMBOL as keyof typeof logic]) {
        logic[LOGIC_SYMBOL as keyof typeof logic](z, str, b);
      }
    } while (z < REPEAT_AMOUNT);
    tempI++;

    return tempI;
  },
  ',': async function (i: number, _: string, z: number) {
    const readLine = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await input(
      readLine,
      `INPUT: current index: ${currentIndex} row: ${i} col: ${z}: `
    );
    main[currentIndex] += parseInt(answer);
    readLine.close();
    return i;
  },
};

const DATA_LEN = data.length;

for (let i = 1; i < DATA_LEN; i++) {
  const STRING = data[i];
  const STRING_LEN = STRING.length;
  if (!STRING.startsWith('#')) {
    for (let z = 0; z < STRING_LEN; z++) {
      if (logic[STRING[z] as keyof typeof logic]) {
        z = await logic[STRING[z] as keyof typeof logic](z, STRING, i);
      }
    }
  }
}
