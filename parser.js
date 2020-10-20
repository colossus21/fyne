// Get Models Handler
let handlerGetModels = (model) => `func Get${model}Handler() gin.HandlerFunc {
    return func(c *gin.Context) {
        models, err := Get${model}()
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{
                "err": "could not fetch ${model}",
            })
        } else {
            c.JSON(http.StatusOK, gin.H{
                "data": models,
            })
        }
    }
} \n \n`
// Get Model by ID Handler
let handlerGetModelByID = (model) => `func Get${model}ByIDHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		ID := c.Param("id")
		IDN, err := strconv.Atoi(ID)
		model, err := Get${model}ByID(IDN)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"err": "could not fetch ${model} by id",
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"data": model,
			})
		}
	}
} \n \n`
// Add Model Handler
let handlerAddModel = (model) => `func Add${model}Handler() gin.HandlerFunc {
	return func(c *gin.Context) {
		var model ${model}
		err := c.ShouldBindJSON(&model)
		if err != nil || model.Id <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"err": "could not bind",
			})
			return
		}
		err = model.Add()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"err": "${model} could not be added",
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"message": "${model} added",
			})
		}
	}
} \n \n`
// Update Model Handler
let handlerUpdateModel = (model) => `func Update${model}Handler() gin.HandlerFunc {
	return func(c *gin.Context) {
		var model ${model}
		err := c.ShouldBindJSON(&model)
		if err != nil || model.Id <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"err": "could not bind",
			})
			return
		}
		err = model.Update()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"err": "${model} could not be updated",
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"message": "${model} updated",
			})
		}
	}
} \n \n`
// Delete Model Handler
let handlerDeleteModel = (model) => `func Delete${model}ByIDHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		var model ${model}
		ID := c.Param("id")
		IDN, err := strconv.Atoi(ID)
		if err != nil || IDN <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"err": "could not bind",
			})
			return
		}
		model.Id = int64(IDN)
		err = model.Delete()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"err": "${model} could not be deleted",
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"message": "${model} deleted",
			})
		}
	}
} \n \n`

// Add Model
let addModel = (model) => `func (c *${model}) Add() error {
	c.CreateDate=time.Now()
	_, err := db.Model(c).Insert()
	return err
} \n \n`
// Update Model
let updateModel = (model) => `func (c *${model})  Update() error {
	_, err := db.Model(c).Where("id = ?", c.Id).Update()
	return err
} \n \n`
// Delete Model
let deleteModel = (model) => `func (c *${model}) Delete() error {
	_, err := db.Model(c).Where("id = ?", c.Id).Delete()
	return err
} \n \n`
// Get Model
let getModel = (model) => `func Get${model}() ([]${model}, error) {
		var model []${model}
		err := db.Model(&model).Order("id ASC").Select()
		return model, err
} \n \n`
// Get Model by ID
let getModelByID = (model) => `func Get${model}ByID(id int) (${model}, error) {
	var model ${model}
	err := db.Model(&model).
		Where("id = ?", id).
		Select()
	return model, err
} \n \n`
// DB
let DB = (model) => `package Package${model}

import (
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)
import "context"

var opt, errorParsing = pg.ParseURL("")

var db = pg.Connect(opt)

func isDBAlive() error {
	ctx := context.Background()
	err := db.Ping(ctx)
	return err
}

func setupSchema() error {
	models := []interface{}{
		(*${model})(nil),
	}

	for _, model := range models {
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{})
		if err != nil {
			return err
		}
	}
	return nil
}
`
// ROUTER
let Router = (model) => `
package Package${model}

import (
	"github.com/gin-gonic/gin"
)

func RunServer(port string) {
	// ${model}
	router := gin.Default()
	router.GET("${model.toLowerCase()}", Get${model}Handler())
	router.GET("${model.toLowerCase()}/:id", Get${model}ByIDHandler())
	router.DELETE("${model.toLowerCase()}/:id", Delete${model}ByIDHandler())
	router.POST("${model.toLowerCase()}", Add${model}Handler())
	router.PUT("${model.toLowerCase()}", Update${model}Handler())
	router.Run(port)
}


func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Content-Type", "application/json")
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Max-Age", "86400")
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Max, X-Auth-Secret, Uid, Aid, CToken")
		c.Header("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		} else {
			c.Next()
		}
	}
}`
module.exports = {
    addModel,
    updateModel,
    deleteModel,
    getModel,
    getModelByID,
    handlerAddModel,
    handlerUpdateModel,
    handlerDeleteModel,
    handlerGetModels,
    handlerGetModelByID,
    DB,
    Router
}