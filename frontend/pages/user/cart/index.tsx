import { gql, useQuery } from "@apollo/client";
import React from "react";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import noPhoto from "../../../public/images/productnophoto.png";
import Image from "next/image";
import s from "./cart.module.scss";
import Footer from "../../../components/layout/Footer/Footer";
import Card from "../../../components/common/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
  const getCartsQuery = gql`
    query carts {
      carts {
        id
        product {
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
      }
    }
  `;

  const { loading, error, data } = useQuery(getCartsQuery);

  console.log(data);
  return (
    <div className={s.body}>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.container}>
        <div className={s.containerLeft}>
          <h3>Keranjang</h3>
          {data?.carts.length > 0 ? (
            data?.carts.map((c: any, idx: any) => {
              return (
                <Card key={idx} className={s.cart}>
                  <h5>{c?.product?.shop?.name}</h5>
                  <div className={s.product}>
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
                        <p>Move to Wishlist</p>
                        <p>
                          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                        </p>
                      </div>
                      <div className={s.right}>
                        <span>-</span>
                        <p>
                          <input type="text" value={c?.quantity} />
                        </p>
                        <span>+</span>
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
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Cart;
