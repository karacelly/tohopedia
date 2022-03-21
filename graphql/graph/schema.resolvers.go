package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"graphql/config"
	"graphql/graph/generated"
	"graphql/graph/model"
	"graphql/service"
	"graphql/tools"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *addressResolver) User(ctx context.Context, obj *model.Address) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *authOpsResolver) Login(ctx context.Context, obj *model.AuthOps, email string, password string) (interface{}, error) {
	return service.UserLogin(ctx, email, password)
}

func (r *authOpsResolver) Register(ctx context.Context, obj *model.AuthOps, input model.NewUser) (interface{}, error) {
	return service.UserRegister(ctx, input)
}

func (r *cartResolver) Product(ctx context.Context, obj *model.Cart) (*model.Product, error) {
	db := config.GetDB()
	var model *model.Product
	if err := db.Where("id = ?", obj.ProductID).Find(&model).Error; err != nil {
		return nil, err
	}

	return model, nil
}

func (r *cartResolver) User(ctx context.Context, obj *model.Cart) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *categoryResolver) Products(ctx context.Context, obj *model.Category) ([]*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *courierResolver) Shippings(ctx context.Context, obj *model.Courier) ([]*model.Shipping, error) {
	db := config.GetDB()
	var model []*model.Shipping
	if err := db.Where("courier_id = ?", obj.ID).Find(&model).Error; err != nil {
		return nil, err
	}

	return model, nil
}

func (r *mutationResolver) Auth(ctx context.Context) (*model.AuthOps, error) {
	return &model.AuthOps{}, nil
}

func (r *mutationResolver) OpenShop(ctx context.Context, input model.NewShop) (*model.Shop, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	// user := new(model.User)
	// if err := db.First(user, "id = ?", userId).Error; err != nil {
	// 	return nil, err
	// }

	loc, _ := time.LoadLocation("Asia/Jakarta")
	now := time.Now()

	shop := &model.Shop{
		ID:              uuid.NewString(),
		Name:            input.Name,
		Slug:            input.Slug,
		Phone:           input.Phone,
		Slogan:          "",
		Description:     "",
		Image:           "",
		OpenTime:        time.Date(now.Year(), now.Month(), now.Day(), 8, 0, 0, 0, loc),
		CloseTime:       time.Date(now.Year(), now.Month(), now.Day(), 18, 0, 0, 0, loc),
		IsOpen:          true,
		ReputationPoint: 0,
		UserId:          userId,
		City:            input.City,
		PostalCode:      input.PostalCode,
		Address:         input.Address,
	}

	err := db.Create(shop).Error

	return shop, err
}

func (r *mutationResolver) UpdateShop(ctx context.Context, input model.UpdateShop) (*model.Shop, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	shop := new(model.Shop)
	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("user_id = ?", userId).First(&shop).Error; err != nil {
		return nil, err
	}

	shop.Name = input.Name
	shop.Slug = input.Slug
	shop.Slogan = input.Slogan
	shop.Description = input.Description
	shop.IsOpen = input.IsOpen
	shop.OpenTime = input.OpenTime
	shop.CloseTime = input.CloseTime

	return shop, db.Save(shop).Error
}

func (r *mutationResolver) UpdateUser(ctx context.Context, input model.UpdateUser) (*model.User, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	user := new(model.User)
	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", userId).First(&user).Error; err != nil {
		return nil, err
	}

	user.Name = input.Name
	user.Dob = input.Dob
	user.Gender = input.Gender
	user.Phone = input.Phone
	user.Image = input.Image

	return user, db.Save(user).Error
}

func (r *mutationResolver) UpdateEmail(ctx context.Context, email string) (*model.User, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	user := new(model.User)
	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", userId).First(&user).Error; err != nil {
		return nil, err
	}

	user.Email = email

	return user, db.Save(user).Error
}

func (r *mutationResolver) CreateCategory(ctx context.Context, name string) (*model.Category, error) {
	db := config.GetDB()

	model := &model.Category{
		ID:   uuid.NewString(),
		Name: name,
	}

	err := db.Create(model).Error

	return model, err
}

