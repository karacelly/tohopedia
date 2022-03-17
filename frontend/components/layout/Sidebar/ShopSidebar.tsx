import React from "react";
import { gql, useQuery } from "@apollo/client";
import s from "./sidebar.module.scss";
import Image from "next/image";

import defaultShop from "../../../public/images/shopnophoto.png";
import Link from "next/link";
import Accordion from "../../common/Accordion";

const ShopSidebar = () => {
  const getCurrentShopQuery = gql`
    query getCurrentShop {
      getCurrentShop {
        id
        name
        slug
        image
        user {
          id
          name
          image
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(getCurrentShopQuery);

  return (
    <div className={s.sidebar}>
      <div className={s.profile}>
        <div className={s.profilePic}>
          <Image
            src={data ? data.getCurrentShop.image : defaultShop}
            alt="shop"
            objectFit="cover"
            layout="fill"
          ></Image>
        </div>
        <h2>{data ? data.getCurrentShop.name : "null"}</h2>
        <div className={s.navigation}>
          <Link href={`/${data?.getCurrentShop.name}/dashboard`}>
            <a className={s.link}>
              <h4>Dashboard</h4>
            </a>
          </Link>
          <Accordion title="Product">
            <div className={s.allProduct}>
              <Link href={`/${data?.getCurrentShop.slug}/allProduct`}>
                <a className={s.link}>
                  <span>All Product</span>
                </a>
              </Link>
              <Link href={`/${data?.getCurrentShop.slug}/addProduct`}>
                <a className={s.link}>
                  <span>Add Product</span>
                </a>
              </Link>
            </div>
          </Accordion>
          <Link href={`/${data?.getCurrentShop.slug}/voucher`}>
            <a className={s.link}>
              <h4>Voucher</h4>
            </a>
          </Link>
          <Link href={`/${data?.getCurrentShop.slug}/editShop`}>
            <a className={s.link}>
              <h4>Shop Settings</h4>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopSidebar;
