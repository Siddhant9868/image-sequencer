/*
 * Display only the green channel
 */
module.exports = function GreenChannel(options) {

  options = options || {};
  options.title = "Green channel only";
  options.description = "Displays only the green channel of an image";
  var output;

  //function setup() {} // optional

  function draw(input,callback) {
    this_ = this;
    function changePixel(r, g, b, a) {
      return [r, g, b, a];
    }
    function output(image,datauri,mimetype){
      this_.output = {src:datauri,format:mimetype}
    }
    return require('./PixelManipulation.js')(input, {
      output: output,
      changePixel: changePixel,
      format: input.format,
      image: options.image,
      callback: callback
    });
  }

  return {
    options: options,
    //setup: setup, // optional
    draw:  draw,
    output: output
  }
}