func (r *mutationResolver) AddAddress(ctx context.Context, input model.NewAddress) (*model.Address, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if input.IsMain == true {
		var addresses []*model.Address
		if err := db.Where("user_id = ?", userId).Find(&addresses).Error; err != nil {
			return nil, err
		}

		if len(addresses) > 0 {
			for i := 0; i < len(addresses); i++ {
				addresses[i].IsMain = false
			}

			if err := db.Save(addresses).Error; err != nil {
				return nil, err
			}
		}
	}

	model := &model.Address{
		ID:         uuid.NewString(),
		Label:      input.Label,
		Receiver:   input.Receiver,
		Phone:      input.Phone,
		City:       input.City,
		PostalCode: input.PostalCode,
		Address:    input.Address,
		IsMain:     input.IsMain,
		IsValid:    true,
		UserId:     userId,
	}

	err := db.Create(model).Error

	return model, err
}

func (r *mutationResolver) DeleteAddress(ctx context.Context, id string) (*model.Address, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	var address *model.Address
	if err := db.Where("id = ?", id).Find(&address).Error; err != nil {
		return nil, err
	}

	address.IsValid = false

	return address, db.Save(address).Error
}

func (r *mutationResolver) UpdateAddress(ctx context.Context, input model.UpdateAddress, id string) (*model.Address, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	var address *model.Address
	if err := db.Where("id = ?", id).Find(&address).Error; err != nil {
		return nil, err
	}

	address.Label = input.Label
	address.Receiver = input.Receiver
	address.Phone = input.Phone
	address.Address = input.Address
	address.City = input.City
	address.PostalCode = input.PostalCode

	return address, db.Save(address).Error
}

func (r *mutationResolver) SetMainAddress(ctx context.Context, id string) (*model.Address, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var addresses []*model.Address
	if err := db.Where("user_id = ?", userId).Find(&addresses).Error; err != nil {
		return nil, err
	}

	if len(addresses) > 0 {
		for i := 0; i < len(addresses); i++ {
			addresses[i].IsMain = false
		}

		if err := db.Save(addresses).Error; err != nil {
			return nil, err
		}
	}

	var address *model.Address
	if err := db.Where("id = ?", id).Find(&address).Error; err != nil {
		return nil, err
	}

	address.IsMain = true

	return address, db.Save(address).Error
}

func (r *mutationResolver) AddProduct(ctx context.Context, input model.NewProduct) (*model.Product, error) {
	db := config.GetDB()

	shop := new(model.Shop)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.FirstOrInit(shop, "user_id = ?", userId).Error; err != nil {
		return nil, err
	}

	productId := uuid.NewString()
	product := &model.Product{
		ID:          productId,
		OriginalID:  productId,
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Stock:       input.Stock,
		Discount:    input.Discount,
		Rating:      0,
		Sold:        0,
		CreatedAt:   time.Now(),
		CategoryID:  input.CategoryID,
		ShopID:      shop.ID,
	}

	err := db.Create(product).Error

	if err == nil {
		for i := 1; i < len(input.Images); i++ {
			image := &model.ProductImage{
				ID:        uuid.NewString(),
				ProductID: product.OriginalID,
				Image:     input.Images[i],
			}

			err := db.Create(image).Error

			if err != nil {
				return nil, err
			}
		}

		if input.Label != "" && input.Value != "" {
			metadata := &model.ProductMetadata{
				ID:        uuid.NewString(),
				Label:     input.Label,
				Value:     input.Value,
				ProductID: product.OriginalID,
			}

			err := db.Create(metadata).Error

			if err != nil {
				return nil, err
			}
		}

	}

	fmt.Print(err)
	return product, err
}

func (r *mutationResolver) AddToCart(ctx context.Context, input model.NewCart) (*model.Cart, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var userCart []*model.Cart

	if err := db.Where("user_id = ?", userId).Find(&userCart).Error; err != nil {
		return nil, err
	}

	if len(userCart) > 0 {
		for i := 0; i < len(userCart); i++ {
			if userCart[i].ProductID == input.ProductID {
				userCart[i].Quantity += input.Quantity

				return userCart[i], db.Save(userCart[i]).Error
			}
		}
	}

	cart := &model.Cart{
		ID:        uuid.NewString(),
		ProductID: input.ProductID,
		UserId:    userId,
		Quantity:  input.Quantity,
		Checked:   true,
		Note:      input.Note,
	}

	return cart, db.Create(cart).Error
}

