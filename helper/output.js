const { dump } = require("js-yaml");
const jp = require("jsonpath");

/**
 * Output takes in the data that needs to be printed and
 * an output format
 * @param {*} data
 * @param {"json" | "yaml"} format output format
 */
function Output(data, format = "json", filter = "", silent = false) {
  if (silent) return;

  data = jp.query(data, filter);
  if (format === "yaml") return console.log(dump(data));
  if (format === "json") return console.log(JSON.stringify(data, null, 2));
}

module.exports = Output;
