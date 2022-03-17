import { gql, useMutation, useQuery } from "@apollo/client";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Card from "../../../components/common/Card";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import ShopSidebar from "../../../components/layout/Sidebar/ShopSidebar";
import { MultipleFileUploadField } from "../../upload/MultipleFileUploadField";
import { array, object } from "yup";

import * as yup from "yup";

import s from "./editshop.module.scss";
import ErrorDiv from "../../../components/common/ErrorDiv";
import Footer from "../../../components/layout/Footer/Footer";

const EditShop = () => {
  const getCurrentShopQuery = gql`
    query getCurrentShop {
      getCurrentShop {
        id
        name
        slug
        image
        isOpen
        openTime
        closeTime
      }
    }
  `;

  const { loading, error, data } = useQuery(getCurrentShopQuery);

  const [status, setStatus] = useState(false); //open

  useEffect(() => {
    setStatus(data?.getCurrentShop.isOpen);
  }, [data]);

  console.log(data);

  const time = [...Array(24)];

  const editShopQuery = gql`
    mutation editShop(
      $name: String!
      $slug: String!
      $slogan: String!
      $description: String!
      $isOpen: Boolean!
      $profile: String!
      $openTime: Time!
      $closeTime: Time!
    ) {
      updateShop(
        input: {
          image: $profile
          name: $name
          slug: $slug
          slogan: $slogan
          isOpen: $isOpen
          description: $description
          openTime: $openTime
          closeTime: $closeTime
        }
      ) {
        id
      }
    }
  `;

  const [editShop] = useMutation(editShopQuery);

  if (loading) {
    return null;
  }

  return (
    <div>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.body}>
        <div className={s.hide}>
          <ShopSidebar></ShopSidebar>
        </div>
        <div className={`${s.container} ${s.w100}`}>
          <div className={s.title}>
            <h2>{data?.getCurrentShop?.name}</h2>
          </div>
          <Card className={s.w100}>
            <Formik
              initialValues={{
                name: data ? data?.getCurrentShop?.name : "",
                slug: data ? data?.getCurrentShop?.slug : "",
                slogan: data ? data?.getCurrentShop?.slogan : "",
                description: data ? data?.getCurrentShop?.description : "",
                openTime: data
                  ? data?.getCurrentShop?.openTime.split("T")[1].substring(0, 5)
                  : "00:00",
                closeTime: data
                  ? data?.getCurrentShop?.closeTime
                      .split("T")[1]
                      .substring(0, 5)
                  : "00:00",
                profile: [],
              }}
              validationSchema={object({
                files: array(
                  object({
                    url: yup.string().required(),
                  })
                ).max(1, "Choose only 1 profile picture!"),
                name: yup.string().required(),
                description: yup.string().required(),
                slug: yup.string().required(),
                slogan: yup.string().required(),
              })}
              onSubmit={async (values) => {
                console.log(values);

                let url = "";
                url = values?.profile[0]?.url
                  ? values?.profile[0]?.url
                  : data?.getCurrentShop?.image
                  ? data?.getCurrentShop?.image
                  : "";

                console.log(url);

                try {
                  await editShop({
                    variables: {
                      name: values.name,
                      slug: values.slug,
                      slogan: values.slogan,
                      isOpen: status,
                      description: values.description,
                      profile: url,
                      openTime: `0001-01-01T${values.openTime}:00.999999999Z`,
                      closeTime: `0001-01-01T${values.closeTime}:00.999999999Z`,
                    },
                  });
                } catch (error) {
                  console.log(error);
                }

                return new Promise((res) => setTimeout(res, 2000));
              }}
            >
              {({ values, errors, isValid, isSubmitting }) => (
                <div className={s.con}>
                  {errors ? (
                    errors.name ? (
                      <ErrorDiv>{errors.name}</ErrorDiv>
                    ) : errors.description ? (
                      <ErrorDiv>{errors.description}</ErrorDiv>
                    ) : errors.slug ? (
                      <ErrorDiv>{errors.slug}</ErrorDiv>
                    ) : errors.slogan ? (
                      <ErrorDiv>{errors.slogan}</ErrorDiv>
                    ) : null
                  ) : null}
                  <h3>Informasi Toko</h3>
                  <Form>
                    <div className={`${s.form} ${s.flexRow} ${s.w100}`}>
                      <Card className={`${s.flexCol} ${s.w45}`}>
                        <label htmlFor="name">Nama Toko</label>
                        <Field type="text" name="name"></Field>
                        <label htmlFor="slug">Nama Domain</label>
                        <Field type="text" name="slug"></Field>
                      </Card>
                      <div className={`${s.flexCol} ${s.w45}`}>
                        <label htmlFor="name">Slogan</label>
                        <Field type="text" name="slogan"></Field>
                        <label htmlFor="slug">Deskripsi</label>
                        <Field as="textarea" name="description"></Field>
                      </div>
                    </div>
                    <div className={s.form}>
                      <h3>Status</h3>
                      <div className={s.contain}>
                        {status && (
                          <div className={s.status}>
                            <button
                              style={{
                                color: "#03ac0e",
                                border: "1px solid #03ac0e",
                                backgroundColor: "#ebffef",
                              }}
                              onClick={() => setStatus(!status)}
                            >
                              Buka Toko
                            </button>
                            <button onClick={() => setStatus(!status)}>
                              Tutup Toko
                            </button>
                          </div>
                        )}
                        {!status && (
                          <div className={s.status}>
                            <button onClick={() => setStatus(!status)}>
                              Buka Toko
                            </button>
                            <button
                              style={{
                                color: "#03ac0e",
                                border: "1px solid #03ac0e",
                                backgroundColor: "#ebffef",
                              }}
                              onClick={() => setStatus(!status)}
                            >
                              Tutup Toko
                            </button>
                          </div>
                        )}
                      </div>

                      {status && (
                        <div>
                          <div className={`${s.form} ${s.flexRow} ${s.w100}`}>
                            <div className={`${s.flexRow} ${s.w100} ${s.hour}`}>
                              <div className={s.input}>
                                <label htmlFor="open">Jam buka</label>
                                <Field type="time" name="openTime" />
                              </div>
                              <div className={s.input}>
                                <label htmlFor="open">Jam tutup</label>
                                <Field type="time" name="closeTime" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={s.form}>
                      <h3>Gambar Toko</h3>
                      <div className={s.flex}>
                        <div className={s.img}>
                          <Image
                            src={data ? data?.getCurrentShop?.image : ""}
                            alt="shop"
                            layout="fill"
                          ></Image>
                        </div>
                        <MultipleFileUploadField name="profile"></MultipleFileUploadField>
                      </div>
                    </div>
                    <div className={s.btn}>
                      <button type="submit" disabled={!isValid || isSubmitting}>
                        Simpan
                      </button>
                    </div>
                  </Form>
                </div>
              )}
            </Formik>
          </Card>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default EditShop;
