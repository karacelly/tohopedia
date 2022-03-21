package model

type User struct {
	ID           string               `json:"id"`
	Name         string               `json:"name"`
	Email        string               `json:"email"`
	Password     string               `json:"password"`
	Phone        string               `json:"phone"`
	Gender       string               `json:"gender"`
	Dob          string               `json:"dob"`
	Image        string               `json:"image"`
	Role         string               `json:"role"`
	Balance      int                  `json:"balance"`
	Enable2fa    bool                 `json:"enable2FA"`
	IsSuspended  bool                 `json:"isSuspended"`
	UnsuspendReq bool                 `json:"unsuspendReq"`
	Shop         *Shop                `json:"shop"`
	Carts        []*Cart              `json:"carts"`
	Transactions []*TransactionHeader `json:"transactions"`
	Wishlist     []*Wishlist          `json:"wishlist"`
	Addresses    []*Address           `json:"addresses"`
}

type NewUser struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UpdateUser struct {
	Name   string `json:"name"`
	Dob    string `json:"dob"`
	Gender string `json:"gender"`
	Phone  string `json:"phone"`
	Image  string `json:"image"`
}