func (r *mutationResolver) UpdateCartQty(ctx context.Context, id string, qty int) (*model.Cart, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	cart := new(model.Cart)
	if err := db.Where("id = ?", id).First(&cart).Error; err != nil {
		return nil, err
	}

	cart.Quantity = qty

	return cart, db.Save(cart).Error
}

func (r *mutationResolver) CheckCart(ctx context.Context, id string, check bool) (*model.Cart, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	cart := new(model.Cart)
	if err := db.Where("id = ?", id).First(&cart).Error; err != nil {
		return nil, err
	}

	cart.Checked = check

	return cart, db.Save(cart).Error
}

func (r *mutationResolver) DeleteCart(ctx context.Context, id string) (*model.Cart, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	cart := new(model.Cart)
	if err := db.Where("id = ?", id).First(&cart).Error; err != nil {
		return nil, err
	}

	return cart, db.Delete(cart).Error
}

func (r *mutationResolver) AddToWishlist(ctx context.Context, productID string) (*model.Wishlist, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	wishlist := new(model.Wishlist)
	if err := db.Where("product_id = ? and user_id = ?", productID, userId).First(&wishlist).Error; err != nil {
		newWishlist := &model.Wishlist{
			ID:        uuid.NewString(),
			ProductID: productID,
			UserId:    userId,
		}

		return newWishlist, db.Create(newWishlist).Error
	}

	return wishlist, nil
}

func (r *mutationResolver) RemoveFromWishlist(ctx context.Context, productID string) (*model.Wishlist, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	wishlist := new(model.Wishlist)
	if err := db.Where("product_id = ? and user_id = ?", productID, userId).First(&wishlist).Error; err != nil {
		return nil, err
	}

	return wishlist, db.Delete(wishlist).Error
}

func (r *mutationResolver) AddVoucher(ctx context.Context, input model.NewVoucher) (*model.Voucher, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	newVoucher := &model.Voucher{
		ID:           uuid.NewString(),
		Name:         input.Name,
		Description:  input.Description,
		DiscountRate: input.DiscountRate,
		Condition:    input.Condition,
		StartDate:    input.StartDate,
		EndDate:      input.EndDate,
		Global:       input.Global,
		ShopId:       input.ShopID,
	}

	return newVoucher, db.Create(newVoucher).Error
}

func (r *mutationResolver) SuspendUser(ctx context.Context, userID string) (*model.User, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	user := new(model.User)

	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}

	if !user.IsSuspended == false {
		user.UnsuspendReq = false
	}

	user.IsSuspended = !user.IsSuspended

	return user, db.Save(user).Error
}

func (r *mutationResolver) Enable2fa(ctx context.Context, enabled bool) (*model.User, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	user := new(model.User)

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", userId).First(&user).Error; err != nil {
		return nil, err
	}

	user.Enable2fa = enabled

	return user, db.Save(user).Error
}

func (r *mutationResolver) RequestUnsuspend(ctx context.Context, userID string) (*model.User, error) {
	db := config.GetDB()

	user := new(model.User)

	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}

	user.UnsuspendReq = true

	return user, db.Save(user).Error
}

func (r *mutationResolver) ResetPassword(ctx context.Context, userID string, newPassword string) (*model.User, error) {
	db := config.GetDB()

	user := new(model.User)

	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}

	user.Password = tools.HashPassword(newPassword)

	return user, db.Save(user).Error
}

func (r *mutationResolver) Topup(ctx context.Context, nominal int) (*model.User, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	user := new(model.User)
	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", userId).First(&user).Error; err != nil {
		return nil, err
	}

	user.Balance += nominal

	return user, db.Save(user).Error
}

func (r *mutationResolver) CreateCourier(ctx context.Context, name string) (*model.Courier, error) {
	db := config.GetDB()

	newCourier := &model.Courier{
		ID:   uuid.NewString(),
		Name: name,
	}

	return newCourier, db.Create(newCourier).Error
}

