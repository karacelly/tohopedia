package migration

import (
	"graphql/config"
	"graphql/graph/model"
)

func MigrateTable() {
	db := config.GetDB()

	db.AutoMigrate(&model.Product{})
	db.AutoMigrate(&model.ProductImage{})
	db.AutoMigrate(&model.Address{})
}