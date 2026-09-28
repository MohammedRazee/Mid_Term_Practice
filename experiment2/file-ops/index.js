import fs from 'fs';

console.log("--- Reading input.txt ---");
const content = fs.readFileSync('input.txt', 'utf-8');
console.log(content);

fs.writeFileSync('output.txt', content);

fs.appendFileSync('output.txt', '\nThis line was appended by Node.js.');

console.log("--- Final content of output.txt ---");
const finalContent = fs.readFileSync('output.txt', 'utf-8');
console.log(finalContent);