func (r *mutationResolver) CreateShipping(ctx context.Context, input model.NewShipping) (*model.Shipping, error) {
	db := config.GetDB()

	newShipping := &model.Shipping{
		ID:        uuid.NewString(),
		Label:     input.Label,
		Duration:  input.Duration,
		LateProb:  input.LateProb,
		CourierId: input.CourierID,
	}

	return newShipping, db.Create(newShipping).Error
}

func (r *mutationResolver) CreateTransaction(ctx context.Context, input model.NewTransaction, totalPrice int) (*model.TransactionHeader, error) {
	// panic(fmt.Errorf("not implemented"))
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	user := new(model.User)
	if err := db.FirstOrInit(user, "id = ?", userId).Error; err != nil {
		return nil, err
	}

	if user.Balance < totalPrice {
		return nil, &gqlerror.Error{
			Message: "Invalid balance!",
		}
	} else {
		user.Balance -= totalPrice
	}

	if err := db.Save(user).Error; err != nil {
		return nil, err
	}

	transactionId := uuid.NewString()
	transactionHeader := &model.TransactionHeader{
		ID:              transactionId,
		UserID:          userId,
		ChosenAddressID: input.ChosenAddressID,
		CourierID:       input.CourierID,
		ShippingID:      input.ShippingID,
		VoucherID:       input.VoucherID,
	}

	err := db.Create(transactionHeader).Error

	if err == nil {
		for i := 0; i < len(input.ProductIds); i++ {
			detail := &model.TransactionDetail{
				ID:                  uuid.NewString(),
				TransactionHeaderID: transactionId,
				ProductID:           input.ProductIds[i],
				Quantity:            input.Qtys[i],
			}

			product := new(model.Product)
			if err := db.FirstOrInit(product, "id = ?", input.ProductIds[i]).Error; err != nil {
				return nil, err
			}

			product.Stock -= input.Qtys[i]

			if err := db.Save(product).Error; err != nil {
				return nil, err
			}

			err := db.Create(detail).Error

			if err != nil {
				return nil, err
			}
		}
	}

	return transactionHeader, err
}

func (r *productResolver) Images(ctx context.Context, obj *model.Product) ([]*model.ProductImage, error) {
	db := config.GetDB()
	var images []*model.ProductImage

	if err := db.Where("product_id = ?", obj.ID).Find(&images).Error; err != nil {
		return nil, err
	}
	log.Println(obj.ID)
	// log.Printf("Image Length: %d\n",len(images))

	// for i := range(images) {
	// 	log.Printf("Image Length: %s\n",images[i].Image)
	// }

	// log.Println("Masuk Images")

	return images, nil
}

func (r *productResolver) Metadata(ctx context.Context, obj *model.Product) ([]*model.ProductMetadata, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *productResolver) Category(ctx context.Context, obj *model.Product) (*model.Category, error) {
	db := config.GetDB()
	var category *model.Category
	if err := db.Where("id = ?", obj.CategoryID).Find(&category).Error; err != nil {
		return nil, err
	}

	return category, nil
}

func (r *productResolver) Shop(ctx context.Context, obj *model.Product) (*model.Shop, error) {
	db := config.GetDB()
	var shop *model.Shop
	if err := db.Where("id = ?", obj.ShopID).Find(&shop).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *productImageResolver) Product(ctx context.Context, obj *model.ProductImage) (*model.Product, error) {
	db := config.GetDB()
	var prod *model.Product
	if err := db.Where("id = ?", obj.ProductID).Find(&prod).Error; err != nil {
		return nil, err
	}

	return prod, nil
}

func (r *productMetadataResolver) Product(ctx context.Context, obj *model.ProductMetadata) (*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) User(ctx context.Context, id string) (*model.User, error) {
	return service.UserGetByID(ctx, id)
}

func (r *queryResolver) UserByEmail(ctx context.Context, email string) (*model.User, error) {
	return service.UserGetByEmail(ctx, email)
}

