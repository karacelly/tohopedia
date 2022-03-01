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
	panic(fmt.Errorf("not implemented"))
}

func (r *cartResolver) User(ctx context.Context, obj *model.Cart) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *categoryResolver) Products(ctx context.Context, obj *model.Category) ([]*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
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

func (r *mutationResolver) CreateCategory(ctx context.Context, name string) (*model.Category, error) {
	db := config.GetDB()

	model := &model.Category{
		ID:   uuid.NewString(),
		Name: name,
	}

	err := db.Create(model).Error

	return model, err
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

func (r *productResolver) Images(ctx context.Context, obj *model.Product) ([]*model.ProductImage, error) {
	db := config.GetDB()
	var images []*model.ProductImage
	if err := db.Where("product_id = ?", obj.ID).Find(&images).Error; err != nil {
		return nil, err
	}

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
	panic(fmt.Errorf("not implemented"))
}

func (r *productMetadataResolver) Product(ctx context.Context, obj *model.ProductMetadata) (*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) User(ctx context.Context, id string) (*model.User, error) {
	return service.UserGetByID(ctx, id)
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
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Categories(ctx context.Context) ([]*model.Category, error) {
	db := config.GetDB()
	var models []*model.Category
	return models, db.Find(&models).Error
}

func (r *queryResolver) Products(ctx context.Context, limit int, offset int) ([]*model.Product, error) {
	db := config.GetDB()
	var models []*model.Product
	return models, db.Limit(limit).Offset(offset).Find(&models).Error
}

func (r *queryResolver) ProductsPaginate(ctx context.Context, limit int, offset int, shopID string) ([]*model.Product, error) {
	db := config.GetDB()
	var models []*model.Product
	return models, db.Limit(limit).Offset(offset).Where("shop_id = ?", shopID).Find(&models).Error
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

func (r *queryResolver) Protected(ctx context.Context) (string, error) {
	return "Success", nil
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

func (r *userResolver) Shop(ctx context.Context, obj *model.User) (*model.Shop, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Carts(ctx context.Context, obj *model.User) ([]*model.Cart, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Addresses(ctx context.Context, obj *model.User) ([]*model.Address, error) {
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

// Shop returns generated.ShopResolver implementation.
func (r *Resolver) Shop() generated.ShopResolver { return &shopResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type addressResolver struct{ *Resolver }
type authOpsResolver struct{ *Resolver }
type cartResolver struct{ *Resolver }
type categoryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type productResolver struct{ *Resolver }
type productImageResolver struct{ *Resolver }
type productMetadataResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type shopResolver struct{ *Resolver }
type userResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *productResolver) Discount(ctx context.Context, obj *model.Product) (int, error) {
	panic(fmt.Errorf("not implemented"))
}
