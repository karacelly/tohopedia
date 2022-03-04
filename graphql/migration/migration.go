package migration

import (
	"graphql/config"
	"graphql/graph/model"
)

func MigrateTable() {
	db := config.GetDB()

	db.AutoMigrate(&model.Cart{})
}