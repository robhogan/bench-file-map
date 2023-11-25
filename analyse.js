const fs = require("fs");
const nullthrows = require("nullthrows");

const outfile = nullthrows(process.argv[2]);
const results = JSON.parse(
  "[" + fs.readFileSync(outfile, "utf8").slice(0, -2) + "]",
);

const groupOn = ["threads", "async", "pqueue", "concurrency"];

const table = {};
for (const result of results) {
  const label = groupOn.map((group) => `${group}=${result[group]}`).join(",");
  if (table[label] == null) {
    table[label] = [];
  }
  table[label].push(result);
}

console.table(
  Object.fromEntries(
    Object.entries(table).map(([group, results]) => {
      const l = results.length;
      const avg = (key) =>
        results.reduce((sum, result) => sum + result[key], 0) / l;

      return [
        group,
        {
          overall: avg("buildTime"),
          applyFile: avg("applyFileDeltaDuration"),
          samples: l,
        },
      ];
    }),
  ),
);
