## Install

```shell
$ npm install --save d2-i18n-generate
```

## Usage

Generate JSON files compatible with i18next from po/pot files.
```shell
$ d2-i18n-generate [-h] [-v] [-p PATH] [-o OUTPUT] -n NAMESPACE

Generate JSON files compatible with i18next from po/pot files.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show version number and exit.
  -p PATH, --path PATH  directory path to find .po/.pot files and convert to 
                        JSON.
  -o OUTPUT, --output OUTPUT
                        Output directory to place converted JSON files.
  -n NAMESPACE, --namespace NAMESPACE
                        Namespace for app. locale separation.
```
