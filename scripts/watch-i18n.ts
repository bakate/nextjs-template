import * as chokidar from "chokidar";
import { initializeTranslationState, updateTranslationsFile, logger } from "./translation-utils";

function createTranslationWatcher() {
  const state = initializeTranslationState();

  function startWatching() {
    logger.info("\x1b[34m[Translation Watcher]\x1b[0m Started watching translation files");

    const watcher = chokidar.watch(state.featuresDir, {
      persistent: true,
      ignoreInitial: true,
    });

    watcher
      .on("change", (filePath) => {
        if (filePath.endsWith(".json")) {
          updateTranslationsFile(state, filePath);
        }
      })
      .on("error", (error) => logger.error(`\x1b[31m❌\x1b[0m Watcher error: ${error}`));
  }

  return { startWatching };
}

// Start the watcher
const watcher = createTranslationWatcher();
watcher.startWatching();
