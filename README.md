# sharpsheet
fast node spritesheet generator using sharp and bin packing

## API

```js
const sharpsheet = require("sharpsheet")
// input can be a glob string
const input = "/path/to/images/*.png"
// input can be an array of image paths
const input = ['/path/to/images/1.png', '/path/to/images/2.png', ...]
// defaults
const options = {
  border: 1,
  sheetDimension: 1024,
  sheetBackground: {r: 0, g:0, b: 0, a: 0},
  outputFormat: "png",
  outputQuality: 100,
  outputFilename: "spritesheet.json",
}
const spriter = await sharpsheet(input, outputPath, options);
```

## CLI
install globally via ```npm install -g sharpsheet```
````
Usage: sharpsheet "/path/to/images/*.png" [options]

Commands:
  sharpsheet "/path/to/images/*.png"  Glob to input images

Options:
  --version               Show version number                          [boolean]
  --sheetDimension        Dimension for generated spritesheets   [default: 2048]
  --outputPath            Path to output folder           [default: "./sprites"]
  --outputFormat          Output image format                   [default: "png"]
  --outputQuality         Output image quality (0-100)             [default: 80]
  -h, --help              Show help                                    [boolean]

Examples:
  sharpsheet "/path/to/images/*.png"          run on png's
  sharpsheet                                run on png's and jpg's in all
  "/path/to/images/**/*.(png|jpg)"            subfolder
 ````
