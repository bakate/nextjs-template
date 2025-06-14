import {
  LOCALES,
  Locale,
  TranslationError,
  logger,
  findTranslationFiles,
  calculateFileHash,
  extractNamespace,
} from "./translation-utils";

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, basename } from "path";

const CACHE_FILE = ".translation-cache.json";

type Messages = {
  [K in Locale]: {
    [key: string]: Record<string, unknown>;
  };
};

type CacheEntry = {
  hash: string;
  content: Record<string, unknown>;
};

type LocaleCache = {
  [namespace: string]: CacheEntry;
};

const loadExistingCache = (messagesDir: string): Record<Locale, LocaleCache> => {
  const cacheFile = join(messagesDir, CACHE_FILE);

  if (!existsSync(cacheFile)) {
    return LOCALES.reduce(
      (acc, locale) => {
        acc[locale] = {};
        return acc;
      },
      {} as Record<Locale, LocaleCache>
    );
  }

  try {
    return JSON.parse(readFileSync(cacheFile, "utf-8"));
  } catch (error) {
    logger.error(`Failed to load cache: ${error}`);
    return LOCALES.reduce(
      (acc, locale) => {
        acc[locale] = {};
        return acc;
      },
      {} as Record<Locale, LocaleCache>
    );
  }
};

const saveCache = (messagesDir: string, cache: Record<Locale, LocaleCache>) => {
  const cacheFile = join(messagesDir, CACHE_FILE);
  writeFileSync(cacheFile, JSON.stringify(cache, null, 2), "utf-8");
};

const mergeTranslations = (
  files: string[],
  existingCache: Record<Locale, LocaleCache>
): {
  messages: Messages;
  updatedNamespaces: Set<string>;
  updatedLocales: Set<Locale>;
  totalFiles: number;
  unchangedFiles: number;
} => {
  const messages: Messages = LOCALES.reduce((acc: Messages, locale: Locale) => {
    acc[locale] = {};
    return acc;
  }, {} as Messages);

  const updatedNamespaces = new Set<string>();
  const updatedLocales = new Set<Locale>();
  let totalFiles = 0;
  let unchangedFiles = 0;

  for (const file of files) {
    try {
      totalFiles++;
      const content = JSON.parse(readFileSync(file, "utf-8"));
      const filename = basename(file);
      const filenameWithoutExtension = filename.replace(".json", "").toLowerCase();

      const locale = LOCALES.find((l) => filenameWithoutExtension === l);
      if (!locale) {
        throw new TranslationError(`Could not determine locale for file: ${file}`);
      }

      const namespace = extractNamespace(file);
      const fileHash = calculateFileHash(file);

      // Check if the file has changed
      const cachedEntry = existingCache[locale][namespace];
      if (!cachedEntry || cachedEntry.hash !== fileHash) {
        messages[locale][namespace] = content;
        updatedNamespaces.add(namespace);
        updatedLocales.add(locale);

        // Update cache
        existingCache[locale][namespace] = {
          hash: fileHash,
          content,
        };
      } else {
        // Use cached content
        messages[locale][namespace] = cachedEntry.content;
        unchangedFiles++;
      }
    } catch (error) {
      throw new TranslationError(`Failed to process file ${file}: ${error}`);
    }
  }

  return { messages, updatedNamespaces, updatedLocales, totalFiles, unchangedFiles };
};

const saveTranslations = (messages: Messages, updatedLocales: Set<Locale>): void => {
  const messagesDir = join(process.cwd(), "messages");

  if (!existsSync(messagesDir)) {
    throw new TranslationError("messages directory does not exist");
  }

  for (const locale of updatedLocales) {
    const filePath = join(messagesDir, `${locale}.json`);

    // Load existing content
    const existingContent = existsSync(filePath) ? JSON.parse(readFileSync(filePath, "utf-8")) : {};

    // Merge only updated namespaces
    const mergedContent = {
      ...existingContent,
      ...messages[locale],
    };
    // check if there are actual differences before writing
    const existingContentString = JSON.stringify(existingContent, null, 2);
    const mergedContentString = JSON.stringify(mergedContent, null, 2);
    if (existingContentString !== mergedContentString) {
      logger.info(
        `\x1b[32m[i18n Processing]:\x1b[0m Saving updated translations for locale: ${locale}`
      );
      writeFileSync(filePath, mergedContentString, "utf-8");
    }
  }
};

const main = () => {
  try {
    const featuresDir = join(process.cwd(), "src", "features");
    const messagesDir = join(process.cwd(), "messages");

    logger.time("\x1b[32m[i18n Processing]:\x1b[0m Finished processing i18n in");

    if (!existsSync(featuresDir)) {
      throw new TranslationError("src/features directory does not exist");
    }

    // Find translation files
    const files = findTranslationFiles(featuresDir);

    if (files.length === 0) {
      throw new TranslationError("No translation files found");
    }

    // Load existing cache
    const existingCache = loadExistingCache(messagesDir);

    // Merge translations with caching
    const { messages, updatedNamespaces, totalFiles, unchangedFiles, updatedLocales } =
      mergeTranslations(files, existingCache);

    // Save updated translations
    if (updatedLocales.size > 0) {
      saveTranslations(messages, updatedLocales);
      // Save updated cache
      saveCache(messagesDir, existingCache);
    } else {
      logger.info("No changes detected in any locale, skipping file writes");
    }

    // Detailed logging
    logger.info(`Total translation files: ${totalFiles}`);
    logger.info(`Unchanged files: ${unchangedFiles}`);

    if (updatedNamespaces.size > 0) {
      logger.info(`Updated namespaces: ${Array.from(updatedNamespaces).join(", ")}`);
    } else {
      logger.info("No changes detected in translation files");
    }

    logger.timeEnd("\x1b[32m[i18n Processing]:\x1b[0m Finished processing i18n in");
    process.exit(0);
  } catch (error) {
    if (error instanceof TranslationError) {
      logger.error(error.message);
    } else {
      logger.error(`An unexpected error occurred: ${error}`);
    }
    process.exit(1);
  }
};

main();
