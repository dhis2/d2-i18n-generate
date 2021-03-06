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

argsParser.addArgument(['-l', '--lib'], {
  dest: 'lib',
  action: 'storeTrue',
  help: 'Generate strings for library'
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

// po/pot files list
var files = fs.readdirSync(src);

// generate locales
var handlebars = require('handlebars');
var langs = [];
for (var i = 0; i < files.length; i += 1) {
  langs.push(files[i].split('.')[0]);
}

const langToLocale = {
  ar: 'ar',
  bn: 'bn',
  es: 'es',
  fa: 'fa',
  fr: 'fr',
  he: 'he',
  it: 'it',
  jp: 'jp',
  lo: 'lo',
  nb: 'nb',
  nl: 'nl',
  pl: 'pl',
  pt: 'pt',
  ru: 'ru',
  tg: 'tg',
  sv: 'sv',
  uk: 'uk',
  ur: 'ur',
  vi: 'vi',
  zh: 'zh-cn'
};
const locales = langs
  .filter(function filterOutEn(lang) {
    return lang !== 'en';
  })
  .map(function mapLangToLocale(lang) {
    return langToLocale[lang];
  })
  .filter(locale => locale)

var localesHBS = fs.readFileSync(path.join(__dirname, 'templates', 'locales.hbs'), 'utf8');
var localesTemplate = handlebars.compile(localesHBS);
var localesJS = path.join(dst, 'index.js');

var localesContext = {
  langs: langs,
  locales: locales,
  namespace: args.namespace,
  standalone: !args.lib
};
fs.writeFileSync(localesJS, localesTemplate(localesContext));

// conversion
console.log('\n> Generating translations .JSON files');
for (var i = 0; i < files.length; i += 1) {
  var fileName = files[i];
  var parts = fileName.split('.');
  var lang = parts[0];
  var ext = parts[1];

  if (ext === 'po' || ext === 'pot') {
    var filePath = path.join(src, fileName);
    var contents = fs.readFileSync(filePath, 'utf8');
    conv.gettextToI18next(lang, contents).then(
      function(lang, json) {
        var target = path.join(dst, lang);
        if (!fs.existsSync(target)) {
          fs.mkdirSync(target);
        }

        var translationsPath = path.join(target, 'translations.json');
        fs.writeFileSync(translationsPath, json, { encoding: 'utf8' });
        console.log('> writing JSON translation file for language: ', lang);
      }.bind(this, lang)
    );
  }
}
