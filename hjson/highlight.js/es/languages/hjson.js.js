function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/hjson" instead of "highlight.js/lib/languages/hjson.js"'
      );
    }
  }
  emitWarning();
    module.exports = require('./hjson.js');