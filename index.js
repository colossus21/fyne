#!/usr/bin/env node
var wf = require("./write_files")
var yargs = require('yargs/yargs')
var helper = require('yargs/helpers')
var argv = yargs(helper.hideBin(process.argv))
    .command('template [model] [file]', 'eg. ohho model} SchemaFileName.json', function(yargs) {
        yargs
            .positional('file', {describe: 'schema file', default: 'schema.json'})
            .positional('model', {describe: 'model name', default: 'Test'})
    }, function(argv) {
        if (argv.verbose) {}
        wf.makeModelFile(argv.model, argv.file)
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .argv
