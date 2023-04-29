#! /usr/bin/env node

'use strict';

const fs = require('fs');

console.log(getAllFiles('.', []));

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
    return file.endsWith('git') || file.endsWith('node_modules') || file.endsWith('idea');
}
