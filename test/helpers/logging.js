function turnOffLogging() {
  console.log = function() {};
  console.debug = function() {};
  console.warn = function() {};
  console.error = function() {};
}

module.exports = { turnOffLogging };
