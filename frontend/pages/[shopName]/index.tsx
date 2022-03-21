import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Card from "../../components/common/Card";
import Footer from "../../components/layout/Footer/Footer";
import LoggedNavbar from "../../components/layout/Navbar/LoggedNavbar";
import defaultShop from "../../public/images/shopnophoto.png";
import nophoto from "../../public/images/productnophoto.png";
import s from "./shop.module.scss";
import YouTube from "react-youtube";

const Shop = () => {
  const router = useRouter();
  const { shopName } = router.query;
  const [carousel, setCarousel] = useState(1);
  const [offset, setOffset] = useState(0);

  const shopQuery = gql`
    query shop($slug: String!) {
      shopBySlug(slug: $slug) {
        id
        name
        image
        slug
        reputationPoint
        promotionalVid
        promos {
          name
          image
        }
        products {
          id
        }
      }
    }
  `;

  const {
    loading: shopLoad,
    error: shopErr,
    data: shopData,
  } = useQuery(shopQuery, {
    variables: { slug: shopName },
  });

  let shop;
  if (shopData) {
    shop = shopData?.shopBySlug;
    console.log(shop);
  }

  const limit = 10;
  let nProd = shop?.products?.length;
  console.log(shop);
  let page = Math.floor(offset / limit) + 1;
  let pages =
    nProd % limit == 0
      ? Math.floor(nProd / limit)
      : Math.floor(nProd / limit + 1);

  const products = gql`
    query productsPaginate($limit: Int!, $offset: Int!, $shopID: String!) {
      productsPaginate(limit: $limit, offset: $offset, shopID: $shopID) {
        id
        name
        price
        stock
        images {
          image
        }
      }
    }
  `;

  const {
    loading: prodLoad,
    error: err,
    data: prod,
  } = useQuery(products, {
    variables: {
      limit: limit,
      offset: offset,
      shopID: shop?.id,
    },
  });
  console.log(prod);

  const searchQuery = gql`
    query searchProduct(
      $limit: Int
      $offset: Int
      $key: String!
      $sortBy: Int
      $filterBy: String
    ) {
      searchProduct(
        limit: $limit
        offset: $offset
        key: $key
        sortBy: $sortBy
        filterBy: $filterBy
      ) {
        id
        name
        price
        discount
        images {
          image
        }
      }
    }
  `;

  const {
    loading: allLoad,
    error: allError,
    data: all,
  } = useQuery(searchQuery, {
    variables: {
      key: "",
      limit: 10,
      offset: 0,
      sortBy: 6,
    },
  });

  const {
    loading: recLoad,
    error: recError,
    data: rec,
  } = useQuery(searchQuery, {
    variables: {
      key: "",
      limit: 10,
      offset: 0,
      sortBy: 4,
    },
  });

  if (shopLoad || prodLoad) {
    return <div>Loading ...</div>;
  }

  return (
    <div className={s.body}>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.container}>
        <Card className={s.profile}>
          <div className={s.img}>
            <Image
              src={shop?.image ? shop?.image : defaultShop}
              alt="shop"
              objectFit="contain"
              layout="fill"
            ></Image>
          </div>
          <div className={s.detail}>
            <h3>{shopName}</h3>
            <div className={s.badge}>
              <Image
                src={
                  shop?.reputationPoint > 150
                    ? "/images/diamond.png"
                    : shop?.reputationPoint > 100
                    ? "/images/gold.png"
                    : shop?.reputationPoint > 50
                    ? "/images/silver.png"
                    : "/images/bronze.png"
                }
                alt="badge"
                objectFit="contain"
                layout="fill"
              ></Image>
            </div>
          </div>
        </Card>
        <div className={s.carousel}>
          <div className={s.slider}>
            <div className={s.slides}>
              <div name="slide-1" id="slide-1">
                <div className={s.imgContainer}>
                  <Image
                    src="/images/promotion/1.jpg"
                    alt="img"
                    objectFit="cover"
                    layout="fill"
                  ></Image>
                </div>
              </div>
              <div name="slide-2" id="slide-2">
                <div className={s.imgContainer}>
                  <Image
                    src="/images/promotion/2.jpg"
                    alt="img"
                    objectFit="cover"
                    layout="fill"
                  ></Image>
                </div>
              </div>
              <div id="slide-3">
                <div className={s.imgContainer}>
                  <Image
                    src="/images/promotion/3.jpg"
                    alt="img"
                    objectFit="cover"
                    layout="fill"
                  ></Image>
                </div>
              </div>
              <div id="slide-4">
                <div className={s.imgContainer}>
                  <Image
                    src="/images/promotion/4.jpg"
                    alt="img"
                    objectFit="cover"
                    layout="fill"
                  ></Image>
                </div>
              </div>
              <div id="slide-5">
                <div className={s.imgContainer}>
                  <Image
                    src="/images/promotion/5.png"
                    alt="img"
                    objectFit="cover"
                    layout="fill"
                  ></Image>
                </div>
              </div>
            </div>

            <div
              className={s.left}
              onClick={() =>
                setCarousel(carousel - 1 < 1 ? carousel : carousel - 1)
              }
            >
              <Link href={`#slide-${carousel}`}>
                <a>{"<"}</a>
              </Link>
            </div>
            <div
              className={s.right}
              onClick={() =>
                setCarousel(carousel + 1 > 5 ? carousel : carousel + 1)
              }
            >
              <Link href={`#slide-${carousel}`}>
                <a>{">"}</a>
              </Link>
            </div>
          </div>
        </div>
        <div className={s.promo}>
          <div className={s.vid}>
            {shop?.promotionalVid && (
              <YouTube className={s.video} videoId={shop?.promotionalVid} />
            )}
          </div>
        </div>
        <div className={s.title}>
          <h3>Best Seller</h3>
        </div>
        <div className={s.cards}>
          {all?.searchProduct?.length > 0 ? (
            all?.searchProduct.map((p: any) => {
              return (
                <Card key={p?.id} className={s.card}>
                  <Link href={`/${shopName}/${p.id}`}>
                    <a>
                      <div className={s.info}>
                        <div className={s.img}>
                          <Image
                            src={p?.images[0] ? p?.images[0].image : nophoto}
                            alt="shop img"
                            layout="fill"
                            objectFit="cover"
                          ></Image>
                        </div>
                        <h4>{p?.name}</h4>
                      </div>
                      <div>
                        <span>Rp. {p.price}</span>
                      </div>
                      <div>
                        <span>Stock {p.stock}</span>
                      </div>
                    </a>
                  </Link>
                </Card>
              );
            })
          ) : (
            <tr>No products</tr>
          )}
        </div>
        <div className={s.title}>
          <h3>Recommended For You</h3>
        </div>
        <div className={s.cards}>
          {rec?.searchProduct?.length > 0 ? (
            rec?.searchProduct.map((p: any) => {
              return (
                <Card key={p?.id} className={s.card}>
                  <Link href={`/${shopName}/${p.id}`}>
                    <a>
                      <div className={s.info}>
                        <div className={s.img}>
                          <Image
                            src={p?.images[0] ? p?.images[0].image : nophoto}
                            alt="shop img"
                            layout="fill"
                            objectFit="cover"
                          ></Image>
                        </div>
                        <h4>{p?.name}</h4>
                      </div>
                      <div>
                        <span>Rp. {p.price}</span>
                      </div>
                      <div>
                        <span>Stock {p.stock}</span>
                      </div>
                    </a>
                  </Link>
                </Card>
              );
            })
          ) : (
            <tr>No products</tr>
          )}
        </div>
        <div className={s.title}>
          <h3>All Products</h3>
        </div>
        <div className={s.cards}>
          {prod?.productsPaginate?.length > 0 ? (
            prod?.productsPaginate.map((p: any) => {
              return (
                <Card key={p?.id} className={s.card}>
                  <Link href={`/${shopName}/${p.id}`}>
                    <a>
                      <div className={s.info}>
                        <div className={s.img}>
                          <Image
                            src={p?.images[0] ? p?.images[0].image : nophoto}
                            alt="shop img"
                            layout="fill"
                            objectFit="cover"
                          ></Image>
                        </div>
                        <h4>{p?.name}</h4>
                      </div>
                      <div>
                        <span>Rp. {p.price}</span>
                      </div>
                      <div>
                        <span>Stock {p.stock}</span>
                      </div>
                    </a>
                  </Link>
                </Card>
              );
            })
          ) : (
            <tr>No products</tr>
          )}
        </div>
        <div className={s.paginate}>
          {page - 1 > 0 && (
            <button onClick={() => setOffset(offset - limit)} className={s.act}>
              «
            </button>
          )}
          <p>{page}</p>
          {page + 1 <= pages && (
            <button onClick={() => setOffset(limit * page)} className={s.act}>
              »
            </button>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Shop;
