import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import noPhoto from "../../../public/images/productnophoto.png";
import Image from "next/image";
import s from "./cart.module.scss";
import Footer from "../../../components/layout/Footer/Footer";
import Card from "../../../components/common/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import Link from "next/link";
import { checkCookies } from "cookies-next";

const Cart = () => {
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const [voucherPopUp, setVoucherPopUp] = useState(false);
  const [voucherInput, setVoucherInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [chosen, setChosen] = useState();
  const [voucherID, setVoucherID] = useLocalStorage("voucher", "");
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  useEffect(() => {
    if (!checkCookies("user")) {
      Router.push("/");
    }
  });

  const getCartsQuery = gql`
    query carts {
      carts {
        id
        product {
          id
          name
          images {
            image
          }
          shop {
            id
            name
          }
          price
          discount
        }
        quantity
        note
        checked
      }
    }
  `;

  const { loading, error, data } = useQuery(getCartsQuery, {
    pollInterval: 1000,
  });

  const wishlistsQuery = gql`
    query wishlists {
      wishlists {
        id
        product {
          id
          name
          images {
            image
          }
          shop {
            name
          }
          price
          discount
        }
      }
    }
  `;

  const {
    loading: l,
    error: e,
    data: d,
  } = useQuery(wishlistsQuery, {
    pollInterval: 1000,
  });

  console.log(d);

  const updateCartQtyQuery = gql`
    mutation updateCartQty($id: String!, $qty: Int!) {
      updateCartQty(id: $id, qty: $qty) {
        id
      }
    }
  `;

  const [updateCartQty] = useMutation(updateCartQtyQuery);

  const deleteCartQuery = gql`
    mutation deleteCart($id: String!) {
      deleteCart(id: $id) {
        id
      }
    }
  `;

  const [deleteCart] = useMutation(deleteCartQuery);

  const removeFromWishlistQuery = gql`
    mutation removeFromWishlist($productId: String!) {
      removeFromWishlist(productId: $productId) {
        id
      }
    }
  `;

  const [removeFromWishlist] = useMutation(removeFromWishlistQuery);

  const checkCartQuery = gql`
    mutation checkCart($id: String!, $check: Boolean!) {
      checkCart(id: $id, check: $check) {
        id
      }
    }
  `;

  const [checkCart] = useMutation(checkCartQuery);

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

  const voucherQuery = gql`
    query vouchers {
      vouchers {
        id
        name
        description
        discountRate
        condition
        startDate
        endDate
        global
        shop {
          id
          name
        }
      }
    }
  `;

  const { loading: vLoad, error: vErr, data: vData } = useQuery(voucherQuery);
  console.log(vData);

  const vouchers = [];
  const carts = [];

  useEffect(() => {
    let totalPrice = 0;
    let totalDisc = 0;
    data?.carts.length > 0
      ? data?.carts.map((c: any, idx: any) => {
          if (c?.checked == true) {
            totalPrice += c?.product.price * c?.quantity;
            totalDisc +=
              (c?.product.discount / 100) * c?.product.price * c?.quantity;
          }
        })
      : null;

    setPrice(totalPrice);
    setDiscount(totalDisc);
  }, [data]);

  console.log(data);
  return (
    <div className={s.body}>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.container}>
        <div className={s.containerLeft}>
          <h3>Keranjang</h3>
          {data?.carts.length > 0 ? (
            data?.carts.map((c: any, idx: any) => {
              if (c?.checked) {
                carts.push(c);
              }
              return (
                <Card key={idx} className={s.cart}>
                  <h5>{c?.product?.shop?.name}</h5>
                  <div className={s.product}>
                    <input
                      type="checkbox"
                      checked={c?.checked}
                      onClick={async () => {
                        try {
                          await checkCart({
                            variables: {
                              id: c?.id,
                              check: !c?.checked,
                            },
                          });
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                    />

                    <div className={s.img}>
                      <Image
                        src={
                          c?.product?.images[0]
                            ? c?.product?.images[0].image
                            : noPhoto
                        }
                        alt="prod"
                        objectFit="cover"
                        layout="fill"
                      ></Image>
                    </div>
                    <div className={s.detail}>
                      <p>{c?.product?.name}</p>
                      {c?.product?.discount > 0 ? (
                        <div className={s.dets}>
                          <span>{c?.product.discount}%</span>
                          <p>Rp{c?.product.price}%</p>
                          <h5>
                            Rp
                            {c?.product?.price -
                              (c?.product.discount / 100) * c?.product?.price}
                          </h5>
                        </div>
                      ) : (
                        <div className={s.dets}>
                          <h5>{c?.product?.price}</h5>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={s.action}>
                    <div className={s.note}>
                      <p>{c?.note}</p>
                    </div>
                    <div className={s.btn}>
                      <div className={s.left}>
                        <p
                          onClick={async () => {
                            try {
                              await addToWishlist({
                                variables: {
                                  productId: c?.product?.id,
                                },
                              });
                              await deleteCart({
                                variables: {
                                  id: c?.id,
                                },
                              });
                            } catch (error) {
                              console.log(error);
                            }
                            Router.reload();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          Move to Wishlist
                        </p>
                        <p
                          onClick={async () => {
                            console.log(c?.id);
                            try {
                              await deleteCart({
                                variables: {
                                  id: c?.id,
                                },
                              });
                            } catch (error) {
                              console.log(error);
                            }
                            Router.reload();
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                        </p>
                      </div>
                      <div className={s.right}>
                        <span
                          onClick={async () => {
                            console.log(c?.quantity - 1);
                            try {
                              await updateCartQty({
                                variables: {
                                  id: c?.id,
                                  qty: c?.quantity - 1,
                                },
                              });
                            } catch (error) {
                              console.log(error);
                            }
                            // Router.reload();
                          }}
                        >
                          -
                        </span>
                        <p>
                          <input type="text" value={c?.quantity} />
                        </p>
                        <span
                          onClick={async () => {
                            console.log(c?.quantity + 1);
                            try {
                              await updateCartQty({
                                variables: {
                                  id: c?.id,
                                  qty: c?.quantity + 1,
                                },
                              });
                            } catch (error) {
                              console.log(error);
                            }
                            // Router.reload();
                          }}
                        >
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div>Keranjangmu kosong!</div>
          )}
        </div>
        <div className={s.containerRight}>
          <Card>
            <div
              className={s.promo}
              onClick={() => {
                setVoucherPopUp(true);
              }}
            >
              <h5>
                {chosen
                  ? `Kamu bisa hemat Rp${voucherDiscount}`
                  : "Makin hemat pakai promo >"}
              </h5>
            </div>
            <div className={s.summary}>
              <h4>Ringkasan belanja</h4>
              <div className={s.summaryUp}>
                <span>Total Harga ({carts.length} barang)</span>
                <span>Rp{price}</span>
              </div>
              <div className={s.summaryDown}>
                <span>Total Diskon Barang</span>
                <span>-Rp{discount + voucherDiscount}</span>
              </div>
              <div className={s.total}>
                <h4>Total Harga</h4>
                <h4>Rp{price - discount - voucherDiscount}</h4>
              </div>
              <div className={s.buy}>
                <button
                  onClick={() => {
                    Router.push("/user/cart/checkout");
                  }}
                >
                  Beli
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {voucherPopUp && (
        <div className={s.voucherCon}>
          <div className={s.popUp}>
            <div className={s.vTitle}>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setVoucherPopUp(false);
                }}
              >
                {"<"}
              </p>
              <h3>Pakai Promo</h3>
            </div>
            {chosen && (
              <div className={s.chosen}>
                <h4>1 promo dipilih</h4>
              </div>
            )}

            <div className={s.vInput}>
              <input
                type="text"
                defaultValue={chosen?.id}
                placeholder="Masukkan kode voucher"
                onChange={(e) => {
                  setVoucherInput(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  console.log(carts);

                  for (let i = 0; i < vouchers.length; i++) {
                    const vo = vouchers[i];
                    if (vo?.id == voucherInput) {
                      if (vo?.global) {
                        setChosen(vo);
                        setVoucherID(vo?.id);
                      } else {
                        for (let j = 0; j < carts.length; j++) {
                          const ca = carts[j];

                          if (ca?.product?.shop?.id == vo?.shop?.id) {
                            setChosen(vo);
                            setVoucherID(vo?.id);
                          } else {
                            break;
                          }
                        }
                      }
                      break;
                    }
                  }
                }}
              >
                Terapkan
              </button>
            </div>
            <p style={{ color: "red" }}>{errorMsg ? errorMsg : null}</p>
            <h4>Kupon Saya</h4>
            <div className={s.vouchers}>
              {vData?.vouchers?.length > 0
                ? vData?.vouchers?.map((v: any, idx: any) => {
                    vouchers.push(v);
                    return v?.global ? (
                      <Card key={idx} className={s.voucherCard}>
                        <h4>{v?.name}</h4>
                        <span>Kode: {v?.id}</span>
                        <p>{v?.description}</p>
                        <p>{v?.condition}</p>
                      </Card>
                    ) : null;
                  })
                : null}
            </div>
            <h4>Kupon Toko</h4>
            <div className={s.vouchers}>
              {vouchers?.length > 0
                ? vouchers?.map((v: any, idx: any) => {
                    return !v?.global ? (
                      <Card key={idx} className={s.voucherCard}>
                        <h4>{v?.name}</h4>
                        <span>Kode: {v?.id}</span>
                        <p>{v?.description}</p>
                        <p>{v?.condition}</p>
                      </Card>
                    ) : null;
                  })
                : null}
            </div>
            <div
              className={s.btn}
              onClick={() => {
                if (chosen) {
                  let chosendisc = 0;
                  if (chosen?.global == true) {
                    for (let i = 0; i < carts.length; i++) {
                      const c = carts[i];
                      console.log(c);
                      console.log(chosen);
                      // c?.price -= c?.price * chosen?.discountRate;
                      chosendisc +=
                        c?.product?.price * (chosen?.discountRate / 100);
                    }
                  } else {
                    for (let i = 0; i < carts.length; i++) {
                      const c = carts[i];
                      console.log(c);
                      if (c?.product?.shop?.id == chosen?.shop?.id) {
                        chosendisc +=
                          c?.product?.price * (chosen?.discountRate / 100);
                      }
                    }
                  }
                  setVoucherDiscount(chosendisc);
                  console.log(chosendisc);
                }
                setVoucherPopUp(false);
              }}
            >
              <button>Pakai promo</button>
            </div>
          </div>
        </div>
      )}
      <div className={s.wishlist}>
        {d?.wishlists.length > 0 ? (
          <div className={s.title}>
            <h4>Your wishlist misses you</h4>
            <Link href={"/user/wishlist"}>
              <a>
                <h4 style={{ color: "#03ac0e" }}>See more</h4>
              </a>
            </Link>
          </div>
        ) : null}
        <div className={s.wscroll}>
          <div className={s.wcontainer}>
            {d?.wishlists.length > 0 ? (
              d?.wishlists.map((p: any, idx: any) => {
                return idx < 5 ? (
                  <Card key={idx} className={s.wcard}>
                    <div className={s.wl}>
                      <div className={s.img}>
                        <Image
                          src={
                            p?.product?.images[0]
                              ? p?.product?.images[0].image
                              : noPhoto
                          }
                          alt="prod"
                          objectFit="cover"
                          layout="fill"
                        ></Image>
                      </div>
                      <div className={s.wlDets}>
                        <p>{p?.product?.name}</p>
                        <h5>Rp{p?.product.price}</h5>
                        <span>{p?.product.shop.name}</span>
                      </div>
                    </div>
                    <div className={s.acts}>
                      <p
                        onClick={async () => {
                          console.log(p);
                          try {
                            await removeFromWishlist({
                              variables: {
                                productId: p?.product.id,
                              },
                            });
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                      </p>
                      <button
                        onClick={async () => {
                          console.log(p);
                          try {
                            await addToCart({
                              variables: {
                                productId: p?.product.id,
                                quantity: 1,
                                note: "",
                              },
                            });
                            await removeFromWishlist({
                              variables: {
                                productId: p?.product.id,
                              },
                            });
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </Card>
                ) : null;
              })
            ) : (
              <div>Your wishlist is empty!</div>
            )}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Cart;

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
