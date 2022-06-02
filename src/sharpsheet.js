// https://github.com/cpietsch/sharpsheet
// by Christopher Pietsch 2020

import fs from "fs";
import sharp from "sharp";
import path from "path";
import glob from "glob";
import ShelfPack from "@mapbox/shelf-pack";

// sharp.cache(false)
// sharp.queue.on('change', function(queueLength) {
//   console.log('Queue contains ' + queueLength + ' task(s)');
// });

export default async function sharpsheet(input, _outputPath, options) {
  const border = options.border || 1;
  const sheetDimension = options.sheetDimension || 1024;
  const outputFormat = options.outputFormat || "png";
  const outputQuality = options.outputQuality || 100;
  const outputFilename = options.outputFilename || "spritesheet.json";
  const compositeChunkSize = options.compositeChunkSize || 100;
  const sheetBackground = options.sheetBackground || { r: 0, g: 0, b: 0, alpha: 0 };

  let sizes = [];
  let images = [];
  let names = [];
  let files = [];

  if (typeof input === "string") {
    // check if input is an array and parse it
    if (input.startsWith("[") && input.endsWith("]")) {
      files = JSON.parse(input.replace(/'/g, '"'));
    } else {
      files = glob.sync(input);
    }
  } else if (Array.isArray(input)) {
    files = input
  }

  if (!files.length) {
    console.error("no images found")
    return
  }

  const outputPath = createPath(_outputPath);

  console.log("found", files.length, "files");
  console.log("loading metadata");

  // Loading Metadata: width, height of each image

  for (const i in files) {
    const file = files[i];
    const basename = path.parse(file).name;

    try {
      const metadata = await sharp(file).metadata();

      sizes.push({
        id: +i,
        w: metadata.width + 2 * border,
        h: metadata.height + 2 * border,
      });
      images.push(file);
      names.push(basename);
    } catch (e) {
      console.error(e, file);
      console.log("skipping file");
    }
  }

  // Bin Pack for those images
  console.log("bin packing");

  //sizes.sort((a,b)=> Math.max(b.w,b.h) - Math.max(a.w,a.h))
  sizes.sort((a, b) => b.h - a.h)

  let queue = sizes.map((d) => d);
  let packs = [];

  while (queue.length !== 0) {
    let sprite = new ShelfPack(sheetDimension, sheetDimension);
    let results = sprite.pack(queue);
    packs.push(results);
    queue = queue.filter((d) => !results.find((i) => i.id === d.id));
  }

  const packed = packs.map((pack) =>
    pack.map((bin) => ({
      name: names[bin.id],
      input: images[bin.id],
      left: bin.x + border,
      top: bin.y + border,
      width: bin.w - 2 * border,
      height: bin.h - 2 * border,
    }))
  );

  // Put those bin packed layouts on spirtesheets with sharp

  console.log("creating spritesheets", packed.length);

  const spritesheets = await Promise.all(
    packed.map(async (composite, index) => {
      console.log("composing spritesheet", index);

      const options = {
        width: sheetDimension,
        height: sheetDimension,
        channels: 4,
        background: sheetBackground,
      };

      let compositeSheetBuffer = await sharp({ create: options })
        .raw()
        .toBuffer();
      const compositeChunks = chunk(composite, compositeChunkSize);

      for (let compositeChunk of compositeChunks) {
        console.log("composing sprites", compositeChunkSize * index);
        compositeSheetBuffer = await sharp(compositeSheetBuffer, {
          raw: options,
        })
          .composite(compositeChunk)
          .raw()
          .toBuffer();
      }

      const fileName = `sprite-${sheetDimension}-${index}.${outputFormat}`;
      const fileMeta = await sharp(compositeSheetBuffer, { raw: options })
        .toFormat(outputFormat, { quality: outputQuality })
        .toFile(outputPath + "/" + fileName);

      return { composite, fileName, fileMeta };
    })
  );

  // console.log(spritesheets);

  // generate json file

  const coordinates = packed.map((pack, index) => ({
    image: makeFilename(sheetDimension, index, outputFormat),
    sprites: pack.map(({ left, top, width, height, name }) => {
      return {
        name,
        position: { x: left, y: top },
        dimension: { w: width, h: height },
      };
    }),
  }));

  const jsonOut = {
    meta: {
      type: "sharpsheet",
      version: "1",
      app: "https://github.com/cpietsch/sharpsheet",
    },
    spritesheets: coordinates,
  };

  fs.writeFileSync(
    outputPath + "/" + outputFilename,
    JSON.stringify(jsonOut, null, 2)
  );
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

function scaleTo(_width, _height, max) {
  let aspect = _width < _height;
  let width = aspect ? Math.floor((max / _height) * _width) : max;
  let height = aspect ? max : Math.floor((max / _width) * _height);
  return { width, height };
}

const makeFilename = (dimension, index, format) =>
  `sprite-${dimension}-${index}.${format}`;

function createPath(path) {
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true }); // @todo: polyfill
  return path;
}
