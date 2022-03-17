package model

import (
	"time"
)

type Voucher struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Description  string `json:"description"`
	DiscountRate int    `json:"discountRate"`
	Condition    string `json:"condition"`
	StartDate    time.Time `json:"startDate"`
	EndDate      time.Time `json:"endDate"`
	Global       bool   `json:"global"`
	ShopId       *string `json:"shopId" gorm:"size:191"`
	Shop         *Shop  `json:"shop"`
}

type NewVoucher struct {
	Name         string    `json:"name"`
	Description  string 	 `json:"description"`
	DiscountRate int       `json:"discountRate"`
	Condition    string    `json:"condition"`
	StartDate    time.Time `json:"startDate"`
	EndDate      time.Time `json:"endDate"`
	Global       bool      `json:"global"`
	ShopID       *string   `json:"shopID"`
}
