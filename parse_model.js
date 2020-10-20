var util = require("./util")

var types = {
    int64 : "int64",
    time : "time.Time",
    string : "string"
}

// Converts schema to Tags
function GenerateTags(obj) {
    let tags = ""
    Object.keys(obj).forEach(k => {
        let structKey = util.snakeToCamel(k)
        structKey = structKey[0].toUpperCase() + structKey.slice(1, structKey.length)
        tags += `${structKey} ${obj[k]} \`json:"${k}"\` \n`
    })
    return tags
}
// Add additional definitions to schema
function PreProcessSchema(obj) {
    obj["CreateDate"] = types.time
    obj["UpdateDate"] = types.time
    return obj
}
// Converts the schema to struct without model name
function ProcessSchema(obj) {
    let schema = PreProcessSchema(obj)
    let tags = GenerateTags(schema)
    return tags
}
// Converts the schema to struct with model name
function ParseModel(model, schema) {
    let str = `type ${model} struct { \n`
    str += ProcessSchema(schema)
    str += `} \n`
    return str
}
// Parse model from file
function ParseModelFromFile(model, file) {
    let jsonObj = {}
    jsonObj["id"] = types.int64
    jsonObj = {...jsonObj, ...util.readJsonFromFile(file)}
    return ParseModel(model, jsonObj)
}

module.exports = {
    ParseModelFromFile
}