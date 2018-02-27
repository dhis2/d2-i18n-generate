#!/usr/bin/env node

var ArgumentParser = require('argparse').ArgumentParser;
var argsParser = new ArgumentParser({
  version: '1.0.0',
  addHelp: true,
  description:
    'Generate translation strings from pot files to i18n compatible JSON'
});

argsParser.addArgument(['-p', '--path'], {
  dest: 'path',
  defaultValue: './i18n/',
  help: 'directory path to find .po/.pot files and convert to JSON.'
});

argsParser.addArgument(['-o', '--output'], {
  dest: 'output',
  defaultValue: './src/locales/',
  help: 'output directory to place converted JSON files.'
});

var args = argsParser.parseArgs();

var fs = require('fs');
var path = require('path');
var conv = require('i18next-conv');

try {
  var src = path.normalize(args.path);
  var stat = fs.lstatSync(src);

  if (!stat.isDirectory()) {
    console.error(src, 'is not a directory.');
    process.exit(1);
  }
} catch (e) {
  console.error(src, 'does not exist.');
  process.exit(1);
}

// clean-up and create destination dir.
var dst = path.normalize(args.output);

// clean-up
var rimraf = require('rimraf');
rimraf.sync(dst);

// creation
var dstPath = dst.split(path.sep);
var targetPath = '';
for (var i = 0; i < dstPath.length; i += 1) {
  targetPath = path.join(targetPath, dstPath[i]);
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
  }
}

// conversion
var files = fs.readdirSync(src);
for (var i = 0; i < files.length; i += 1) {
  var fileName = files[i];
  var parts = fileName.split('.');
  var lang = parts[0];
  var ext = parts[1];

  if (ext === 'po' || ext === 'pot') {
    console.log('fileName', fileName, 'ext', ext);
    var filePath = path.join(src, fileName);
    var contents = fs.readFileSync(filePath, 'utf-8');
    conv.gettextToI18next(lang, contents).then(
      function(lang, json) {
        var target = path.join(dst, lang);
        if (!fs.existsSync(target)) {
          fs.mkdirSync(target);
        }

        var translationsPath = path.join(target, 'translations.json');
        fs.writeFileSync(translationsPath, json, { encoding: 'utf-8' });

      }.bind(this, lang)
    );
  }
}

// TODO: generate language loading code from template
var langs = [];
for (var i = 0; i < files.length; i += 1) {
  langs.push(files[i].split('.')[0]);
}

console.log('langs');
console.log(langs);
