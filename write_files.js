// Steps:
// 1. db.go
// 2. model.go
// 3. handler.go
// 4. router.go


// model.go
var parser = require("./parse_model")
var templ = require("./parser")
var util = require("./util")

var modelDeps = ['time']
var handlerDeps = ["github.com/gin-gonic/gin","net/http","strconv"]

function importFromArray(arr) {
    let str = "import ( \n"
    arr.forEach(a => {
        str += `"${a}" \n`
    })
    str += ") \n \n"
    return str
}

function packageDef(name) {
    return `package Package${name} \n \n`
}

function makeModelFile(model, file) {
    let modelGoFile = packageDef(model) + importFromArray(modelDeps)
    let jsonData = parser.ParseModelFromFile(model, file)
    modelGoFile += jsonData
    modelGoFile += templ.addModel(model)
    modelGoFile += templ.updateModel(model)
    modelGoFile += templ.deleteModel(model)
    modelGoFile += templ.getModel(model)
    modelGoFile += templ.getModelByID(model)
    console.log("Writing model.go...")
    util.writeToFile("model.go", modelGoFile)
    console.log("Writing handler.go...")
    let handlerGoFile = packageDef(model) + importFromArray(handlerDeps)
    handlerGoFile += templ.handlerAddModel(model)
    handlerGoFile += templ.handlerUpdateModel(model)
    handlerGoFile += templ.handlerDeleteModel(model)
    handlerGoFile += templ.handlerGetModels(model)
    handlerGoFile += templ.handlerGetModelByID(model)
    util.writeToFile("handler.go", handlerGoFile)
    console.log("Writing db.go...")
    util.writeToFile("db.go", templ.DB(model))
    console.log("Writing router.go...")
    util.writeToFile("router.go", templ.Router(model))
    console.log("Generation successful!")
}

module.exports = {
    makeModelFile
}