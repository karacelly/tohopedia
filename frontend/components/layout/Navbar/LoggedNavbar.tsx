import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import styles from "./Navbar.module.scss";
import noPhoto from "../../../public/images/productnophoto.png";
import defaultShop from "../../../public/images/shopnophoto.png";
import defaultUser from "../../../public/images/default_user.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSearch,
  faEnvelope,
  faBell,
  faSignOutAlt,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import Card from "../../common/Card";
import { checkCookies, removeCookies } from "cookies-next";
import Button from "../../common/Button";
import Router from "next/router";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Category from "../../../models/Category";

const LoggedNavbar = () => {
  const [haveShop, setHaveShop] = useState(false);
  const [query, setQuery] = useState("");

  const [userHover, setUserHover] = useState(false);
  const [shopHover, setShopHover] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const [catHover, setCatHover] = useState(false);
  const [inboxHover, setInboxHover] = useState(false);
  const [addPopUp, setAddPopUp] = useState(false);
  const [addressPopUp, setAddressPopUp] = useState(false);
  const [isMain, setMain] = useState(false);
  const [mainAdd, setMainAdd] = useState("Tangerang");

  const userHovering = () => {
    setUserHover(true);
    setShopHover(false);
    setCartHover(false);
    setCatHover(false);
    setInboxHover(false);
  };
  const userLeaving = () => setUserHover(false);
  const shopHovering = () => {
    setShopHover(true);
    setUserHover(false);
    setCartHover(false);
    setCatHover(false);
    setInboxHover(false);
  };
  const shopLeaving = () => setShopHover(false);
  const cartHovering = () => {
    setShopHover(false);
    setUserHover(false);
    setCartHover(true);
    setCatHover(false);
    setInboxHover(false);
  };
  const cartLeaving = () => setCartHover(false);
  const catHovering = () => {
    setShopHover(false);
    setUserHover(false);
    setCartHover(false);
    setCatHover(true);
    setInboxHover(false);
  };
  const catLeaving = () => setCatHover(false);
  const inboxHovering = () => {
    setShopHover(false);
    setUserHover(false);
    setCartHover(false);
    setCatHover(false);
    setInboxHover(true);
  };
  const inboxLeaving = () => setInboxHover(false);

  const getCurrentShopQuery = gql`
    query getCurrentShop {
      getCurrentShop {
        id
        name
        slug
        image
      }
    }
  `;

  const getCurrentUserQuery = gql`
    query getCurrentUser {
      getCurrentUser {
        name
        image
        role
        balance
        addresses {
          id
          label
          receiver
          phone
          city
          postalCode
          address
          isMain
        }
        carts {
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
          quantity
          note
          checked
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(getCurrentShopQuery);
  const { loading: l, error: e, data: user } = useQuery(getCurrentUserQuery);

  const addAddressQuery = gql`
    mutation addAddress(
      $label: String!
      $receiver: String!
      $phone: String!
      $city: String!
      $postalCode: String!
      $address: String!
      $isMain: Boolean!
    ) {
      addAddress(
        input: {
          label: $label
          receiver: $receiver
          phone: $phone
          city: $city
          postalCode: $postalCode
          address: $address
          isMain: $isMain
        }
      ) {
        id
      }
    }
  `;

  const [addAddress] = useMutation(addAddressQuery);

  const deleteAddressQuery = gql`
    mutation deleteAddress($id: String!) {
      deleteAddress(id: $id) {
        id
      }
    }
  `;

  const [deleteAddress] = useMutation(deleteAddressQuery);

  const setMainAddressQuery = gql`
    mutation setMainAddress($id: String!) {
      setMainAddress(id: $id) {
        id
      }
    }
  `;

  const [setMainAddress] = useMutation(setMainAddressQuery);

  const categoriesQuery = gql`
    query categories {
      categories {
        id
        name
      }
    }
  `;

  const {
    loading: catLoad,
    error: catErr,
    data: cats,
  } = useQuery(categoriesQuery);

  const validationSchema = yup.object().shape({
    label: yup.string().required(),
    receiver: yup.string().required(),
    phone: yup.string().required(),
    city: yup.string().required(),
    postalcode: yup.string().required(),
    address: yup.string().required(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  console.log(errors);

  async function onSubmit(data: any) {
    console.log("masuk");
    console.log(data);
    console.log(isMain);
    try {
      addAddress({
        variables: {
          label: data.label,
          receiver: data.receiver,
          phone: data.phone,
          city: data.city,
          postalCode: data.postalcode,
          address: data.address,
          isMain: isMain,
        },
      });
    } catch (error) {
      console.log(error);
    }

    setAddPopUp(false);
    Router.reload();
  }

  useEffect(() => {
    if (data) {
      setHaveShop(true);
    }

    if (user) {
      user?.getCurrentUser?.addresses?.length > 0
        ? user?.getCurrentUser?.addresses?.map((add: any) => {
            if (add?.isMain) {
              setMainAdd(add?.label);
            }
          })
        : null;
    }
  }, [data, user]);

  if (loading || l) {
    return <div>Loading...</div>;
  }

  if (e) {
    console.log(e);
  }

  console.log(user);
  console.log(data);

  return !checkCookies("user") ? (
    // NAVBAR DEFAULT
    <nav className={`${styles.shadow} ${styles.nav}`}>
      <div className={styles.navbar}>
        <div className={styles.navLogo}>
          <Link href="/">
            <a>
              <Image
                src={logo}
                alt="Logo"
                objectFit="contain"
                layout="fill"
              ></Image>
            </a>
          </Link>
        </div>
        <div className={styles.category}>
          <span onMouseEnter={catHovering}>Category</span>
        </div>
        <div className={styles.searchBar}>
          <input
            type="text"
            name="search"
            id="search"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link href={`/search?query=${query}`}>
            <a>
              <button type="submit">
                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
              </button>
            </a>
          </Link>
        </div>
        <div className={styles.cart}>
          <span onMouseEnter={cartHovering}>
            <FontAwesomeIcon icon={faShoppingCart}></FontAwesomeIcon>
          </span>
        </div>
        {cartHover && (
          <Card
            id={styles.cartHover}
            onMouseEnter={cartHovering}
            onMouseLeave={cartLeaving}
          >
            <div className={styles.cartContainer}>
              <span>Ups keranjangmu kosong! :(</span>
            </div>
          </Card>
        )}
        <div className={styles.user}>
          <Link href="/login" passHref>
            <a>
              <Button>Login</Button>
            </a>
          </Link>
          <Link href="/register" passHref>
            <a>
              <Button>Register</Button>
            </a>
          </Link>
        </div>
      </div>
      <div className={styles.userAddress}>
        <p>
          Dikirim ke <span>{mainAdd}</span>
        </p>
      </div>
      {catHover && (
        <div
          className={styles.categories}
          onMouseEnter={catHovering}
          onMouseLeave={catLeaving}
        >
          {cats?.categories?.length > 0
            ? cats?.categories?.map((category: Category) => {
                return (
                  <div key={category.id}>
                    <p>{category.name}</p>
                  </div>
                );
              })
            : null}
        </div>
      )}
    </nav>
  ) : // NAVBAR ADMIN
  user?.getCurrentUser?.role == "admin" ? (
    <div className={`${styles.nav} ${styles.shadow} `}>
      <div className={styles.navbar}>
        <div className={`${styles.up} ${styles.adminLeft}`}>
          <div className={styles.navLogo}>
            <Link href="/admin">
              <a>
                <Image
                  src={logo}
                  alt="Logo"
                  objectFit="contain"
                  layout="fill"
                ></Image>
              </a>
            </Link>
          </div>
          <div className={styles.searchBar}>
            <input
              type="text"
              name="search"
              id="search"
              onChange={(e) => setQuery(e.target.value)}
            />
            <Link href={`/search?query=${query}`}>
              <a>
                <button type="submit">
                  <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </button>
              </a>
            </Link>
          </div>
        </div>
        <div className={`${styles.down} ${styles.adminRight}`}>
          <Link href="" passHref>
            <a className={styles.logged}>
              <div className={styles.profile} onMouseEnter={userHovering}>
                <div className={styles.photo}>
                  <Image
                    src={
                      user?.getCurrentUser?.image
                        ? user?.getCurrentUser?.image != ""
                          ? user?.getCurrentUser?.image
                          : defaultUser
                        : defaultUser
                    }
                    alt="user"
                    objectFit="cover"
                    layout="fill"
                  ></Image>
                </div>
                <span>
                  {user?.getCurrentUser ? user?.getCurrentUser?.name : "Guest"}
                </span>
              </div>
            </a>
          </Link>
          {userHover && (
            <Card
              id={styles.userHover}
              onMouseEnter={userHovering}
              onMouseLeave={userLeaving}
            >
              <Card>
                <div className={styles.prof}>
                  <div className={styles.circle}>
                    <Image
                      src={
                        user?.getCurrentUser?.image
                          ? user?.getCurrentUser?.image != ""
                            ? user?.getCurrentUser?.image
                            : defaultUser
                          : defaultUser
                      }
                      alt="user"
                      objectFit="cover"
                      layout="fill"
                    ></Image>
                  </div>
                  <h3>
                    {user?.getCurrentUser
                      ? user?.getCurrentUser?.name
                      : "Guest"}
                  </h3>
                </div>
              </Card>
              <div className={styles.flex}>
                <div className={styles.flexRight}>
                  <div className={styles.navMenu}>
                    <Link href={"/admin/dashboard"}>
                      <a>
                        <p>Dashboard</p>
                      </a>
                    </Link>
                    <Link href={"/admin/user"}>
                      <a>
                        <p>User Management</p>
                      </a>
                    </Link>
                    <Link href={"/admin/voucher"}>
                      <a>
                        <p>Voucher Management</p>
                      </a>
                    </Link>
                  </div>
                  <div className={styles.logout}>
                    <Link href={"/login"}>
                      <a
                        onClick={() => {
                          removeCookies("user");
                        }}
                      >
                        <FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon>{" "}
                        <span>Keluar</span>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  ) : (
    // NAVBAR USER
    <div className={`${styles.nav} ${styles.shadow} `}>
      <div className={styles.navbar}>
        <div className={styles.up}>
          <div className={styles.navLogo}>
            <Link href="/">
              <a>
                <Image
                  src={logo}
                  alt="Logo"
                  objectFit="contain"
                  layout="fill"
                ></Image>
              </a>
            </Link>
          </div>
          <div className={styles.category}>
            <span onMouseEnter={catHovering}>Category</span>
          </div>
          <div className={styles.searchBar}>
            <input
              type="text"
              name="search"
              id="search"
              onChange={(e) => setQuery(e.target.value)}
            />
            <Link href={`/search?query=${query}`}>
              <a>
                <button type="submit">
                  <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </button>
              </a>
            </Link>
          </div>
        </div>
        <div className={styles.down}>
          <div className={styles.cart}>
            <Link href="/user/cart" passHref>
              <a onMouseEnter={cartHovering}>
                <span>
                  <FontAwesomeIcon icon={faShoppingCart}></FontAwesomeIcon>
                </span>
              </a>
            </Link>
            {cartHover && (
              <Card
                id={styles.cartHover}
                onMouseEnter={cartHovering}
                onMouseLeave={cartLeaving}
              >
                <div className={styles.conTitle}>
                  <span>Keranjang</span>
                </div>
                <div className={styles.cartContainer}>
                  {user?.getCurrentUser?.carts?.length > 0 ? (
                    user?.getCurrentUser?.carts?.map((cart: any, idx: any) => {
                      return (
                        <div className={styles.cartDetail} key={idx}>
                          <div className={styles.cartImg}>
                            <Image
                              src={
                                cart?.product?.images[0]?.image
                                  ? cart?.product?.images[0]?.image
                                  : noPhoto
                              }
                              alt="prod"
                              objectFit="contain"
                              layout="fill"
                            ></Image>
                          </div>
                          <div className={styles.separate}>
                            <div className={styles.cartDets}>
                              <h6>{cart?.product?.name}</h6>
                              <p>{cart?.quantity} barang</p>
                            </div>
                            <div className={styles.cartDets}>
                              <h6>
                                Rp. {cart?.product?.price * cart?.quantity}
                              </h6>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div>Ups, keranjangmu kosong!</div>
                  )}
                </div>
              </Card>
            )}
          </div>
          <div className={styles.cart}>
            <span>
              <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
            </span>
          </div>
          <div className={styles.cart}>
            <span onMouseEnter={inboxHovering}>
              <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
            </span>
          </div>
          {inboxHover && (
            <Card
              id={styles.inboxHover}
              onMouseEnter={inboxHovering}
              onMouseLeave={inboxLeaving}
            >
              <div className={styles.cartContainer}>
                <Link href={"/chat"}>
                  <a>
                    <p>Chat</p>
                  </a>
                </Link>
                <Link href={"/review"}>
                  <a>
                    <p>Ulasan</p>
                  </a>
                </Link>
              </div>
            </Card>
          )}
          <div className={styles.user}>
            <a className={styles.logged} onMouseEnter={shopHovering}>
              <div className={styles.profile}>
                <div className={styles.photo}>
                  <Image
                    src={
                      data?.getCurrentShop?.image
                        ? data?.getCurrentShop?.image
                        : defaultShop
                    }
                    alt="shop"
                    objectFit="cover"
                    layout="fill"
                  ></Image>
                </div>
                <span>{data ? data?.getCurrentShop?.name : "Shop"}</span>
              </div>
            </a>
            <Link href="" passHref>
              <a className={styles.logged}>
                <div className={styles.profile} onMouseEnter={userHovering}>
                  <div className={styles.photo}>
                    <Image
                      src={
                        user?.getCurrentUser?.image
                          ? user?.getCurrentUser?.image != ""
                            ? user?.getCurrentUser?.image
                            : defaultUser
                          : defaultUser
                      }
                      alt="user"
                      objectFit="cover"
                      layout="fill"
                    ></Image>
                  </div>
                  <span>
                    {user?.getCurrentUser
                      ? user?.getCurrentUser?.name
                      : "Guest"}
                  </span>
                </div>
              </a>
            </Link>
            {userHover && (
              <Card
                id={styles.userHover}
                onMouseEnter={userHovering}
                onMouseLeave={userLeaving}
              >
                <Card>
                  <div className={styles.prof}>
                    <div className={styles.circle}>
                      <Image
                        src={
                          user?.getCurrentUser?.image
                            ? user?.getCurrentUser?.image != ""
                              ? user?.getCurrentUser?.image
                              : defaultUser
                            : defaultUser
                        }
                        alt="user"
                        objectFit="cover"
                        layout="fill"
                      ></Image>
                    </div>
                    <h3>
                      {user?.getCurrentUser
                        ? user?.getCurrentUser?.name
                        : "Guest"}
                    </h3>
                  </div>
                </Card>
                <div className={styles.flex}>
                  <div className={styles.flexLeft}>
                    <div className={styles.saldo}>
                      <p>Saldo</p>
                      <p>Rp {user?.getCurrentUser?.balance}</p>
                    </div>
                    <Link href={"/user/topup"}>
                      <a>
                        <p>Top up</p>
                      </a>
                    </Link>
                    <Link href={"/user/reksadana"}>
                      <a>
                        <p>Reksadana</p>
                      </a>
                    </Link>
                    <Link href={"/user/redeem"}>
                      <a>
                        <p>Redeem Voucher</p>
                      </a>
                    </Link>
                  </div>
                  <div className={styles.flexRight}>
                    <div className={styles.navMenu}>
                      <Link href={"/user/purchase"}>
                        <a>
                          <p>Pembelian</p>
                        </a>
                      </Link>
                      <Link href={"/user/wishlist"}>
                        <a>
                          <p>Wishlist</p>
                        </a>
                      </Link>
                      <Link href={"/user/editProfile"}>
                        <a>
                          <p>Pengaturan</p>
                        </a>
                      </Link>
                    </div>
                    <div className={styles.logout}>
                      <Link href={"/login"}>
                        <a
                          onClick={() => {
                            removeCookies("user");
                          }}
                        >
                          <p>Keluar</p>
                          <FontAwesomeIcon
                            icon={faSignOutAlt}
                          ></FontAwesomeIcon>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {shopHover && (
              <Card
                id={styles.shopHover}
                onMouseEnter={shopHovering}
                onMouseLeave={shopLeaving}
              >
                <p>Mulai buka tokomu sekarang</p>
                <Link href="/openShop">
                  <a>
                    <button>Buka Toko</button>
                  </a>
                </Link>
              </Card>
            )}
            {shopHover && haveShop && (
              <Card
                id={styles.shopHover}
                onMouseEnter={shopHovering}
                onMouseLeave={shopLeaving}
              >
                <Link href={`/${data?.getCurrentShop?.slug}`} passHref>
                  <a>
                    <Card>
                      <div className={styles.prof}>
                        <div className={styles.circle}>
                          <Image
                            src={
                              data?.getCurrentShop?.image
                                ? data?.getCurrentShop?.image
                                : defaultShop
                            }
                            alt="user"
                            objectFit="cover"
                            layout="fill"
                          ></Image>
                        </div>
                        <h3>{data ? data?.getCurrentShop?.name : "Shop"}</h3>
                      </div>
                    </Card>
                  </a>
                </Link>
                <div className={styles.flex}>
                  <div className={styles.flexRight}>
                    <div className={styles.navMenu}>
                      <Link href={`/${data?.getCurrentShop?.slug}/allProduct`}>
                        <a>
                          <p>All Product</p>
                        </a>
                      </Link>
                      <Link href={`/${data?.getCurrentShop?.slug}/addProduct`}>
                        <a>
                          <p>Add Product</p>
                        </a>
                      </Link>
                      <Link href={`/${data?.getCurrentShop?.slug}/editShop`}>
                        <a>
                          <p>Shop Settings</p>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      <div className={styles.userAddress}>
        <p>
          Dikirim ke{" "}
          <span
            onClick={() => {
              setAddressPopUp(true);
            }}
          >
            {mainAdd}
          </span>
        </p>
      </div>
      {catHover && (
        <div
          className={styles.categories}
          onMouseEnter={catHovering}
          onMouseLeave={catLeaving}
        >
          {cats?.categories?.length > 0
            ? cats?.categories?.map((category: Category) => {
                return (
                  <div key={category.id}>
                    <p>{category.name}</p>
                  </div>
                );
              })
            : null}
        </div>
      )}
      {addressPopUp && (
        <div className={styles.innerCon}>
          <div className={styles.form}>
            <div
              className={styles.back}
              onClick={() => {
                setAddressPopUp(false);
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
            </div>
            <div className={styles.title}>
              <h3>Mau kirim belanjaan ke mana?</h3>
              <span>
                Biar pengalaman belanjamu lebih baik, pilih alamat dulu.
              </span>
            </div>
            <div className={styles.btn}>
              <button
                onClick={() => {
                  setAddPopUp(true);
                }}
              >
                Tambah Alamat Baru
              </button>
            </div>
            <div className={styles.list}>
              {user?.getCurrentUser?.addresses.length > 0 ? (
                user?.getCurrentUser?.addresses.map((add: any, idx: any) => {
                  return add.isMain ? (
                    <div
                      key={idx}
                      className={styles.address}
                      style={{ backgroundColor: "#ebffef" }}
                    >
                      <span>{add.label}</span>
                      <p>{add.receiver}</p>
                      <span>{add.phone}</span>
                      <span>{add.address}</span>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className={styles.address}
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <span>{add.label}</span>
                      <p>{add.receiver}</p>
                      <span>{add.phone}</span>
                      <span>{add.address}</span>
                      <div className={styles.action}>
                        <div
                          id={styles.mid}
                          onClick={async () => {
                            try {
                              await setMainAddress({
                                variables: {
                                  id: add.id,
                                },
                              });
                              Router.reload();
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          <p>Jadikan Alamat Utama</p>
                        </div>
                        <div
                          id={styles.end}
                          onClick={async () => {
                            try {
                              await deleteAddress({
                                variables: {
                                  id: add.id,
                                },
                              });
                              Router.reload();
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          <p>Hapus Alamat</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.err}>
                  <p>Tidak ada alamat</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {addPopUp && (
        <div className={styles.innerCon}>
          <div className={styles.form}>
            <div
              className={styles.back}
              onClick={() => {
                setAddPopUp(false);
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.field}>
                <h3>Lengkapi detail alamat</h3>
              </div>
              <div className={styles.field}>
                <label htmlFor="label">Label</label>
                <input type="text" {...register("label")} />
              </div>
              <div className={styles.field}>
                <label htmlFor="receiver">Nama Penerima</label>
                <input type="text" {...register("receiver")} />
              </div>
              <div className={styles.field}>
                <label htmlFor="phone">Nomor HP</label>
                <input type="text" {...register("phone")} />
              </div>
              <div className={styles.field}>
                <label htmlFor="city">Kota</label>
                <input type="text" {...register("city")} />
              </div>
              <div className={styles.field}>
                <label htmlFor="postalcode">Kode Pos</label>
                <input type="text" {...register("postalcode")} />
              </div>
              <div className={styles.field}>
                <label htmlFor="address">Alamat Lengkap</label>
                <textarea {...register("address")}></textarea>
              </div>
              <div className={styles.check}>
                <input
                  type="checkbox"
                  onChange={() => {
                    setMain(!isMain);
                  }}
                />{" "}
                Jadikan alamat utama
              </div>
              <div className={styles.submit}>
                <p>
                  Dengan klik “Simpan”, kamu menyetujui Syarat &#38; Ketentuan.
                </p>
                <button type="submit">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoggedNavbar;
