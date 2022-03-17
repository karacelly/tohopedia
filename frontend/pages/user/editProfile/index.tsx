import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import Card from "../../../components/common/Card";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import UserSidebar from "../../../components/layout/Sidebar/UserSidebar";
import { MultipleFileUploadField } from "../../upload/MultipleFileUploadField";
import s from "./editProfile.module.scss";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Footer from "../../../components/layout/Footer/Footer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import nophoto from "../../../public/images/default_user.jpg";
import Router from "next/router";

const EditProfile = () => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const getCurrentShopQuery = gql`
    query getCurrentShop {
      getCurrentShop {
        id
        name
        slug
        image
        isOpen
        user {
          id
          name
          image
          gender
          dob
          email
          phone
        }
      }
    }
  `;

  const getCurrentUserQuery = gql`
    query getCurrentUser {
      getCurrentUser {
        id
        name
        image
        gender
        dob
        email
        phone
        enable2FA
      }
    }
  `;

  const { loading, error, data: shop } = useQuery(getCurrentShopQuery);
  const { loading: l, error: e, data: u } = useQuery(getCurrentUserQuery);

  const editUserQuery = gql`
    mutation updateUser(
      $name: String!
      $dob: String!
      $gender: String!
      $phone: String!
      $image: String!
    ) {
      updateUser(
        input: {
          name: $name
          dob: $dob
          gender: $gender
          phone: $phone
          image: $image
        }
      ) {
        id
      }
    }
  `;

  const [editUser] = useMutation(editUserQuery);

  const enable2FAQuery = gql`
    mutation enable2FA($enabled: Boolean!) {
      enable2FA(enabled: $enabled) {
        id
      }
    }
  `;

  const [enable2FA] = useMutation(enable2FAQuery);

  const getUserQuery = gql`
    query userByEmail($email: String!) {
      userByEmail(email: $email) {
        id
      }
    }
  `;

  const [getUserByEmail] = useLazyQuery(getUserQuery);

  if (loading || l) {
    return <div>Loading..</div>;
  }
  let user = u?.getCurrentUser;

  return (
    <div className={s.body}>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.content}>
        <UserSidebar></UserSidebar>
        <div className={s.container}>
          <div className={s.c}>
            <div className={s.menu}>
              <h3
                onClick={() => {
                  Router.push("/user/editProfile");
                }}
                style={{
                  color: "#03ac0e",
                  borderBottom: "1px solid #03ac0e",
                }}
              >
                Biodata Diri
              </h3>
              <h3
                onClick={() => {
                  Router.push("/user/editProfile/address");
                }}
              >
                Daftar Alamat
              </h3>
            </div>
            <Formik
              initialValues={{
                name: user?.name,
                profile: user?.image,
                dob: user?.dob,
                gender: user?.gender,
                phone: user?.phone,
              }}
              onSubmit={async (values) => {
                console.log(values);

                let url = "";
                url = values?.profile[0]?.url
                  ? values?.profile[0]?.url
                  : user?.image
                  ? user?.image
                  : "";
                console.log(url);

                try {
                  await editUser({
                    variables: {
                      name: values.name,
                      dob: values.dob,
                      gender: values.gender,
                      phone: values.phone,
                      image: url,
                    },
                  });
                } catch (error) {
                  console.log(error);
                }

                return new Promise((res) => setTimeout(res, 2000));
              }}
            >
              {({ values, errors, isValid, isSubmitting }) => (
                <Form>
                  <div className={s.cons}>
                    <div className={s.photo}>
                      <Card className={s.photoCard}>
                        <div className={s.img}>
                          <Image
                            src={shop ? user?.image : nophoto}
                            alt="user"
                            objectFit="cover"
                            layout="fill"
                          ></Image>
                        </div>
                        <div className={s.upload}>
                          <MultipleFileUploadField name="profile"></MultipleFileUploadField>
                          <span>
                            Besar file: maksimum 10.000.000 bytes (10
                            Megabytes). Ekstensi file yang diperbolehkan: .JPG
                            .JPEG .PNG
                          </span>
                        </div>
                      </Card>
                    </div>
                    <div className={s.fields}>
                      <div className={s.field}>
                        <h3>Ubah Biodata Diri</h3>
                        <div className={s.inp}>
                          <label htmlFor="name">Name</label>
                          <Field type="text" name="name"></Field>
                        </div>
                        <div className={s.inp}>
                          <label htmlFor="dob">Date of birth</label>
                          <Field type="date" name="dob"></Field>
                        </div>
                        <div className={s.inp}>
                          <label htmlFor="gender">Gender</label>
                          <Field as="select" name="gender">
                            <option value="NULL">Choose gender</option>
                            <option value="F">Female</option>
                            <option value="M">Male</option>
                          </Field>
                        </div>
                      </div>
                      <div className={s.field}>
                        <div className={s.inp}>
                          <label htmlFor="phone">Phone Number</label>
                          <Field type="text" name="phone"></Field>
                        </div>
                      </div>
                      <div className={s.btn}>
                        <button
                          type="submit"
                          disabled={!isValid || isSubmitting}
                        >
                          Simpan
                        </button>
                      </div>
                      <h3>Ubah Kontak</h3>
                      <div className={s.inp}>
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          name="email"
                          defaultValue={u?.getCurrentUser?.email}
                          onChange={(e: any) => {
                            setEmail(e.target.value);
                          }}
                        ></input>
                      </div>
                      <div className={s.error}>
                        <p style={{ color: "red" }}>
                          {errorMsg ? errorMsg : null}
                        </p>
                      </div>
                      <div
                        className={s.btn}
                        onClick={() => {
                          try {
                            getUserByEmail({
                              variables: {
                                email: email,
                              },
                            }).then((res) => {
                              if (res) {
                                console.log("Sending ...");

                                let subject =
                                  "Confirmation to change your email";
                                let message = `<div>Click this link to verify email</div>
                                <div>http://localhost:3000/user/editProfile/email?email=${email}</div>`;
                                let data = {
                                  email,
                                  subject,
                                  message,
                                };

                                fetch("/api/contact", {
                                  method: "POST",
                                  headers: {
                                    Accept: "application/json, text/plain, */*",
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(data),
                                }).then((res) => {
                                  console.log("Response received");
                                  if (res.status === 200) {
                                    console.log("Response succeeded!");
                                  }
                                });
                              }
                            });
                          } catch (error) {
                            setErrorMsg("We can't find your email");
                          }
                        }}
                      >
                        <button type="button">Ubah</button>
                      </div>
                      <h3>Pengaturan Keamanan</h3>
                      <input
                        type="checkbox"
                        checked={user?.enable2FA}
                        onChange={async () => {
                          await enable2FA({
                            variables: {
                              enabled: !user?.enable2FA,
                            },
                          });
                        }}
                      />{" "}
                      <label>Enable 2FA</label>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default EditProfile;