func (r *queryResolver) Product(ctx context.Context, id string) (*model.Product, error) {
	db := config.GetDB()

	var product model.Product
	if err := db.Model(product).Where("id = ?", id).Take(&product).Error; err != nil {
		return nil, err
	}

	return &product, nil
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	db := config.GetDB()
	var models []*model.User
	return models, db.Find(&models).Error
}

func (r *queryResolver) Categories(ctx context.Context) ([]*model.Category, error) {
	db := config.GetDB()
	var models []*model.Category
	return models, db.Find(&models).Error
}

func (r *queryResolver) Addresses(ctx context.Context) ([]*model.Address, error) {
	db := config.GetDB()

	var address []*model.Address
	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("user_id = ? and is_valid = ?", userId, true).Find(&address).Error; err != nil {
		return nil, err
	}

	return address, nil
}

func (r *queryResolver) Carts(ctx context.Context) ([]*model.Cart, error) {
	db := config.GetDB()

	var carts []*model.Cart
	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("user_id = ?", userId).Find(&carts).Error; err != nil {
		return nil, err
	}

	return carts, nil
}

func (r *queryResolver) Couriers(ctx context.Context) ([]*model.Courier, error) {
	db := config.GetDB()

	var couriers []*model.Courier

	if err := db.Find(&couriers).Error; err != nil {
		return nil, err
	}

	return couriers, nil
}

func (r *queryResolver) AllProducts(ctx context.Context) ([]*model.Product, error) {
	db := config.GetDB()
	var models []*model.Product
	return models, db.Find(&models).Error
}

func (r *queryResolver) Products(ctx context.Context, limit int, offset int) ([]*model.Product, error) {
	db := config.GetDB()
	var models []*model.Product
	return models, db.Limit(limit).Offset(offset).Find(&models).Error
}

func (r *queryResolver) SearchProduct(ctx context.Context, limit *int, offset *int, key string, sortBy *int, filterBy *string) ([]*model.Product, error) {
	db := config.GetDB()
	var models []*model.Product

	// sort by
	// 1 -> paling sesuai
	// 2 -> added time
	// 3 -> rating
	// 4 -> highest price
	// 5 -> lowest price

	if limit != nil && offset != nil {
		fmt.Println(*sortBy)
		if sortBy == nil || *sortBy == 1 {
			fmt.Println("udh msk")
			if err := db.Where("name LIKE ?", ("%" + key + "%")).Limit(*limit).Offset(*offset).Find(&models).Error; err != nil {
				return nil, err
			}
		} else if *sortBy == 2 {
			if err := db.Where("name LIKE ?", ("%" + key + "%")).Limit(*limit).Offset(*offset).Order("created_at").Find(&models).Error; err != nil {
				return nil, err
			}
		} else if *sortBy == 3 {
			if err := db.Where("name LIKE ?", ("%" + key + "%")).Limit(*limit).Offset(*offset).Order("rating desc").Find(&models).Error; err != nil {
				return nil, err
			}
		} else if *sortBy == 4 {
			if err := db.Where("name LIKE ?", ("%" + key + "%")).Limit(*limit).Offset(*offset).Order("(price - (price * discount/100)) desc").Find(&models).Error; err != nil {
				return nil, err
			}
		} else if *sortBy == 5 {
			if err := db.Where("name LIKE ?", ("%" + key + "%")).Limit(*limit).Offset(*offset).Order("(price - (price * discount/100)) asc").Find(&models).Error; err != nil {
				return nil, err
			}
		}
	} else {
		if err := db.Where("name LIKE ?", ("%" + key + "%")).Find(&models).Error; err != nil {
			return nil, err
		}
	}

	fmt.Printf("length model: %d\n", len(models))

	if models != nil {
		for i := 0; i < len(models); i++ {
			fmt.Printf("%d. ", i)
			fmt.Println(models[i].ID)
		}
	}

	return models, nil
}

func (r *queryResolver) SearchShop(ctx context.Context, key string) (*model.Shop, error) {
	db := config.GetDB()
	var model *model.Shop

	var shopId *string
	if err := db.Table("shops").Select("shops.id").Joins("join products on products.shop_id = shops.id").Where("products.name LIKE ?", ("%" + key + "%")).Scan(&shopId).Error; err != nil {
		return nil, err
	}

	if err := db.Where("id = ?", shopId).Find(&model).Error; err != nil {
		return nil, err
	}

	return model, nil
}

