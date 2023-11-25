// @flow

const MetroFileMap = require("metro-file-map").default;
const nullthrows = require("nullthrows");

let startApplyFileDelta;
let applyFileDeltaDuration;
let startInitWorkers;
let initWorkersDuration;

const fileMap = new MetroFileMap({
  rootDir: __dirname,
  roots: [__dirname],
  extensions: ["js"],
  maxWorkers: 9,
  ignorePattern: /__tests__/,
  platforms: ["ios", "android"],
  retainAllFiles: true,
  resetCache: true,
  watch: true,
  useWatchman: false,
  forceNodeFilesystemAPI: true,
  enableWorkerThreads: true,
  perfLoggerFactory: (name) => {
    if (name !== "START_UP") {
      throw new Error("Unexpected request for non-startup logger");
    }
    return {
      point: () => {},
      annotate: () => {},
      end: () => {},
      start: () => {},
      subSpan: () => ({
        // $FlowIgnore
        point: (point) => {
          if (point === "applyFileDelta_process_start") {
            startApplyFileDelta = performance.now();
          }
          if (point === "applyFileDelta_process_end") {
            applyFileDeltaDuration =
              performance.now() - nullthrows(startApplyFileDelta);
          }
          if (point === "initWorkers_start") {
            startInitWorkers = performance.now();
          }
          if (point === "initWorkers_end") {
            initWorkersDuration =
              performance.now() - nullthrows(startInitWorkers);
          }
        },
        annotate: () => {},
        end: () => {},
        start: () => {},
        subSpan: () => {
          throw new Error();
        },
      }),
    };
  },
  healthCheck: {
    enabled: false,
    filePrefix: "healthcheck_",
    interval: 0,
    timeout: 0,
  },
  cacheManagerFactory: () => {
    return {
      async read() {
        return null;
      },
      async write() {},
    };
  },
});

async function main() {
  const startBuild = performance.now();
  const { fileSystem } = await fileMap.build();
  const buildTime = performance.now() - startBuild;
  await fileMap.end();
  const numFiles = fileSystem.getAllFiles().length;
  console.log({
    buildTime,
    numFiles,
    applyFileDeltaDuration,
    initWorkersDuration,
  });
}

main();
