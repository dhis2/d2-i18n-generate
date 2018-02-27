#!/usr/bin/env node

var ArgumentParser = require('argparse').ArgumentParser;
var argsParser = new ArgumentParser({
    version: '1.0.0',
    addHelp: true,
    description: 'Generate translation strings from pot files to i18n compatible JSON'
})

argsParser.addArgument(
    ['-p', '--path'],
    {
        dest: 'path',
        defaultValue: './i18n/',
        help: 'directory path to find .po/.pot files and convert to JSON.'
    }
);

argsParser.addArgument(
    ['-o', '--output'],
    {
        dest: 'output',
        defaultValue: './src/locales/',
        help: 'output directory to place converted JSON files.'
    }
);

var args = argsParser.parseArgs();

var fs = require('fs');
var path = require('path');


try {
    var dirPath = path.normalize(args.path)
    var stat = fs.lstatSync(dirPath)

    if (!stat.isDirectory()) {
        console.error(dirPath, 'is not a directory.');
        process.exit(1);
    }
} catch (e) {
    console.error(dirPath, 'does not exist.');
    process.exit(1);
}


// TODO: read directory, po/pot files
// TODO: convert po/pot files to JSON
// TODO: generate language loading code from template