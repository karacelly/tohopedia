package model

import "time"

type Category struct {
	ID       string     `json:"id"`
	Name     string     `json:"name"`
	Products []*Product `json:"products"`
}

type Product struct {
	ID          string             `json:"id"`
	OriginalID  string             `json:"originalId"`
	Name        string             `json:"name"`
	Images      []*ProductImage    `json:"images"`
	Description string             `json:"description"`
	Price       int                `json:"price"`
	Stock       int                `json:"stock"`
	Rating      float64            `json:"rating"`
	Discount    int                `json:"discount"`
	Sold        int                `json:"sold"`
	Metadata    []*ProductMetadata `json:"metadata"`
	CreatedAt   time.Time          `json:"createdAt"`
	CategoryID  string             `json:"categoryId" gorm:"size:191"`
	Category    *Category          `json:"category"`
	ShopID      string             `json:"shopID" gorm:"size:191"`
	Shop        *Shop              `json:"shop"`
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

type NewProduct struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Images      []string `json:"images"`
	Price       int      `json:"price"`
	Stock       int      `json:"stock"`
	Discount    int      `json:"discount"`
	CategoryID  string   `json:"categoryId"`
	Label       string   `json:"label"`
	Value       string   `json:"value"`
}