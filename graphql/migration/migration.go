package migration

import (
	"graphql/config"
	"graphql/graph/model"
)

func MigrateTable() {
	db := config.GetDB()

	db.AutoMigrate(&model.Product{})
	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.ShopPromo{})
}