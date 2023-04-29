#! /usr/bin/env node

'use strict';

const fs = require('fs');

class Language {
    files = [];

    constructor(type) {
        this.type = type;
    }

    setCounter(counter) {
        this.counter = counter;
    }

    addFile(file) {
        this.files.push(file);
    }

    determinePercent(allLanguages) {
        return (this.counter / allLanguages)
            .toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });
    }

    determinePercentWithoutSymbol(allLanguages) {
        return this.counter / allLanguages;
    }
}

const files = getAllFiles('.', []);
const types = [];
const languages = [];

for (const element of files) {
    const type = element.substring(element.lastIndexOf('.'));
    if (!isIn(types, type.substring(1))) {
        languages.push(new Language(type.substring(1)));
        types.push(type.substring(1));
    }
}

const typeCounter = [];
let allLanguages = 0;
for (let i = 0; i < types.length; i++) {
    typeCounter.push(0);
    for (let j = 0; j < files.length; j++) {
        const type = files[j].substring(files[j].lastIndexOf('.'));
        if (types[i] === type.substring(1)) {
            languages[i].addFile(files[j]);
            allLanguages++;
            typeCounter[i]++;
        }
    }
    languages[i].setCounter(typeCounter[i]);
}

languages.sort((a, b) => {
    return a.determinePercentWithoutSymbol(allLanguages) + b.determinePercentWithoutSymbol(allLanguages);
});

for (let i = 0; i < languages.length; i++) {
    const language = languages[i];
    console.log((i + 1) + ': ' + language.determinePercent(allLanguages) + ': .' + language.type);
}

function isIn(types, type) {
    for (const item of types) {
        if (item === type) {
            return true;
        }
    }
    return false;
}

function getAllFiles(dir, fileList) {
    if (isDirectory(dir)) {
        const files = fs.readdirSync(dir);
        fileList = iterateOverFiles(files, dir, fileList);
        return fileList;
    }
    fileList.push(dir);
    return fileList;
}

function isDirectory(dir) {
    return fs.statSync(dir).isDirectory();
}

function iterateOverFiles(files, dir, fileList) {
    files.forEach((file) => {
        if (!needToBeIgnored(file)) {
            if (isDirectory(dir + '/' + file)) {
                fileList = getAllFiles(dir + '/' + file, fileList);
            } else {
                fileList.push(file);
            }
        }
    });
    return fileList;
}

function needToBeIgnored(file) {
    return file.endsWith('git') || file.endsWith('node_modules') || file.endsWith('idea') || file.endsWith('vscode');
}
