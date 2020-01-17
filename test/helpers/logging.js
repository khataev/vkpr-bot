function turnOffLogging() {
  console.log = function() {};
  console.debug = function() {};
  console.warn = function() {};
}

module.exports = { turnOffLogging };
