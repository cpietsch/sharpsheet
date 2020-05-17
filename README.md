# sharpsheet
fast node spritesheet generator using sharp and bin packing

## API

```js
const sharpsheet = require("sharpsheet")
// defaults
const options = {
  inputFormat: "png",
  border: 1,
  sheetDimension: 1024,
  sheetBackground: {r: 0, g:0, b: 0, a: 0},
  outputFormat: "png",
  outputQuality: 100,
  outputFilename: "spritesheet.json",
  
}
const spriter = await sharpsheet(inputPath, outputPath, options);
```

## CLI
````
Usage: sharpsheet /path/to/images [options]

Commands:
  sharpsheet /path/to/images  Path to input images

Options:
  --version               Show version number                          [boolean]
  --format                Input image format (can be multiple eg. "jpg|png")
                                                                [default: "png"]
  --spritesheetDimension  Dimension for generated spritesheets   [default: 2048]
  --outputPath            Path to output folder           [default: "./sprites"]
  --outputFormat          Output image format                   [default: "png"]
  --outputQuality         Output image quality (0-100)             [default: 80]
  -h, --help              Show help                                    [boolean]

Examples:
  sharpsheet /path/to/images  create spritesheets from source images
 
 ```
