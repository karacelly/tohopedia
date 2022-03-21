package model

type Courier struct {
	ID        string      `json:"id"`
	Name      string      `json:"name"`
	Shippings []*Shipping `json:"shippings"`
}

type Shipping struct {
	ID        string   `json:"id"`
	Label     string   `json:"label"`
	Price     int      `json:"price"`
	Duration  int      `json:"duration"`
	LateProb  int      `json:"lateProb"`
	CourierId string   `json:"courierId" gorm:"size:191"`
	Courier   *Courier `json:"courier"`
}

type NewShipping struct {
	Label     string `json:"label"`
	Price     int    `json:"price"`
	Duration  int    `json:"duration"`
	LateProb  int    `json:"lateProb"`
	CourierID string `json:"courierId"`
}