func (r *queryResolver) ProductsPaginate(ctx context.Context, limit int, offset int, shopID string) ([]*model.Product, error) {
	db := config.GetDB()
	var models []*model.Product
	return models, db.Limit(limit).Offset(offset).Where("shop_id = ?", shopID).Find(&models).Error
}

func (r *queryResolver) UsersPaginate(ctx context.Context, limit int, offset int) ([]*model.User, error) {
	db := config.GetDB()
	var models []*model.User
	return models, db.Limit(limit).Offset(offset).Find(&models).Error
}

func (r *queryResolver) ShopBySlug(ctx context.Context, slug string) (*model.Shop, error) {
	db := config.GetDB()
	var models *model.Shop
	return models, db.Where("slug = ?", slug).Find(&models).Error
}

func (r *queryResolver) GetCurrentUser(ctx context.Context) (*model.User, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	return service.UserGetByID(ctx, id)
}

func (r *queryResolver) GetCurrentShop(ctx context.Context) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.First(shop, "user_id = ?", userId).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *queryResolver) CheckWishlist(ctx context.Context, productID string) (*model.Wishlist, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Wishlists(ctx context.Context) ([]*model.Wishlist, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	var wishlist []*model.Wishlist

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("user_id = ?", userId).Find(&wishlist).Error; err != nil {
		return nil, err
	}

	return wishlist, nil
}

func (r *queryResolver) Vouchers(ctx context.Context) ([]*model.Voucher, error) {
	db := config.GetDB()

	var vouchers []*model.Voucher

	if err := db.Find(&vouchers).Error; err != nil {
		return nil, err
	}

	return vouchers, nil
}

func (r *queryResolver) GlobalVouchers(ctx context.Context) ([]*model.Voucher, error) {
	db := config.GetDB()

	var vouchers []*model.Voucher

	if err := db.Where("global = ?", true).Find(&vouchers).Error; err != nil {
		return nil, err
	}

	return vouchers, nil
}

func (r *queryResolver) ShopVouchers(ctx context.Context, shopID string) ([]*model.Voucher, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	var vouchers []*model.Voucher

	if err := db.Where("shop_id = ?", shopID).Find(&vouchers).Error; err != nil {
		return nil, err
	}

	return vouchers, nil
}

func (r *queryResolver) Protected(ctx context.Context) (string, error) {
	return "Success", nil
}

func (r *queryResolver) ProductPerCategory(ctx context.Context) ([]*model.DataMap, error) {
	db := config.GetDB()

	var models []*model.DataMap
    return models, db.Raw(`SELECT
                                c.name,
                                COUNT(*) as "count"
                            FROM 
                                products p
                                JOIN categories c ON c.id = p.category_id
                            GROUP BY c.id, c.name`).Find(&models).Error
}

func (r *queryResolver) TransactionPerCourier(ctx context.Context) ([]*model.DataMap, error) {
	db := config.GetDB()

	var models []*model.DataMap
    return models, db.Raw(`SELECT
                                c.name,
                                COUNT(*) as "count"
                            FROM 
                                transaction_headers th
                                JOIN couriers c ON c.id = th.courier_id
                            GROUP BY c.id, c.name`).Find(&models).Error
}

func (r *queryResolver) SuspendedUser(ctx context.Context) ([]*model.DataMap, error) {
	db := config.GetDB()

	var models []*model.DataMap
    return models, db.Raw(`SELECT
																"suspended" as name,
                                COUNT(*) as "count"
                            FROM 
                                users
														WHERE is_suspended = true
                            UNION
														SELECT
																"unsuspended" as name,
                                COUNT(*) as "count"
                            FROM 
                                users
														WHERE is_suspended = false
														`).Find(&models).Error
}

func (r *shippingResolver) Courier(ctx context.Context, obj *model.Shipping) (*model.Courier, error) {
	db := config.GetDB()
	courier := new(model.Courier)

	if err := db.First(courier, "id = ?", obj.CourierId).Error; err != nil {
		return nil, err
	}

	return courier, nil
}

func (r *shopResolver) User(ctx context.Context, obj *model.Shop) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if err := db.First(user, "id = ?", obj.UserId).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *shopResolver) Products(ctx context.Context, obj *model.Shop) ([]*model.Product, error) {
	db := config.GetDB()
	var products []*model.Product
	if err := db.Where("shop_id = ?", obj.ID).Find(&products).Error; err != nil {
		return nil, err
	}

	return products, nil
}

