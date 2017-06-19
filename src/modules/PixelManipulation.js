/*
 * General purpose per-pixel manipulation
 * accepting a changePixel() method to remix a pixel's channels
 */
module.exports = function PixelManipulation(image, options) {

  options = options || {};
  options.changePixel = options.changePixel || function changePixel(r, g, b, a) {
    return [r, g, b, a];
  }
  var getPixels = require("get-pixels"),
      savePixels = require("save-pixels"),
      base64 = require('base64-stream');

  getPixels(image.src, function(err, pixels) {

    if(err) {
      console.log("Bad image path")
      return
    }

    // iterate through pixels;
    // this could possibly be more efficient; see
    // https://github.com/p-v-o-s/infragram-js/blob/master/public/infragram.js#L173-L181
    for(var x = 1; x < pixels.shape[0]; x++) {
      for(var y = 1; y < pixels.shape[1]; y++) {

        pixel = options.changePixel(
          pixels.get(x, y, 0),
          pixels.get(x, y, 1),
          pixels.get(x, y, 2),
          pixels.get(x, y, 3)
        );

        pixels.set(x, y, 0, pixel[0]);
        pixels.set(x, y, 1, pixel[1]);
        pixels.set(x, y, 2, pixel[2]);
        pixels.set(x, y, 3, pixel[3]);

      }
    }

    // there may be a more efficient means to encode an image object,
    // but node modules and their documentation are essentially arcane on this point
    var buffer = base64.encode();
    savePixels(pixels, (options.format=="png"?"jpeg":options.format)).on('end', function() {
      data = buffer.read().toString();
      datauri = 'data:image/' + (options.format=="png"?"jpeg":options.format) + ';base64,' + data;
      if (options.output) options.output(options.image,datauri,(options.format=="png"?"jpeg":options.format));
      if (options.callback) options.callback();
    }).pipe(buffer);

  });

}
