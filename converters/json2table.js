const fs = require('fs');

const jsonPath = process.argv[2];
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

data.sort((a, b) => b.predicted_per_second - a.predicted_per_second);

let table = '| model | token/sec |\n';
table += '|:---|---:|\n';

data.forEach(item => {
  const model = item.model || '';
  const predictedPerSecond = item.predicted_per_second || '';
  const truncatedPerSecond = predictedPerSecond !== '' ? Math.floor(predictedPerSecond * 100) / 100 : '';
  table += `| ${model} | ${truncatedPerSecond} |\n`;
});

console.log(table);