func (r *shopResolver) Promos(ctx context.Context, obj *model.Shop) ([]*model.ShopPromo, error) {
	db := config.GetDB()
	var promos []*model.ShopPromo
	if err := db.Where("shop_id = ?", obj.ID).Find(&promos).Error; err != nil {
		return nil, err
	}

	return promos, nil
}

func (r *shopResolver) Vouchers(ctx context.Context, obj *model.Shop) ([]*model.Voucher, error) {
	db := config.GetDB()
	var voucher []*model.Voucher
	if err := db.Where("shop_id = ?", obj.ID).Find(&voucher).Error; err != nil {
		return nil, err
	}

	return voucher, nil
}

func (r *shopPromoResolver) Shop(ctx context.Context, obj *model.ShopPromo) (*model.Shop, error) {
	db := config.GetDB()
	var shop *model.Shop
	if err := db.Where("id = ?", obj.ShopId).Find(&shop).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *transactionDetailResolver) TransactionHeader(ctx context.Context, obj *model.TransactionDetail) (*model.TransactionHeader, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionHeaderResolver) TransactionDetail(ctx context.Context, obj *model.TransactionHeader) ([]*model.TransactionDetail, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Shop(ctx context.Context, obj *model.User) (*model.Shop, error) {
	db := config.GetDB()
	var shop *model.Shop
	if err := db.Where("user_id = ?", obj.ID).Find(&shop).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *userResolver) Carts(ctx context.Context, obj *model.User) ([]*model.Cart, error) {
	db := config.GetDB()
	var wl []*model.Cart
	if err := db.Where("user_id = ?", obj.ID).Find(&wl).Error; err != nil {
		return nil, err
	}

	return wl, nil
}

func (r *userResolver) Transactions(ctx context.Context, obj *model.User) ([]*model.TransactionHeader, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Wishlist(ctx context.Context, obj *model.User) ([]*model.Wishlist, error) {
	db := config.GetDB()
	var wl []*model.Wishlist
	if err := db.Where("user_id = ?", obj.ID).Find(&wl).Error; err != nil {
		return nil, err
	}

	return wl, nil
}

func (r *userResolver) Addresses(ctx context.Context, obj *model.User) ([]*model.Address, error) {
	db := config.GetDB()

	var address []*model.Address

	if err := db.Where("user_id = ?", obj.ID).Find(&address).Error; err != nil {
		return nil, err
	}

	return address, nil
}

func (r *voucherResolver) Shop(ctx context.Context, obj *model.Voucher) (*model.Shop, error) {
	db := config.GetDB()
	var shop *model.Shop
	if err := db.Where("id = ?", obj.ShopId).Find(&shop).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *wishlistResolver) Product(ctx context.Context, obj *model.Wishlist) (*model.Product, error) {
	db := config.GetDB()
	var prod *model.Product
	if err := db.Where("id = ?", obj.ProductID).Find(&prod).Error; err != nil {
		return nil, err
	}

	return prod, nil
}

func (r *wishlistResolver) User(ctx context.Context, obj *model.Wishlist) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

// Address returns generated.AddressResolver implementation.
func (r *Resolver) Address() generated.AddressResolver { return &addressResolver{r} }

// AuthOps returns generated.AuthOpsResolver implementation.
func (r *Resolver) AuthOps() generated.AuthOpsResolver { return &authOpsResolver{r} }

// Cart returns generated.CartResolver implementation.
func (r *Resolver) Cart() generated.CartResolver { return &cartResolver{r} }

// Category returns generated.CategoryResolver implementation.
func (r *Resolver) Category() generated.CategoryResolver { return &categoryResolver{r} }

// Courier returns generated.CourierResolver implementation.
func (r *Resolver) Courier() generated.CourierResolver { return &courierResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Product returns generated.ProductResolver implementation.
func (r *Resolver) Product() generated.ProductResolver { return &productResolver{r} }

// ProductImage returns generated.ProductImageResolver implementation.
func (r *Resolver) ProductImage() generated.ProductImageResolver { return &productImageResolver{r} }

// ProductMetadata returns generated.ProductMetadataResolver implementation.
func (r *Resolver) ProductMetadata() generated.ProductMetadataResolver {
	return &productMetadataResolver{r}
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Shipping returns generated.ShippingResolver implementation.
func (r *Resolver) Shipping() generated.ShippingResolver { return &shippingResolver{r} }

// Shop returns generated.ShopResolver implementation.
func (r *Resolver) Shop() generated.ShopResolver { return &shopResolver{r} }

// ShopPromo returns generated.ShopPromoResolver implementation.
func (r *Resolver) ShopPromo() generated.ShopPromoResolver { return &shopPromoResolver{r} }

// TransactionDetail returns generated.TransactionDetailResolver implementation.
func (r *Resolver) TransactionDetail() generated.TransactionDetailResolver {
	return &transactionDetailResolver{r}
}

// TransactionHeader returns generated.TransactionHeaderResolver implementation.
func (r *Resolver) TransactionHeader() generated.TransactionHeaderResolver {
	return &transactionHeaderResolver{r}
}

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

// Voucher returns generated.VoucherResolver implementation.
func (r *Resolver) Voucher() generated.VoucherResolver { return &voucherResolver{r} }

// Wishlist returns generated.WishlistResolver implementation.
func (r *Resolver) Wishlist() generated.WishlistResolver { return &wishlistResolver{r} }

type addressResolver struct{ *Resolver }
type authOpsResolver struct{ *Resolver }
type cartResolver struct{ *Resolver }
type categoryResolver struct{ *Resolver }
type courierResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type productResolver struct{ *Resolver }
type productImageResolver struct{ *Resolver }
type productMetadataResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type shippingResolver struct{ *Resolver }
type shopResolver struct{ *Resolver }
type shopPromoResolver struct{ *Resolver }
type transactionDetailResolver struct{ *Resolver }
type transactionHeaderResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
type voucherResolver struct{ *Resolver }
type wishlistResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *transactionDetailResolver) Transaction(ctx context.Context, obj *model.TransactionDetail) (*model.TransactionHeader, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *shippingResolver) Price(ctx context.Context, obj *model.Shipping) (int, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *productResolver) Rating(ctx context.Context, obj *model.Product) (float64, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *userResolver) Balance(ctx context.Context, obj *model.User) (int, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *shopResolver) PromotionalVid(ctx context.Context, obj *model.Shop) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *userResolver) UnsuspendReq(ctx context.Context, obj *model.User) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}

type unsuspendReqResolver struct{ *Resolver }

func (r *userResolver) Enable2fa(ctx context.Context, obj *model.User) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *voucherResolver) Description(ctx context.Context, obj *model.Voucher) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *newVoucherResolver) StartDate(ctx context.Context, obj *model.NewVoucher) (*time.Time, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *newVoucherResolver) EndDate(ctx context.Context, obj *model.NewVoucher) (*time.Time, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *voucherResolver) StartDate(ctx context.Context, obj *model.Voucher) (*time.Time, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *voucherResolver) EndDate(ctx context.Context, obj *model.Voucher) (*time.Time, error) {
	panic(fmt.Errorf("not implemented"))
}

type newVoucherResolver struct{ *Resolver }

func (r *cartResolver) Checked(ctx context.Context, obj *model.Cart) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *cartResolver) Note(ctx context.Context, obj *model.Cart) (*string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *cartResolver) CreatedAt(ctx context.Context, obj *model.Cart) (*time.Time, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *addressResolver) IsMain(ctx context.Context, obj *model.Address) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *productResolver) Discount(ctx context.Context, obj *model.Product) (int, error) {
	panic(fmt.Errorf("not implemented"))
}
