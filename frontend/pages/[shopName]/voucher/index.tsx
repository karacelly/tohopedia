import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import Card from "../../../components/common/Card";
import Footer from "../../../components/layout/Footer/Footer";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import ShopSidebar from "../../../components/layout/Sidebar/ShopSidebar";
import s from "./voucher.module.scss";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";

const Voucher = () => {
  const [addPopUp, setAddPopUp] = useState(false);

  const getCurrentShopQuery = gql`
    query getCurrentShop {
      getCurrentShop {
        id
        name
        slug
        image
        products {
          id
          name
          price
          stock
          images {
            image
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(getCurrentShopQuery);

  console.log(data);

  const shopVouchersQuery = gql`
    query shopVouchers($shopID: String!) {
      shopVouchers(shopId: $shopID) {
        id
        name
        description
        discountRate
        condition
        startDate
        endDate
        global
      }
    }
  `;

  const {
    loading: l,
    error: e,
    data: shop,
  } = useQuery(shopVouchersQuery, {
    variables: {
      shopID: data?.getCurrentShop?.id,
    },
  });

  console.log(shop);

  const addVoucherQuery = gql`
    mutation addVoucher(
      $name: String!
      $description: String!
      $discountRate: Int!
      $condition: String!
      $startDate: Time!
      $endDate: Time!
      $global: Boolean!
      $shopID: String
    ) {
      addVoucher(
        input: {
          name: $name
          description: $description
          discountRate: $discountRate
          condition: $condition
          startDate: $startDate
          endDate: $endDate
          global: $global
          shopID: $shopID
        }
      ) {
        id
      }
    }
  `;

  const [addVoucher] = useMutation(addVoucherQuery);

  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  async function onSubmit(values: any) {
    console.log(values);
    try {
      await addVoucher({
        variables: {
          name: values.name,
          description: values.description,
          discountRate: values.discountRate,
          condition: values.condition,
          startDate: `${values.startDate}T00:00:00.999999999Z`,
          endDate: `${values.endDate}T00:00:00.999999999Z`,
          global: false,
          shopID: data?.getCurrentShop ? data?.getCurrentShop?.id : null,
        },
      });
      Router.reload();
    } catch (error) {
      console.log(error);
    }
  }

  if (loading || l) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.body}>
        <div className={s.hide}>
          <ShopSidebar></ShopSidebar>
        </div>
        <div className={s.container}>
          <div className={s.title}>
            <h2>Voucher Management</h2>
          </div>
          <div className={s.card}>
            <div className={s.btn}>
              <button
                onClick={() => {
                  setAddPopUp(true);
                }}
              >
                Add New Voucher
              </button>
            </div>
            <Card className={s.table}>
              <table>
                <tr>
                  <th>Voucher Name</th>
                  <th>Description</th>
                  <th>Discount Rate</th>
                  <th>TnC</th>
                  <th>Time Range</th>
                </tr>
                {shop?.shopVouchers?.length > 0 ? (
                  shop?.shopVouchers.map((p: any) => {
                    return (
                      <tr key={p?.id}>
                        <td className={s.info}>
                          <span>{p?.name}</span>
                        </td>
                        <td>
                          <span>{p?.description}</span>
                        </td>
                        <td>
                          <span>{p?.discountRate}</span>
                        </td>
                        <td>
                          <span>{p?.condition}</span>
                        </td>
                        <td>
                          <span>
                            {p?.startDate.split("T")[0]} -{" "}
                            {p?.endDate.split("T")[0]}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>No vouchers</tr>
                )}
              </table>
            </Card>
          </div>
        </div>
        {addPopUp && (
          <div className={s.innerCon}>
            <div className={s.form}>
              <div
                className={s.back}
                onClick={() => {
                  setAddPopUp(false);
                }}
              >
                <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={s.field}>
                  <h3>Add New Voucher</h3>
                </div>
                <div className={s.field}>
                  <label htmlFor="name">Voucher Name</label>
                  <input type="text" {...register("name")} />
                </div>
                <div className={s.field}>
                  <label htmlFor="description">Description</label>
                  <textarea {...register("description")}></textarea>
                </div>
                <div className={s.field}>
                  <label htmlFor="discountRate">Discount Rate</label>
                  <input type="number" {...register("discountRate")} />
                </div>
                <div className={s.field}>
                  <label htmlFor="condition">Term and Condition</label>
                  <input type="text" {...register("condition")} />
                </div>
                <div className={s.timeRange}>
                  <div className={s.field}>
                    <label htmlFor="startDate">Start Date</label>
                    <input type="date" {...register("startDate")} />
                  </div>
                  <div className={s.field}>
                    <label htmlFor="endDate">End Date</label>
                    <input type="date" {...register("endDate")} />
                  </div>
                </div>
                <div className={s.submit}>
                  <p>
                    Dengan klik “Simpan”, kamu menyetujui Syarat &#38;
                    Ketentuan.
                  </p>
                  <button type="submit">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer></Footer>
    </>
  );
};

export default Voucher;
