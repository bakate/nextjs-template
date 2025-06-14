import { join, basename } from "path";
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import * as crypto from "crypto";

export const LOCALES = ["fr"] as const;
export type Locale = (typeof LOCALES)[number];

export type TranslationState = {
  messagesDir: string;
  featuresDir: string;
  currentMessages: { [locale in Locale]: Record<string, unknown> };
};

export class TranslationError extends Error {
  constructor(message: string) {
    super(`\x1b[31m❌ [Translation Error]: ${message}\x1b[0m`);
    this.name = "TranslationError";
  }
}

export const logger = {
  info: (message: string) => console.log(`\x1b[32m✓\x1b[0m ${message}`),
  warn: (message: string) => console.log(`\x1b[33m⚠️\x1b[0m ${message}`),
  error: (message: string) => console.error(`\x1b[31m❌\x1b[0m ${message}`),
  time: (message: string) => console.time(message),
  timeEnd: (message: string) => console.timeEnd(message),
};

export function calculateFileHash(filePath: string): string {
  const fileContent = readFileSync(filePath, "utf-8");
  return crypto.createHash("sha1").update(fileContent).digest("hex");
}

export function findTranslationFiles(dir: string): string[] {
  const files: string[] = [];

  const traverseDirectory = (currentDir: string) => {
    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (
        stat.isFile() &&
        item.endsWith(".json") &&
        LOCALES.some((locale) => item.includes(locale))
      ) {
        files.push(fullPath);
      }
    }
  };

  traverseDirectory(dir);
  return files;
}

export function extractNamespace(filePath: string): string {
  const feature = filePath.split("/src/features/")[1]?.split("/")[0];
  if (!feature) {
    throw new TranslationError(`Could not extract feature from path: ${filePath}`);
  }
  return `${feature.charAt(0).toUpperCase() + feature.slice(1)}Feature`;
}

export function initializeTranslationState(): TranslationState {
  const state: TranslationState = {
    messagesDir: join(process.cwd(), "messages"),
    featuresDir: join(process.cwd(), "src", "features"),
    currentMessages: LOCALES.reduce(
      (acc, locale) => {
        acc[locale] = {};
        return acc;
      },
      {} as { [locale in Locale]: Record<string, unknown> }
    ),
  };

  // Load initial translations
  LOCALES.forEach((locale) => {
    const localePath = join(state.messagesDir, `${locale}.json`);
    if (existsSync(localePath)) {
      state.currentMessages[locale] = JSON.parse(readFileSync(localePath, "utf-8"));
    }
  });

  return state;
}

export function updateTranslationsFile(
  state: TranslationState,
  filePath: string,
  options: {
    logUpdates?: boolean;
  } = { logUpdates: true }
): void {
  try {
    const filename = basename(filePath);
    const locale = LOCALES.find((l) => filename.toLowerCase().startsWith(l));

    if (!locale) return;

    const namespace = extractNamespace(filePath);
    if (!namespace) return;

    const content = JSON.parse(readFileSync(filePath, "utf-8"));

    // Update in-memory translations
    state.currentMessages[locale][namespace] = content;

    // Write updated translations
    const outputPath = join(state.messagesDir, `${locale}.json`);
    const existingContent = existsSync(outputPath)
      ? JSON.parse(readFileSync(outputPath, "utf-8"))
      : {};

    const mergedContent = {
      ...existingContent,
      [namespace]: content,
    };

    writeFileSync(outputPath, JSON.stringify(mergedContent, null, 2), "utf-8");

    if (options.logUpdates) {
      logger.info(`Updated translations for ${locale} - ${namespace}`);
    }
  } catch (error) {
    logger.error(`Error updating translations: ${error}`);
  }
}
