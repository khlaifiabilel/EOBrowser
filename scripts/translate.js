import path from 'path';
import fs from 'fs';
import util from 'util';

import { SUPPORTED_LANGUAGES } from '../src/LanguageSelector/langUtils';

const exec = util.promisify(require('child_process').exec);
const readdir = util.promisify(fs.readdir);

//joining path of directory
const appDir = process.cwd();
const translationsPath = path.join(appDir, 'public/translations');

const filesListInDir = async (dir) => {
  try {
    return await readdir(dir);
  } catch (err) {
    console.error(err);
  }
};

// //unique list of all languages that were initialized
const initializedLanguages = async () => {
  const files = await filesListInDir(translationsPath);
  return [...new Set(files.map((fileName) => fileName.split('.')[0]))];
};

// creates .po files for each supported translation if these files were not created before
const initializeTranslations = async () => {
  //unique list of all languages that have been initialized before running this function
  const foundInitializedLanguages = await initializedLanguages();
  // "npx ttag update  src/translations/en.po src && npx ttag po2json src/translations/en.po > src/translations/en.po.json"
  const initAllPromises = SUPPORTED_LANGUAGES.map(async (lang) => {
    //language has not been initialzed
    if (!foundInitializedLanguages.includes(lang.langCode)) {
      try {
        const filePath = path.join(translationsPath, lang.langCode);
        await exec(`npx ttag init ${lang.langCode} ${filePath}.po`);
        console.log(`${filePath}.po created`);
      } catch (err) {
        console.error(err);
      }
    }
  });

  return await Promise.all(initAllPromises);
};

// goes though all supported languages and updates its po and po.json files
const updateTranslations = async () => {
  const updateAllPromise = SUPPORTED_LANGUAGES.map(async (lang) => {
    try {
      const filePath = path.join(translationsPath, lang.langCode);
      await exec(
        `npx ttag update --extractLocation=never --foldLength=76 ${filePath}.po src && npx ttag po2json ${filePath}.po > ${filePath}.po.json`,
      );
      console.log(`${filePath}.po updated`);
    } catch (err) {
      console.error(err);
    }
  });

  return await Promise.all(updateAllPromise);
};

const main = async () => {
  await initializeTranslations();
  await updateTranslations();
};

main();
