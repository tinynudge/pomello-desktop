/* eslint-disable @typescript-eslint/no-var-requires */
const { createServer, build, createLogger } = require('vite');
const { spawn } = require('child_process');
const electron = require('electron');

const LOG_LEVEL = 'info';

const mode = (process.env.MODE = process.env.MODE || 'development');

const sharedConfig = {
  mode,
  build: {
    watch: {},
  },
  logLevel: LOG_LEVEL,
};

const stderrFilterPatterns = [/ExtensionLoadWarning/];

const createMainWatcher = ({ config }) => {
  const protocol = config.server.https ? 'https:' : 'http:';
  const host = config.server.host || 'localhost';
  const port = config.server.port;

  process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}`;

  const logger = createLogger(LOG_LEVEL, {
    prefix: '[main]',
  });

  let spawnProcess = null;

  build({
    ...sharedConfig,
    configFile: './packages/main/vite.config.js',
    plugins: [
      {
        name: 'start-main',
        writeBundle() {
          if (spawnProcess !== null) {
            spawnProcess.off('exit', process.exit);
            spawnProcess.kill('SIGINT');
            spawnProcess = null;
          }

          spawnProcess = spawn(`${electron}`, ['.']);

          spawnProcess.stdout.on('data', data => {
            const formattedData = data.toString().trim();

            if (formattedData) {
              logger.warn(data.toString(), { timestamp: true });
            }
          });

          spawnProcess.stderr.on('data', datum => {
            const formattedData = datum.toString().trim();
            if (!formattedData) {
              return;
            }

            const shouldIgnore = stderrFilterPatterns.some(error => error.test(formattedData));
            if (shouldIgnore) {
              return;
            }

            logger.error(formattedData, { timestamp: true });
          });

          // Stops the watch script when the application has been quit
          spawnProcess.on('exit', process.exit);
        },
      },
    ],
  });
};

const createPreloadWatcher = ({ ws }) =>
  build({
    ...sharedConfig,
    configFile: 'packages/preload/vite.config.js',
    plugins: [
      {
        name: 'start-preload',
        writeBundle() {
          ws.send({ type: 'full-reload' });
        },
      },
    ],
  });

const startDevServer = async () => {
  try {
    const devServer = await createServer({
      ...sharedConfig,
      configFile: './packages/renderer/vite.config.js',
    });

    await devServer.listen();

    createMainWatcher(devServer);
    createPreloadWatcher(devServer);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

startDevServer();
