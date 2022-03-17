import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import Image from "next/image";

import noPhoto from "../../../public/images/productnophoto.png";
import defaultShop from "../../../public/images/productnophoto.png";

import s from "./detail.module.scss";
import Hide from "../../../components/common/Hide";
import {
  faHeart,
  faMailBulk,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../../../components/layout/Footer/Footer";

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = router.query;

  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [wishlist, setWishlist] = useState(false);

  const [shopProd, setShopProd] = useState(false);

  const getCurrentShopQuery = gql`
    query getCurrentShop {
      getCurrentShop {
        id
        name
        slug
        image
        user {
          name
          image
        }
      }
    }
  `;

  const {
    loading: load,
    error: err,
    data: currShop,
  } = useQuery(getCurrentShopQuery);

  const productQuery = gql`
    query product($id: ID!) {
      product(id: $id) {
        name
        images {
          image
        }
        description
        category {
          name
        }
        discount
        sold
        stock
        price
        shop {
          id
          name
          image
          slug
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(productQuery, {
    variables: { id: productId },
  });

  useEffect(() => {
    if (data?.product?.shop?.id == currShop?.getCurrentShop.id) {
      setShopProd(true);
    }
  }, [data, currShop]);

  console.log(shopProd);

  const addToCartQuery = gql`
    mutation addToCart($productId: String!, $quantity: Int!, $note: String!) {
      addToCart(
        input: { productId: $productId, quantity: $quantity, note: $note }
      ) {
        id
      }
    }
  `;

  const [addToCart] = useMutation(addToCartQuery);

  const addToWishlistQuery = gql`
    mutation addToWishlist($productId: String!) {
      addToWishlist(productId: $productId) {
        id
      }
    }
  `;

  const [addToWishlist] = useMutation(addToWishlistQuery);

  useEffect(() => {
    setDiscount(data?.product?.discount);
    setPrice(
      data?.product?.price -
        (data?.product?.discount / 100) * data?.product?.price
    );
  }, [data]);

  console.log(data);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className={s.body}>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.container}>
        <div className={s.slider}>
          <div className={s.slides}>
            {data?.product?.images?.length > 0 ? (
              data?.product?.images?.map((i: any, idx: any) => {
                return (
                  <div id={idx} key={idx}>
                    <Image
                      src={i?.image ? i.image : noPhoto}
                      alt="img"
                      objectFit="cover"
                      layout="fill"
                    ></Image>
                  </div>
                );
              })
            ) : (
              <div>
                <Image
                  src={noPhoto}
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            )}
          </div>
          {data?.product?.images?.length > 0
            ? data?.product?.images?.map((i: any, idx: any) => {
                return (
                  <Link key={idx} href={`#${idx}`} scroll={false}>
                    <a>
                      <Image
                        src={i?.image ? i?.image : noPhoto}
                        alt="img"
                        objectFit="cover"
                        layout="fill"
                      ></Image>
                    </a>
                  </Link>
                );
              })
            : null}
        </div>
        <div className={s.info}>
          <h3>{data?.product?.name}</h3>
          <span>Terjual {data?.product?.sold}</span>
          <h1>Rp. {price}</h1>
          {discount && (
            <div>
              <span id={s.discount}>{discount}%</span>
              <span className={s.price}>Rp{data.product.price}</span>
            </div>
          )}
          <hr style={{ border: "1px solid #e0e0e0" }} />
          <p style={{ color: "#a1a1a1" }}>
            Kategori : {data?.product?.category.name}
          </p>
          <p style={{ color: "#878787" }}>{data?.product.description}</p>
          <hr style={{ border: "1px solid #e0e0e0" }} />
          <Link href={`/${data?.product?.shop?.slug}`}>
            <a>
              <div className={s.shopInfo}>
                <div className={s.shopPhoto}>
                  <Image
                    src={
                      data?.product?.shop?.image
                        ? data?.product?.shop?.image
                        : defaultShop
                    }
                    alt="img"
                    objectFit="cover"
                    layout="fill"
                  ></Image>
                </div>
                <h4>{data?.product?.shop?.name}</h4>
              </div>
            </a>
          </Link>
        </div>
        <div className={s.stock}>
          <h4>Atur jumlah dan catatan</h4>
          <form action="">
            <div className={s.stockInfo}>
              <input
                type="number"
                value={stock}
                min={1}
                max={data?.product?.stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
              />
              Stok{" "}
              <span style={{ fontWeight: "bold" }}>{data?.product.stock}</span>
            </div>
            <Hide
              text="Tambahkan Catatan"
              cancel="Batalkan Catatan"
              className={s.green}
            >
              <input
                type="text"
                placeholder="Contoh: Warna Putih, Size M"
                onChange={(e) => setNote(e.target.value)}
              />
            </Hide>
            <p className={s.price}>{data?.product?.price}</p>
            <div className={s.subtotal}>
              <p>Subtotal</p>
              <h3>Rp{price * stock}</h3>
            </div>
            {!shopProd && (
              <div className={s.btn}>
                <button id={s.beli}>Beli Langsung</button>
                <button
                  id={s.cart}
                  onClick={async (e) => {
                    e.preventDefault();

                    try {
                      console.log(productId);
                      console.log(stock);
                      console.log(note);
                      await addToCart({
                        variables: {
                          productId: productId,
                          quantity: stock,
                          note: note,
                        },
                      });
                    } catch (error) {
                      console.log(error);
                    }
                    Router.push("/user/cart");
                  }}
                >
                  + Keranjang
                </button>
              </div>
            )}
            {shopProd && (
              <div className={s.btn}>
                <button id={s.beli}>Ubah Produk</button>
                <button
                  id={s.cart}
                  onClick={async (e) => {
                    e.preventDefault();
                  }}
                >
                  + Hapus Produk
                </button>
              </div>
            )}
          </form>
          <div className={s.action}>
            <div className={s.act}>
              <FontAwesomeIcon
                style={{ color: "gray" }}
                icon={faMailBulk}
              ></FontAwesomeIcon>
              <Link href={""}>
                <a>Chat</a>
              </Link>
            </div>
            <div className={s.act} id={s.mid}>
              {wishlist ? (
                <FontAwesomeIcon
                  style={{ color: "red" }}
                  icon={faHeart}
                ></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon
                  style={{ color: "gray" }}
                  icon={faHeart}
                ></FontAwesomeIcon>
              )}

              <a
                onClick={async (e) => {
                  e.preventDefault();

                  try {
                    await addToWishlist({
                      variables: {
                        productId: productId,
                      },
                    });
                    setWishlist(true);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Wishlist
              </a>
            </div>
            <div className={s.act}>
              <FontAwesomeIcon
                style={{ color: "gray" }}
                icon={faShare}
              ></FontAwesomeIcon>
              <Link href={""}>
                <a>Share</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ProductDetail;
