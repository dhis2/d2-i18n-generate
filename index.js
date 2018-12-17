#!/usr/bin/env node

var ArgumentParser = require('argparse').ArgumentParser;
var argsParser = new ArgumentParser({
  version: '1.0.0',
  addHelp: true,
  description:
    'Generate JSON files compatible with i18next from po/pot files.'
});

argsParser.addArgument(['-p', '--path'], {
  dest: 'path',
  defaultValue: './i18n/',
  help: 'directory path to find .po/.pot files and convert to JSON.'
});

argsParser.addArgument(['-o', '--output'], {
  dest: 'output',
  defaultValue: './src/locales/',
  help: 'Output directory to place converted JSON files.'
});

argsParser.addArgument(['-n', '--namespace'], {
  required: true,
  dest: 'namespace',
  help: 'Namespace for app. locale separation.'
});

var args = argsParser.parseArgs();

var generate = require('./src/generate');

generate(args);
