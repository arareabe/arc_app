const fs = require('fs');
const readline = require('readline');
const { once } = require('events');

async function analyzeArcFile() {
  const fileStream = fs.createReadStream('interview-data.log.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const timestamps = [];
  const msgCounts = {};

  rl.on('line', (line) => {
    const match = line.match(/\((\d+\.\d+)\) (\d+)#/);
    if (match) {
      const timestamp = parseFloat(match[1]);
      const msgId = match[2];
      timestamps.push(timestamp);
      msgCounts[msgId] = (msgCounts[msgId] || 0) + 1;
    }
  });

  await once(rl, 'close');

  const duration = Math.max(...timestamps) - Math.min(...timestamps);

  console.log("A. Duration in seconds of data report:");
  console.log(duration.toFixed());

  const msgFreqs = Object.entries(msgCounts).map(([msgId, count]) => ({
    msgId,
    freq: count / duration
  }));

  msgFreqs.sort((a, b) => b.freq - a.freq);

  console.log("\nB. Top 5 msg IDs in descending order of freq:");
  for (let i = 0; i < Math.min(5, msgFreqs.length); i++) {
    const { msgId, freq } = msgFreqs[i];
    console.log(`${msgId}: ${freq.toFixed(1)}`);
  }
}

analyzeArcFile();
