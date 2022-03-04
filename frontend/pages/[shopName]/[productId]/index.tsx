import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import Image from "next/image";

import noPhoto from "../../../public/images/productnophoto.png";
import defaultShop from "../../../public/images/productnophoto.png";

import s from "./detail.module.scss";
import Hide from "../../../components/common/Hide";

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = router.query;

  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(1);
  const [discount, setDiscount] = useState(0);

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
        stock
        price
        shop {
          id
          name
          image
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(productQuery, {
    variables: { id: productId },
  });

  useEffect(() => {
    setDiscount(data?.product?.discount);
    setPrice(
      data?.product?.price -
        (data?.product?.discount / 100) * data?.product?.price
    );
  }, [data]);

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
                      src={i.image}
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
                        src={i.image}
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
          <h1>Rp. {price}</h1>
          {discount && (
            <div>
              <span id={s.discount}>{discount}%</span>
              <span className={s.price}>Rp{data.product.price}</span>
            </div>
          )}
          <hr style={{ border: "1px solid #e0e0e0" }} />
          <p style={{ color: "#a1a1a1" }}>
            Kategori : {data?.product.category.name}
          </p>
          <p style={{ color: "#878787" }}>{data?.product.description}</p>
          <hr style={{ border: "1px solid #e0e0e0" }} />
          <div className={s.shopInfo}>
            <div className={s.shopPhoto}>
              <Image
                src={data ? data?.product?.shop?.image : defaultShop}
                alt="img"
                objectFit="cover"
                layout="fill"
              ></Image>
            </div>
            <h4>{data?.product?.shop?.name}</h4>
          </div>
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
              <input type="text" placeholder="Contoh: Warna Putih, Size M" />
            </Hide>
            <p className={s.price}>{data?.product?.price}</p>
            <div className={s.subtotal}>
              <p>Subtotal</p>
              <h3>Rp{price * stock}</h3>
            </div>
            <div className={s.btn}>
              <button id={s.beli}>Beli Langsung</button>
              <button id={s.cart}>+ Keranjang</button>
            </div>
          </form>
          <div className={s.action}>
            <div className={s.act}>
              <Link href={""}>
                <a>Chat</a>
              </Link>
            </div>
            <div className={s.act} id={s.mid}>
              <Link href={""}>
                <a>Wishlist</a>
              </Link>
            </div>
            <div className={s.act}>
              <Link href={""}>
                <a>Share</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
