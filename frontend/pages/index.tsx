import { gql, useQuery } from "@apollo/client";
import { getCookie } from "cookies-next";
import type { NextPage } from "next";
import Image from "next/image";
import Card from "../components/common/Card";
import Footer from "../components/layout/Footer/Footer";
import LoggedNavbar from "../components/layout/Navbar/LoggedNavbar";
import s from "../styles/Home.module.scss";
import noPhoto from "../public/images/productnophoto.png";
import Link from "next/link";
import { useState } from "react";

const Home: NextPage = () => {
  const [carousel, setCarousel] = useState(1);
  console.log(getCookie("user"));

  const products = gql`
    query allProducts {
      allProducts {
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
  `;

  const { loading: l, error: err, data: prod } = useQuery(products);
  console.log(prod);

  if (l) {
    return <div>Loading...</div>;
  }

  let ctr = 0;

  return (
    <>
      <LoggedNavbar></LoggedNavbar>

      <div className={s.carousel}>
        <div className={s.slider}>
          <div className={s.slides}>
            <div name="slide-1" id="slide-1">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/1.jpg"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div name="slide-2" id="slide-2">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/2.jpg"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-3">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/3.jpg"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-4">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/4.jpg"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-5">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/5.png"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-6">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/6.png"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-7">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/7.png"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-8">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/8.jpg"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-9">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/9.jpg"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-10">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/10.jpg"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-11">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/11.png"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-12">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/12.jpg"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-13">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/13.png"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-14">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/14.jpg"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
            <div id="slide-15">
              <div className={s.imgContainer}>
                <Image
                  src="/images/promotion/15.jpg"
                  alt="img"
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
            </div>
          </div>

          <div
            className={s.left}
            onClick={() =>
              setCarousel(carousel - 1 < 1 ? carousel : carousel - 1)
            }
          >
            <Link href={`#slide-${carousel}`}>
              <a>{"<"}</a>
            </Link>
          </div>
          <div
            className={s.right}
            onClick={() =>
              setCarousel(carousel + 1 > 15 ? carousel : carousel + 1)
            }
          >
            <Link href={`#slide-${carousel}`}>
              <a>{">"}</a>
            </Link>
          </div>
        </div>
      </div>
      <div className={s.separate}>
        <h2>Lagi diskon nih!</h2>
      </div>
      <div className={s.container}>
        {prod?.allProducts?.length > 0
          ? prod?.allProducts.map((p: any, idx: any) => {
              return ctr < 15 && p?.discount > 0 ? (
                <Link key={idx} href={`/${p?.shop?.slug}/${p?.id}`}>
                  <a>
                    <span style={{ display: "none" }}>{ctr++}</span>

                    <Card className={s.card}>
                      <div className={s.img}>
                        <Image
                          src={
                            p?.images[0]?.image ? p?.images[0]?.image : noPhoto
                          }
                          alt="product"
                          objectFit="cover"
                          layout="fill"
                        ></Image>
                      </div>
                      <div className={s.dets}>
                        <p>{p?.name}</p>
                        <span id={s.disc}>{p?.discount}%</span>
                        <span>Rp{p?.price}</span>

                        <h5>Rp{p?.price - (p?.discount / 100) * p?.price}</h5>
                      </div>
                    </Card>
                  </a>
                </Link>
              ) : null;
            })
          : Array.from({ length: 16 }).map((x, idx) => (
              <Card
                key={idx}
                className={`${s.h64} ${s.animatePulse} ${s.bgSlate700}`}
              ></Card>
            ))}
      </div>
      <div className={s.separate}>
        <h2>Semua produk</h2>
      </div>
      <div className={s.container}>
        {prod?.allProducts?.length > 0
          ? prod?.allProducts.map((p: any, idx: any) => {
              return (
                <Link key={idx} href={`/${p?.shop?.slug}/${p?.id}`}>
                  <a>
                    <Card className={s.card}>
                      <div className={s.img}>
                        <Image
                          src={
                            p?.images[0]?.image ? p?.images[0]?.image : noPhoto
                          }
                          alt="product"
                          objectFit="cover"
                          layout="fill"
                        ></Image>
                      </div>
                      <div className={s.dets}>
                        <p>{p?.name}</p>
                        <h5>Rp{p?.price - (p?.discount / 100) * p?.price}</h5>
                      </div>
                    </Card>
                  </a>
                </Link>
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

export default Home;
