#! /usr/src/env node
const chalk = require('chalk')
const fs = require("fs");
const path = require("path");
const fsExtra = require('fs-extra');
const loadIniFile = require('read-ini-file')
const handlebars = require('handlebars');
const zipDir = require('zip-dir');

const validIdioms = ['surmiran'];

function pack() {
    const idiom = process.argv[3];

    if (idiom === undefined) {
        console.error(chalk.red.bold("\nYou didn't specify an idiom!\n"));
        return;
    }

    if (validIdioms.includes(idiom)) {
        packIdiom(idiom);
    } else {
        console.error(chalk.red.bold("\nYou didn't specify a valid idiom!\n"));
    }
}

function packIdiom(idiom) {
    const configPath = path.join(__dirname, '..', 'config', idiom + '.ini');
    const config = loadIniFile.sync(configPath);

    let version = fs.readFileSync('dictionaries/' + config.language_code + '/version.txt').toString();
    version = version.replace(/(\r\n|\n|\r)/gm, ""); // remove newlines,...
    console.log(version)

    createFirefoxXpi(config, version);
}

function createFirefoxXpi(config, version) {
    cleanOutputDir();

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

    zipTempFolderToFile('build/' + config.language_code, 'firefox_' + config.language_code + '_' +version + '.xpi');
}

function cleanOutputDir() {
    const directory = "tmp";
    fsExtra.emptyDirSync(directory);
}

function copyFolder(sourceDir, destDir) {
    if (!fs.existsSync(destDir)){
        fs.mkdirSync(destDir, { recursive: true });
    }
    fsExtra.copySync(sourceDir, destDir, undefined);
}

function zipTempFolderToFile(destDir, fileName) {
    if (!fs.existsSync(destDir)){
        fs.mkdirSync(destDir, { recursive: true });
    }
    zipDir('tmp/', { saveTo: destDir + '/' + fileName }, function (err, buffer) {

    });
}

pack();




