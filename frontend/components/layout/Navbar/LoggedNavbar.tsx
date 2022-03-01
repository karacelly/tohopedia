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
} from "@fortawesome/free-solid-svg-icons";
import { gql, useQuery } from "@apollo/client";

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

  console.log(data);
  return (
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
        <div className={styles.cart}>
          <span>
            <FontAwesomeIcon icon={faShoppingCart}></FontAwesomeIcon>
          </span>
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
            <a className="logged">
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
            <a className="logged">
              <div className={styles.profile}>
                <div className={styles.photo}>
                  <Image
                    src={data ? data.getCurrentShop.user.image : defaultUser}
                    alt="user"
                    objectFit="cover"
                    layout="fill"
                  ></Image>
                </div>
                <span>{data ? data?.getCurrentShop?.user?.name : "Guest"}</span>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LoggedNavbar;
