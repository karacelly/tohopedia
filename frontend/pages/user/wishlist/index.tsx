import React, { useState } from "react";
import Card from "../../../components/common/Card";
import Footer from "../../../components/layout/Footer/Footer";
import Image from "next/image";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import { gql, useMutation, useQuery } from "@apollo/client";
import s from "./wishlist.module.scss";
import Link from "next/link";
import noPhoto from "../../../public/images/productnophoto.png";
import Router from "next/router";

const Wishlist = () => {
  const [edit, setEdit] = useState(false);
  const [toDelete, setToDelete] = useState<String[]>([]);

  function handleAddToDelete(id: String) {
    const addToDelete = [...toDelete, id];

    setToDelete(addToDelete);
  }

  const wishlists = gql`
    query wishlists {
      wishlists {
        product {
          id
          name
          price
          stock
          discount
          images {
            image
          }
          shop {
            name
            slug
          }
        }
      }
    }
  `;

  const { loading: l, error: err, data: prod } = useQuery(wishlists);

  const removeFromWishlistQuery = gql`
    mutation removeFromWishlist($productId: String!) {
      removeFromWishlist(productId: $productId) {
        id
      }
    }
  `;

  const [removeFromWishlist] = useMutation(removeFromWishlistQuery);

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

  console.log(prod);
  return (
    <>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.title}>
        <h2>Wishlist</h2>
        <div className={s.btn}>
          {!edit && (
            <button onClick={() => setEdit(!edit)}>Change Wishlist</button>
          )}
        </div>
        {edit && (
          <div className={s.btnCon}>
            <div className={s.btn}>
              <button
                onClick={() => {
                  let checks = document.getElementsByClassName("check");
                  console.log(checks[0]?.value);

                  if (checks?.length > 0) {
                    for (let i = 0; i < checks?.length; i++) {
                      if (checks[i]?.checked) {
                        removeFromWishlist({
                          variables: {
                            productId: checks[i]?.value,
                          },
                        })
                          .then(() => {
                            Router.reload();
                          })
                          .catch((e) => {
                            console.log(e);
                          });
                      }
                    }
                  }
                }}
              >
                Delete Wishlist
              </button>
            </div>
            <div className={s.btn}>
              <button onClick={() => setEdit(!edit)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      <div className={s.container}>
        {prod?.wishlists?.length > 0
          ? prod?.wishlists.map((p: any, idx: any) => {
              return edit ? (
                <Card key={idx} className={s.card}>
                  <Link href={`/${p?.product.shop?.slug}/${p?.product.id}`}>
                    <a>
                      <div className={s.img}>
                        <Image
                          src={
                            p?.product?.images[0]?.image
                              ? p?.product.images[0]?.image
                              : noPhoto
                          }
                          alt="product"
                          objectFit="cover"
                          layout="fill"
                        ></Image>
                      </div>
                      <div className={s.dets}>
                        <p>{p?.product.name}</p>
                        <h5>
                          Rp
                          {p?.product.price -
                            (p?.product?.discount / 100) * p?.product?.price}
                        </h5>
                      </div>
                    </a>
                  </Link>
                  <div className={s.btn}>
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
                      Buy
                    </button>
                  </div>
                  <Card className={s.shadow}>
                    <input
                      type="checkbox"
                      className="check"
                      value={p?.product.id}
                    />
                  </Card>
                </Card>
              ) : (
                <Card key={idx} className={s.card}>
                  <Link href={`/${p?.product.shop?.slug}/${p?.product.id}`}>
                    <a>
                      <div className={s.img}>
                        <Image
                          src={
                            p?.product?.images[0]?.image
                              ? p?.product.images[0]?.image
                              : noPhoto
                          }
                          alt="product"
                          objectFit="cover"
                          layout="fill"
                        ></Image>
                      </div>
                      <div className={s.dets}>
                        <p>{p?.product.name}</p>
                        <h5>
                          Rp
                          {p?.product.price -
                            (p?.product?.discount / 100) * p?.product?.price}
                        </h5>
                      </div>
                    </a>
                  </Link>
                  <div className={s.btn}>
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
                      Buy
                    </button>
                  </div>
                </Card>
              );
            })
          : Array.from({ length: 16 }).map((x, idx) => (
              <Card
                key={idx}
                className={`${s.h64} ${s.animatePulse} ${s.bgSlate700}`}
              ></Card>
            ))}
      </div>
      <Footer></Footer>
    </>
  );
};

export default Wishlist;
