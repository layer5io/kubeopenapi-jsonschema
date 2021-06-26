/**
 * CreateQuery generates a jsonpath based query
 * @param {string} query jsonpath query
 * @param {boolean} isKubernetes is the query to be generated for K8s CRD
 * @returns {string} generated query
 */
function CreateQuery(query = "", isKubernetes = true) {
  if (isKubernetes || !query)
    return `$[?(@.kind=="CustomResourceDefinition")]..validation.openAPIV3Schema`;

  return query;
}

module.exports = CreateQuery;
