
exports.compile = function(text) {
  return function(data) {
    if(data) {
      data.text = text;
      return data;
    } else {
      return {};
    }
  }
}
