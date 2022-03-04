package model

type Address struct {
	ID         string `json:"id"`
	Label      string `json:"label"`
	Receiver   string `json:"receiver"`
	Phone      string `json:"phone"`
	City       string `json:"city"`
	PostalCode string `json:"postalCode"`
	Address    string `json:"address"`
	IsMain     bool   `json:"isMain"`
	IsValid    bool   `json:"isValid"`
	UserId     string `json:"userId" gorm:"size:191"`
	User       *User  `json:"user"`
}

type NewAddress struct {
	Label      string `json:"label"`
	Receiver   string `json:"receiver"`
	Phone      string `json:"phone"`
	City       string `json:"city"`
	PostalCode string `json:"postalCode"`
	Address    string `json:"address"`
	IsMain     bool   `json:"isMain"`
}

type UpdateAddress struct {
	Label      string `json:"label"`
	Receiver   string `json:"receiver"`
	Phone      string `json:"phone"`
	City       string `json:"city"`
	PostalCode string `json:"postalCode"`
	Address    string `json:"address"`
}
