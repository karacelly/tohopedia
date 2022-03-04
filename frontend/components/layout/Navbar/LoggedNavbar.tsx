import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import styles from "./Navbar.module.scss";
import Button from "../../common/Button";
import defaultShop from "../../../public/images/shopnophoto.png";
import defaultUser from "../../../public/images/default_user.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSearch,
  faEnvelope,
  faBell,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { gql, useQuery } from "@apollo/client";
import Card from "../../common/Card";

const LoggedNavbar = () => {
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

  const { loading, error, data } = useQuery(getCurrentShopQuery);

  const [userHover, setUserHover] = useState(false);
  const [shopHover, setShopHover] = useState(false);
  const userHovering = () => {
    setUserHover(true);
    setShopHover(false);
  };
  const userLeaving = () => setUserHover(false);
  const shopHovering = () => {
    setShopHover(true);
    setUserHover(false);
  };
  const shopLeaving = () => setShopHover(false);

  console.log(data);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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
            <span>Category</span>
          </div>
          <div className={styles.searchBar}>
            <form action="">
              <input type="text" name="search" id="search" />
              <button type="submit">
                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
              </button>
            </form>
          </div>
        </div>
        <div className={styles.down}>
          <div className={styles.cart}>
            <Link href="/user/cart" passHref>
              <a>
                <span>
                  <FontAwesomeIcon icon={faShoppingCart}></FontAwesomeIcon>
                </span>
              </a>
            </Link>
          </div>
          <div className={styles.cart}>
            <span>
              <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
            </span>
          </div>
          <div className={styles.cart}>
            <span>
              <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
            </span>
          </div>
          <div className={styles.user}>
            <Link href="/seller/dashboard" passHref>
              <a className={styles.logged} onMouseEnter={shopHovering}>
                <div className={styles.profile}>
                  <div className={styles.photo}>
                    <Image
                      src={data ? data.getCurrentShop.image : defaultShop}
                      alt="shop"
                      objectFit="cover"
                      layout="fill"
                    ></Image>
                  </div>
                  <span>{data ? data?.getCurrentShop?.name : "Shop"}</span>
                </div>
              </a>
            </Link>
            <Link href="" passHref>
              <a className={styles.logged}>
                <div className={styles.profile} onMouseEnter={userHovering}>
                  <div className={styles.photo}>
                    <Image
                      src={data ? data.getCurrentShop.user.image : defaultUser}
                      alt="user"
                      objectFit="cover"
                      layout="fill"
                    ></Image>
                  </div>
                  <span>
                    {data ? data?.getCurrentShop?.user?.name : "Guest"}
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
                          data ? data.getCurrentShop.user.image : defaultUser
                        }
                        alt="user"
                        objectFit="cover"
                        layout="fill"
                      ></Image>
                    </div>
                    <h3>{data ? data?.getCurrentShop?.user?.name : "Guest"}</h3>
                  </div>
                </Card>
                <div className={styles.flex}>
                  <div className={styles.flexLeft}>
                    <div className={styles.saldo}>
                      <p>Saldo</p>
                      <p>Rp 0</p>
                    </div>
                  </div>
                  <div className={styles.flexRight}>
                    <div className={styles.navMenu}>
                      <Link href={""}>
                        <a>
                          <p>Pembelian</p>
                        </a>
                      </Link>
                      <Link href={""}>
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
                      <Link href={""}>
                        <a>
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
                <Card>
                  <div className={styles.prof}>
                    <div className={styles.circle}>
                      <Image
                        src={data ? data.getCurrentShop.image : defaultUser}
                        alt="user"
                        objectFit="cover"
                        layout="fill"
                      ></Image>
                    </div>
                    <h3>{data ? data?.getCurrentShop?.name : "Guest"}</h3>
                  </div>
                </Card>
                <div className={styles.flex}>
                  <div className={styles.flexRight}>
                    <div className={styles.navMenu}>
                      <Link href="/seller/allProduct">
                        <a>
                          <p>All Product</p>
                        </a>
                      </Link>
                      <Link href="/seller/addProduct">
                        <a>
                          <p>Add Product</p>
                        </a>
                      </Link>
                      <Link href="/seller/editShop">
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
    </div>
  );
};

export default LoggedNavbar;
