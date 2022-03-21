package model

type TransactionHeader struct {
	ID     string `json:"id"`
	UserID string `json:"userID" gorm:"size:191"`

	User              *User                `json:"user"`
	ChosenAddressID   string               `json:"chosenAddressId"`
	CourierID         string               `json:"courierId"`
	ShippingID        string               `json:"shippingId"`
	VoucherID         string               `json:"voucherId"`
	TransactionDetail []*TransactionDetail `json:"transactionDetail"`
}

type TransactionDetail struct {
	ID     string `json:"id"`
	TransactionHeaderID string             `json:"transactionHeaderID" gorm:"size:191"`
	TransactionHeader   *TransactionHeader `json:"transaction"`
	ProductID           string             `json:"productId"`
	Quantity            int                `json:"quantity"`
}

type NewTransaction struct {
	ChosenAddressID string   `json:"chosenAddressId"`
	CourierID       string   `json:"courierId"`
	ShippingID      string   `json:"shippingId"`
	VoucherID       string   `json:"voucherId"`
	ProductIds      []string `json:"productIds"`
	Qtys            []int    `json:"qtys"`
}
