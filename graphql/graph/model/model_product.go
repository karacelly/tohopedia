package model

import "time"

type Category struct {
	ID       string     `json:"id"`
	Name     string     `json:"name"`
	Products []*Product `json:"products"`
}

type Product struct {
	ID          string          `json:"id"`
	OriginalID  string          `json:"originalId"`
	Name        string          `json:"name"`
	Images      []*ProductImage `json:"productImageID" gorm:"size:191"`
	Description string          `json:"description"`
	Price       int             `json:"price"`
	Stock       int             `json:"stock"`
	Discount    int             `json:"discount"`
	Metadata   []*ProductMetadata `json:"productMetadataID" gorm:"size:191"`
	CreatedAt  time.Time          `json:"createdAt"`
	CategoryID string             `json:"categoryId" gorm:"size:191"`
	Category   *Category          `json:"category"`
	ShopID     string             `json:"shopID" gorm:"size:191"`
	Shop       *Shop              `json:"shop"`
}

type ProductImage struct {
	ID        string   `json:"id"`
	ProductID string   `json:"productId" gorm:"size:191"`
	Product   *Product `json:"product"`
	Image     string   `json:"image"`
}

type ProductMetadata struct {
	ID        string   `json:"id"`
	Label     string   `json:"label"`
	Value     string   `json:"value"`
	ProductID string   `json:"productId" gorm:"size:191"`
	Product   *Product `json:"product"`
}
