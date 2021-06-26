// @ts-check
const toJSONSchema = require("@openapi-contrib/openapi-schema-to-json-schema");
const yaml = require("js-yaml");
const { readFileSync, writeFileSync } = require("fs");
const { tmpdir } = require("os");
const path = require("path");
const jp = require("jsonpath");

/**
 * convertAllSchemasToJSONSchema takes in the OpenAPIV3 Schemas in an array
 * and return an array of an equivalent JSON Schema Draft 4 schemas
 * @param {any[]} schemas array of schemas in JSON format
 * @returns {any[]} JSON Schema draft 4 formatted schemas
 */
function convertAllSchemasToJSONSchema(schemas) {
  if (Array.isArray(schemas))
    return schemas.map((schema) => toJSONSchema(schema));

  return [];
}

/**
 * readSchema will read schema file from the given location, it expects
 * the schema to be in JSON format
 *
 * readSchema will also apply the given jsonpath filter to the read schema
 * and will return only the filtered JSONs
 * @param {string} location
 * @param {string} query jsonpath based query
 * @returns {any[]}
 */
function readSchema(location, query) {
  const data = readFileSync(location, "utf-8");
  const parsed = JSON.parse(data);

  return jp.query(parsed, query);
}

/**
 * setupFiles takes the location of the files and convert them into json
 * and return the new location
 * @param {string} location
 * @param {"yaml" | "json"} type
 * @returns {string} location of the schema files
 */
function setupFiles(location, type) {
  if (type === "json") return location;

  if (type === "yaml") {
    try {
      // Create a file name
      const filename = `ucnv-${Math.random().toString(36).substr(2, 5)}.json`;

      // Create destination path
      const dest = path.join(tmpdir(), filename);

      // Read file into memory and convert into json
      const doc = yaml.loadAll(readFileSync(location, "utf-8"));

      // Write the converted file to the disk
      writeFileSync(dest, JSON.stringify(doc));

      return dest;
    } catch (error) {
      return "";
    }
  }
}

/**
 * ToJSONSchema will convert he OpenAPIV3 based schema to JSONSchema Draft 4 schemas
 * @param {string} location location of the schemas in open api v3 format
 * @param {"yaml" | "json"} type encoding in which the openapi schema is present
 * @param {string} query jsonpath query to filter the read schemas
 */
function ToJSONSchema(location, type = "yaml", query = "") {
  if (type !== "yaml" && type !== "json")
    throw Error('invalid type received: can be either "yaml" or "json"');

  const source = setupFiles(location, type);

  const schemas = readSchema(source, query);

  return convertAllSchemasToJSONSchema(schemas);
}

module.exports = ToJSONSchema;
