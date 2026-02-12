// Inline TextEncoder polyfill for webpack ProvidePlugin
// This will be used by webpack to replace TextEncoder references

(function () {
  // Create polyfill constructors
  function TextEncoderPolyfill() {
    this.encode = function (str) {
      const utf8 = [];
      for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(
            0xe0 | (charcode >> 12),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f)
          );
        } else {
          i++;
          charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
          utf8.push(
            0xf0 | (charcode >> 18),
            0x80 | ((charcode >> 12) & 0x3f),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f)
          );
        }
      }
      return new Uint8Array(utf8);
    };
  }

  function TextDecoderPolyfill() {
    this.decode = function (bytes) {
      let str = '';
      let i = 0;
      while (i < bytes.length) {
        const c = bytes[i];
        if (c < 128) {
          str += String.fromCharCode(c);
          i++;
        } else if (c > 191 && c < 224) {
          str += String.fromCharCode(((c & 31) << 6) | (bytes[i + 1] & 63));
          i += 2;
        } else {
          str += String.fromCharCode(
            ((c & 15) << 12) | ((bytes[i + 1] & 63) << 6) | (bytes[i + 2] & 63)
          );
          i += 3;
        }
      }
      return str;
    };
  }

  // Export for webpack ProvidePlugin
  module.exports = {
    TextEncoder: TextEncoderPolyfill,
    TextDecoder: TextDecoderPolyfill,
  };
})();
