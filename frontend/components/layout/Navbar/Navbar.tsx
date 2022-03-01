import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import styles from "./Navbar.module.scss";
import Button from "../../common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSearch } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
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
    </nav>
  );
};

export default Navbar;
