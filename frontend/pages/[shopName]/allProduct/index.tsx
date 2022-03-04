import { gql, useQuery } from "@apollo/client";
import { Card } from "@material-ui/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Footer from "../../../components/layout/Footer/Footer";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import ShopSidebar from "../../../components/layout/Sidebar/ShopSidebar";
import s from "./allProduct.module.scss";

const AllProducts = () => {
  const router = useRouter();
  const { shopName } = router.query;

  const getCurrentShopQuery = gql`
    query getCurrentShop {
      getCurrentShop {
        id
        name
        slug
        image
        products {
          id
          name
          price
          stock
          images {
            image
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(getCurrentShopQuery);

  console.log(data);

  const [offset, setOffset] = useState(0);
  const limit = 10;
  let nProd = data?.getCurrentShop?.products?.length;
  let page = offset / limit + 1;
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
    loading: l,
    error: err,
    data: prod,
  } = useQuery(products, {
    variables: {
      limit: limit,
      offset: offset,
      shopID: data?.getCurrentShop?.id,
    },
  });
  console.log(offset);

  console.log(prod);

  return (
    <div>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.body}>
        <div className={s.hide}>
          <ShopSidebar></ShopSidebar>
        </div>
        <div className={s.container}>
          <div className={s.title}>
            <h3>All Products</h3>
          </div>
          <div className={s.card}>
            <Card>
              <table>
                <tr>
                  <th>Product Info</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
                {prod?.productsPaginate?.length > 0 ? (
                  prod?.productsPaginate.map((p: any) => {
                    return (
                      <tr key={p?.id}>
                        <td className={s.info}>
                          <div className={s.img}>
                            <Image
                              src={p?.images[0].image}
                              alt="shop img"
                              layout="fill"
                              objectFit="cover"
                            ></Image>
                          </div>
                          <span>{p?.name}</span>
                        </td>
                        <td>
                          <span>Rp. {p.price}</span>
                        </td>
                        <td>
                          <span>{p.stock}</span>
                        </td>
                        <td>
                          <Link href={`/${shopName}/${p.id}`}>
                            <a>
                              <button>Detail</button>
                            </a>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>No products</tr>
                )}
              </table>
            </Card>
            <div className={s.paginate}>
              {offset - 1 >= 0 && (
                <button onClick={() => setOffset(offset - 1)} className={s.act}>
                  «
                </button>
              )}
              <p>{page}</p>
              {page + 1 <= pages && (
                <button
                  onClick={() => setOffset(limit * (page - 1) + 1)}
                  className={s.act}
                >
                  »
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default AllProducts;
