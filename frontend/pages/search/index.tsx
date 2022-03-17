import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import Footer from "../../components/layout/Footer/Footer";
import LoggedNavbar from "../../components/layout/Navbar/LoggedNavbar";
import Image from "next/image";
import noPhoto from "../../public/images/productnophoto.png";
import shopDefault from "../../public/images/shopnophoto.png";

import s from "./search.module.scss";
import Link from "next/link";

const Search = () => {
  const { query } = useRouter();
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState(1);
  console.log(query.query);

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

  const topShopQuery = gql`
    query searchShop($key: String!) {
      searchShop(key: $key) {
        name
        slug
        image
        description
        products {
          id
          name
          price
          discount
          images {
            image
          }
        }
      }
    }
  `;

  const limit = 25;
  const {
    loading: allLoad,
    error: allError,
    data: all,
  } = useQuery(searchQuery, {
    variables: {
      key: query?.query,
    },
  });

  const {
    loading: resLoad,
    error: resError,
    data: result,
  } = useQuery(searchQuery, {
    variables: {
      limit: limit,
      offset: offset,
      key: query?.query,
      sortBy: sort,
    },
  });

  const {
    loading: topLoad,
    error: topError,
    data: top,
  } = useQuery(topShopQuery, {
    variables: {
      key: query?.query,
    },
  });

  let allProducts = all?.searchProduct;
  let resultProducts = result?.searchProduct;

  let nProd = allProducts?.length;
  let page = Math.floor(offset / limit) + 1;
  let pages =
    nProd % limit == 0
      ? Math.floor(nProd / limit)
      : Math.floor(nProd / limit + 1);

  console.log(allProducts);
  console.log(resultProducts);

  let topShop;
  if (top) {
    topShop = top?.searchShop;
  }
  console.log(topShop);

  if (resLoad || allLoad) {
    return <div>Loading...</div>;
  }

  return (
    <div className={s.body}>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.container}>
        <div className={s.filter}>
          <h3>Filter</h3>
        </div>
        <div className={s.result}>
          <Card className={s.top}>
            <div className={s.topShop}>
              <Link href={`/${topShop?.slug}`}>
                <a>
                  <div className={s.shopImg}>
                    <Image
                      src={topShop?.image ? topShop?.image : shopDefault}
                      alt="shop"
                      objectFit="contain"
                      layout="fill"
                    ></Image>
                  </div>
                  <span>{topShop?.name}</span>
                  <h5>{topShop?.description}</h5>
                </a>
              </Link>
            </div>
            <div className={s.topProducts}>
              {topShop?.products?.length > 0
                ? topShop?.products?.slice(0, 3).map((prod: any, idx: any) => {
                    return (
                      <Link key={idx} href={`/${topShop?.slug}/${prod?.id}`}>
                        <a>
                          <div className={s.card}>
                            <div className={s.cardImg}>
                              <Image
                                src={
                                  prod?.images[0]?.image
                                    ? prod?.images[0]?.image
                                    : noPhoto
                                }
                                alt="shop"
                                objectFit="contain"
                                layout="fill"
                              ></Image>
                            </div>
                            <p>{prod?.name}</p>
                            <h4>
                              Rp
                              {prod?.discount > 0
                                ? prod?.price -
                                  (prod?.discount / 100) * prod?.price
                                : prod?.price}
                            </h4>
                            <div className={s.discount}>
                              <span id={s.disc}>
                                {prod?.discount > 0
                                  ? prod?.discount + "%"
                                  : null}
                              </span>
                              <span id={s.price}>
                                {prod?.discount > 0 ? prod?.price : null}
                              </span>
                            </div>
                          </div>
                        </a>
                      </Link>
                    );
                  })
                : null}
            </div>
          </Card>
          <div className={s.sort}>
            <select
              onChange={(e) => {
                setSort(parseInt(e.target.value.toString()));
              }}
            >
              <option value="1">Paling sesuai</option>
              <option value="2">Added time</option>
              <option value="3">Rating</option>
              <option value="4">Highest price</option>
              <option value="5">Lowest price</option>
            </select>
          </div>
          <div className={s.all}>
            {resultProducts?.length > 0
              ? resultProducts?.map((prod: any, idx: any) => {
                  return (
                    <Link key={idx} href={`/${prod?.shop?.slug}/${prod?.id}`}>
                      <a className={s.cardCon}>
                        <Card className={s.card}>
                          <div className={s.cardImg}>
                            <Image
                              src={
                                prod?.images[0]?.image
                                  ? prod?.images[0]?.image
                                  : noPhoto
                              }
                              alt="shop"
                              objectFit="contain"
                              layout="fill"
                            ></Image>
                          </div>
                          <p>{prod?.name}</p>
                          <h4>
                            Rp
                            {prod?.discount > 0
                              ? prod?.price -
                                (prod?.discount / 100) * prod?.price
                              : prod?.price}
                          </h4>
                          <div className={s.discount}>
                            <span id={s.disc}>
                              {prod?.discount > 0 ? prod?.discount + "%" : null}
                            </span>
                            <span id={s.price}>
                              {prod?.discount > 0 ? prod?.price : null}
                            </span>
                          </div>
                        </Card>
                      </a>
                    </Link>
                  );
                })
              : null}
          </div>
          <div className={s.paginate}>
            {page - 1 > 0 && (
              <button
                onClick={() => setOffset(offset - limit)}
                className={s.act}
              >
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
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Search;
