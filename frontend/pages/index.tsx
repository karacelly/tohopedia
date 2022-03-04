import { gql, useQuery } from "@apollo/client";
import { getCookie } from "cookies-next";
import type { NextPage } from "next";
import Image from "next/image";
import Card from "../components/common/Card";
import Footer from "../components/layout/Footer/Footer";
import LoggedNavbar from "../components/layout/Navbar/LoggedNavbar";
import Navbar from "../components/layout/Navbar/Navbar";
import s from "../styles/Home.module.scss";
import noPhoto from "../public/images/productnophoto.png";
import { Router } from "next/router";
import Link from "next/link";

const Home: NextPage = () => {
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

  return getCookie("user") === undefined ? (
    <>
      <Navbar></Navbar>
      <Footer></Footer>
    </>
  ) : (
    <>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.container}>
        {prod?.allProducts?.length > 0
          ? prod?.allProducts.map((p: any, idx: any) => {
              return (
                <Link key={idx} href={`/${p?.shop?.slug}/${p?.id}`}>
                  <a>
                    <Card className={s.card}>
                      <div className={s.img}>
                        <Image
                          src={p.images[0] ? p.images[0].image : noPhoto}
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
