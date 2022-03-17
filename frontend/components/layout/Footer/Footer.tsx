import React from "react";
import Link from "next/link";
import s from "./Footer.module.scss";
import Image from "next/image";
import footer from "../../../public/images/footer.jpg";
import googlePlay from "../../../public/images/googlePlay.png";
import appStore from "../../../public/images/appStore.png";
import Button from "../../common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faPinterest,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import Card from "../../common/Card";

const Footer = () => {
  return (
    <Card>
      <footer className={s.footer}>
        <div className={s.footerLeft}>
          <div className={s.left}>
            <p className={s.title}>Tokopedia</p>
            <p>
              <a href="https://www.tokopedia.com/about/">About Tokopedia</a>
            </p>
            <p>
              <a href="https://www.tokopedia.com/careers/">Career</a>
            </p>
            <p>
              <a href="https://www.tokopedia.com/blog/">Blog</a>
            </p>
            <p>
              <a href="https://www.tokopedia.com/discovery/tokopoints">
                Toko Points
              </a>
            </p>
            <p>
              <a href="https://affiliate.tokopedia.com/">
                Tokopedia Affiliate Program
              </a>
            </p>
          </div>
          <div className={s.mid}>
            <p className={s.title}>Buy</p>
            <p>
              <a href="https://www.tokopedia.com/daftar-halaman/">
                Bill &#38; Top up
              </a>
            </p>
            <p>
              <Link href="">
                <a>Trade in Handphone</a>
              </Link>
            </p>
            <p>
              <Link href="">
                <a>Tokopedia COD</a>
              </Link>
            </p>
            <p className={s.title}>Sell</p>
            <p>
              <a href="https://seller.tokopedia.com/edu/">
                Seller Educative Center
              </a>
            </p>
            <p>
              <Link href="">
                <a>Mitra Toppers</a>
              </Link>
            </p>
            <p>
              <Link href="">
                <a>Register Official Store</a>
              </Link>
            </p>
          </div>
          <div className={s.right}>
            <p className={s.title}>Guide and Help</p>
            <p>
              <Link href="">
                <a>Tokopedia Care</a>
              </Link>
            </p>
            <p>
              <Link href="">
                <a>Terms and Condition</a>
              </Link>
            </p>
            <p>
              <Link href="">
                <a>Privacy</a>
              </Link>
            </p>
            <p className={s.title}>Follow Us</p>
            <div className={s.socmed}>
              <a href="https://facebook.com/tokopedia">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://twitter.com/tokopedia">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://www.pinterest.com/tokopedia/">
                <FontAwesomeIcon icon={faPinterest} />
              </a>
              <a href="https://www.instagram.com/tokopedia/">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>
        <div className={s.footerRight}>
          <Image src={footer} alt="footer" objectFit="contain"></Image>
          <div className={s.download}>
            <div className={s.left}>
              <Image src={googlePlay} alt="footer" objectFit="contain"></Image>
            </div>
            <div className={s.right}>
              <Image src={appStore} alt="footer" objectFit="contain"></Image>
            </div>
          </div>
          <a>&copy; Tohopedia by SY</a>
          <div className={s.lang}>
            <Button>Indonesia</Button>
            <Button>English</Button>
          </div>
        </div>
      </footer>
    </Card>
  );
};

export default Footer;
