import React from "react";

import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { checkCookies } from "cookies-next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Router from "next/router";
import s from "./openShop.module.scss";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";

const openShop = () => {
  const openShopQuery = gql`
    mutation openShop(
      $name: String!
      $slug: String!
      $phone: String!
      $city: String!
      $postalCode: String!
      $address: String!
    ) {
      openShop(
        input: {
          name: $name
          slug: $slug
          phone: $phone
          city: $city
          postalCode: $postalCode
          address: $address
        }
      ) {
        id
      }
    }
  `;

  const [openShop, { loading, error, data }] = useMutation(openShopQuery);

  const validationSchema = yup.object().shape({
    phone: yup.string().required(),
    name: yup.string().required(),
    slug: yup.string().required(),
    address: yup.string().required(),
    postalCode: yup.string().required(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  async function onSubmit(data: any) {
    try {
      await openShop({
        variables: {
          name: data.name,
          slug: data.slug,
          phone: data.phone,
          city: data.city,
          postalCode: data.postalCode,
          address: data.address,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (data) {
    console.log(data);
  }

  useEffect(() => {
    if (!checkCookies("user")) {
      Router.push("/login");
    }
  });

  return (
    <>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.container}>
        <div className={s.containerLeft}>
          <h2>Nama toko yang unik, selalu terlihat menarik</h2>
          <h4>
            Gunakan nama yang singkat dan sederhana agar tokomu mudah diingat
            pembeli.
          </h4>
        </div>
        <div className={s.containerRight}>
          <form
            action=""
            className={s.openShopForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={s.inputFirst}>
              <label htmlFor="phone">Masukkan No.HP-mu</label>
              <input
                type="text"
                placeholder="ex. +621234678910"
                {...register("phone")}
              />
            </div>
            <div className={s.input}>
              <label htmlFor="name">Masukkan Nama Toko dan Domain</label>
              <span className={s.title}>Nama Toko</span>
              <input type="text" {...register("name")} />
              <span className={s.title}>Nama Domain</span>
              <div className={s.domain}>
                <span>tokopedia.com/ </span>
                <input type="text" {...register("slug")} />
              </div>
            </div>
            <div className={s.input}>
              <label htmlFor="address">Masukkan Alamat Tokomu</label>
              <input
                type="text"
                placeholder="Address"
                {...register("address")}
              />
              <div className={s.address}>
                <input type="text" placeholder="City" {...register("city")} />
                <input
                  type="text"
                  placeholder="Postal Code"
                  {...register("postalCode")}
                />
              </div>
            </div>
            <div className={s.input}>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default openShop;
