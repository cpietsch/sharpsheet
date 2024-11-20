#!/usr/bin/env node

// https://github.com/cpietsch/sharpsheet
// by Christopher Pietsch 2020

import sharpsheet from '../src/sharpsheet.js'; // Adjust the path as needed

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .usage("Usage: sharpsheet \"/path/to/images/*.png\" [options]")
  .command("\"/path/to/images/*.png\"", "Glob to input images")
  .example(
    "sharpsheet \"/path/to/images/*.png\"",
    "run on png's"
  )
  .example(
    "sharpsheet \"/path/to/images/**/*.(png|jpg)\"",
    "run on png's and jpg's in all subfolder"
  )
  .demandCommand(1)
  .describe("sheetDimension", "Dimension for generated spritesheets")
  .describe("outputPath", "Path to output folder")
  .describe("outputFormat", "Output image format")
  .describe("outputQuality", "Output image quality (0-100)")
  .default("outputPath", "./sprites")
  .argv;

(async function main() {
  const options = {
    outputFormat: argv.outputFormat,
    sheetDimension: argv.sheetDimension,
    outputQuality: argv.outputQuality,
  };

  const input = argv._[0];
  console.log("\nlooking for images at ", input);

  const spriter = await sharpsheet(input, argv.outputPath, options);

  console.log("done");
})();
