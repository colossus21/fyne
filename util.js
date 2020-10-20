var camelToSnake = str => str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
var snakeToCamel = str => str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
var readJsonFromFile = file_name => {
    var fs = require('fs');
    let raw = fs.readFileSync(file_name);
    let jsonObj = JSON.parse(raw);
    return jsonObj
}
var writeToFile = (file_name, data) => {
    var fs = require('fs');
    fs.writeFile(file_name, data, function (err) {
        if (err) {
            return {success: false}
        }
        return {success: true}
    });
}
var capFirst = str => str[0].toUpperCase() + str[1, str.length]

module.exports = {
    camelToSnake,
    snakeToCamel,
    readJsonFromFile,
    writeToFile,
    capFirst
}
