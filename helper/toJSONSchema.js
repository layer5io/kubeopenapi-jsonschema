// @ts-check
const toJSONSchema = require("@openapi-contrib/openapi-schema-to-json-schema");
const yaml = require("js-yaml");
const { readFileSync, writeFileSync } = require("fs");
const { tmpdir } = require("os");
const path = require("path");
const jp = require("jsonpath");
const { Resolver } = require("@stoplight/json-ref-resolver");

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
 * readSchema will also resolve the references if a resolveQuery is passed
 * @param {string} location
 * @param {string} resolveQuery jsonpath based query - must resolve to EXACTLY one match or else is ignored
 * @returns {Promise<any[]>}
 */
async function readSchema(location, resolveQuery) {
  const data = readFileSync(location, "utf-8");
  const parsed = JSON.parse(data);

  if (resolveQuery) {
    const inner = jp.query(parsed, resolveQuery);

    if (inner.length !== 1) return parsed;

    const resolver = new Resolver();
    const resolved = await resolver.resolve(inner[0], {});

    if (resolved.errors.length) console.error(resolved.errors);

    return resolved.result;
  }

  return parsed;
}

/**
 * filterSchemas takes in an array of schemas and will return an array of filtered schemas
 * @param {Array<any>} schemas - OpenAPI schema in JSON format
 * @param {string} query jsonpath based query to filter out the data
 * @returns {Array<any>}
 */
function filterSchemas(schemas, query) {
  return jp.query(schemas, query);
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
 * @param {string} resolve jsonpath query to reach to the root of the openAPI spec
 */
async function ToJSONSchema(location, type = "yaml", query = "", resolve = "") {
  if (type !== "yaml" && type !== "json")
    throw Error('invalid type received: can be either "yaml" or "json"');

  const source = setupFiles(location, type);

  const schemas = await readSchema(source, resolve);

  const filtered = filterSchemas(schemas, query);

  return convertAllSchemasToJSONSchema(filtered);
}

module.exports = ToJSONSchema;
