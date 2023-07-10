#! /usr/src/env node
const chalk = require('chalk')
const fs = require("fs");
const path = require("path");
const fsExtra = require('fs-extra');
const loadIniFile = require('read-ini-file')
const handlebars = require('handlebars');
const zipDir = require('zip-dir');

const validIdioms = ['surmiran', 'sutsilv'];

async function pack() {
    const idiom = process.argv[3];

    if (idiom === undefined) {
        console.error(chalk.red.bold("\nYou didn't specify an idiom!\n"));
        return;
    }

    if (validIdioms.includes(idiom)) {
        await packIdiom(idiom);
    } else {
        console.error(chalk.red.bold("\nYou didn't specify a valid idiom!\n"));
    }
}

async function packIdiom(idiom) {
    const configPath = path.join(__dirname, '..', 'config', idiom + '.ini');
    const config = loadIniFile.sync(configPath);

    let version = fs.readFileSync('dictionaries/' + config.language_code + '/' + config.language_code + '_version.txt').toString();
    version = version.replace(/(\r\n|\n|\r)/gm, ""); // remove newlines,...
    console.log(version)

    await createFirefoxXpi(config, version);
    await createLibreofficeOxt(config, version);
    await createWebsiteStructure(config, version);
}

async function createFirefoxXpi(config, version) {
    cleanTempDir();

    const ver = version.split('-');
    version = ver[0] + 'build' + ver[1].replace('.', '')

    const manifestTemplate = fs.readFileSync('templates/firefox/manifest.json');
    const manifestHandlebars = handlebars.compile(manifestTemplate.toString());
    fs.writeFileSync('tmp/manifest.json', manifestHandlebars({
        language_code: config.language_code,
        id: config.firefox.id,
        version: version,
        name: config.firefox.name
    }));

    copyFolder('dictionaries/' + config.language_code, 'tmp/dictionaries');

    await zipTempFolderToFile('build/' + config.language_code, 'firefox_' + config.language_code + '_' +version + '.xpi');
}

async function createLibreofficeOxt(config, version) {
    cleanTempDir();

    const descriptionTemplate = fs.readFileSync('templates/libreoffice/description.xml');
    const descriptionHandlebars = handlebars.compile(descriptionTemplate.toString());
    fs.writeFileSync('tmp/description.xml', descriptionHandlebars({
        language_code: config.language_code,
        id: config.libreoffice.id,
        version: version,
        description_en: config.libreoffice.description_en,
        description_rm: config.libreoffice.description_rm,
        description_de: config.libreoffice.description_de,
    }));

    const dictionariesTemplate = fs.readFileSync('templates/libreoffice/dictionaries.xcu');
    const dictionariesHandlebars = handlebars.compile(dictionariesTemplate.toString());
    fs.writeFileSync('tmp/dictionaries.xcu', dictionariesHandlebars({
        language_code: config.language_code,
    }));

    copyFolder('templates/libreoffice/META-INF/', 'tmp/META-INF');

    copyFolder('dictionaries/' + config.language_code, 'tmp/dictionaries');

    await zipTempFolderToFile('build/' + config.language_code, 'libreoffice_' + config.language_code + '_' +version + '.oxt');
}

async function createWebsiteStructure(config, version) {
    cleanTempDir();

    copyFolder('dictionaries/' + config.language_code, 'build/web/' + config.language_code);
    copyFolder('dictionaries/' + config.language_code, 'tmp/dictionaries');
    await zipTempFolderToFile('build/web/', config.language_code + '.zip');
}

function cleanTempDir() {
    const directory = "tmp";
    fsExtra.emptyDirSync(directory);
}

function copyFolder(sourceDir, destDir) {
    if (!fs.existsSync(destDir)){
        fs.mkdirSync(destDir, { recursive: true });
    }
    fsExtra.copySync(sourceDir, destDir, undefined);
}

async function zipTempFolderToFile(destDir, fileName) {
    if (!fs.existsSync(destDir)){
        fs.mkdirSync(destDir, { recursive: true });
    }
    await zipDir('tmp/', { saveTo: destDir + '/' + fileName });
}

pack();




