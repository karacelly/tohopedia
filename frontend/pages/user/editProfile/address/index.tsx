import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import Card from "../../../../components/common/Card";
import LoggedNavbar from "../../../../components/layout/Navbar/LoggedNavbar";
import UserSidebar from "../../../../components/layout/Sidebar/UserSidebar";
import { MultipleFileUploadField } from "../../../upload/MultipleFileUploadField";
import s from "../editProfile.module.scss";
import { gql, useMutation, useQuery } from "@apollo/client";
import Footer from "../../../../components/layout/Footer/Footer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import Address from "../../../../models/Address";

const EditProfile = () => {
  const [addPopUp, setAddPopUp] = useState(false);
  const [editPopUp, setEditPopUp] = useState(false);
  const [addressUpdate, setAddressUpdate] = useState<Address>();
  const [isMain, setMain] = useState(false);

  const getAddressQuery = gql`
    query getAddress {
      addresses {
        id
        label
        receiver
        phone
        city
        postalCode
        address
        isMain
      }
    }
  `;

  const {
    loading: l,
    error: e,
    data: address,
  } = useQuery(getAddressQuery, {
    pollInterval: 1000,
  });

  console.log(address);

  const addAddressQuery = gql`
    mutation addAddress(
      $label: String!
      $receiver: String!
      $phone: String!
      $city: String!
      $postalCode: String!
      $address: String!
      $isMain: Boolean!
    ) {
      addAddress(
        input: {
          label: $label
          receiver: $receiver
          phone: $phone
          city: $city
          postalCode: $postalCode
          address: $address
          isMain: $isMain
        }
      ) {
        id
      }
    }
  `;

  const [addAddress] = useMutation(addAddressQuery);

  const deleteAddressQuery = gql`
    mutation deleteAddress($id: String!) {
      deleteAddress(id: $id) {
        id
      }
    }
  `;

  const [deleteAddress] = useMutation(deleteAddressQuery);

  const setMainAddressQuery = gql`
    mutation setMainAddress($id: String!) {
      setMainAddress(id: $id) {
        id
      }
    }
  `;

  const [setMainAddress] = useMutation(setMainAddressQuery);

  const updateAddressQuery = gql`
    mutation UpdateAddress(
      $label: String!
      $receiver: String!
      $phone: String!
      $city: String!
      $postalCode: String!
      $address: String!
      $id: String!
    ) {
      updateAddress(
        input: {
          label: $label
          receiver: $receiver
          phone: $phone
          city: $city
          postalCode: $postalCode
          address: $address
        }
        id: $id
      ) {
        id
      }
    }
  `;

  const [updateAddress] = useMutation(updateAddressQuery);

  const validationSchema = yup.object().shape({
    label: yup.string().required(),
    receiver: yup.string().required(),
    phone: yup.string().required(),
    city: yup.string().required(),
    postalcode: yup.string().required(),
    address: yup.string().required(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  console.log(errors);

  async function onSubmit(data: any) {
    console.log("masuk");
    console.log(data);
    console.log(isMain);
    try {
      addAddress({
        variables: {
          label: data.label,
          receiver: data.receiver,
          phone: data.phone,
          city: data.city,
          postalCode: data.postalcode,
          address: data.address,
          isMain: isMain,
        },
      });
    } catch (error) {
      console.log(error);
    }

    setAddPopUp(false);
    Router.reload();
  }

  function handleChange(attribute: string, value: string) {
    let currVal = addressUpdate;
    currVal[attribute] = value;
    setAddressUpdate(currVal);
    console.log(addressUpdate);
  }

  useEffect(() => {}, [addressUpdate]);

  if (l) {
    return <div>Loading..</div>;
  }

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
              >
                Biodata Diri
              </h3>
              <h3
                onClick={() => {
                  Router.push("/user/editProfile/address");
                }}
                style={{
                  color: "#03ac0e",
                  borderBottom: "1px solid #03ac0e",
                }}
              >
                Daftar Alamat
              </h3>
            </div>
            <div className={s.btn}>
              <button
                onClick={() => {
                  setAddPopUp(true);
                }}
              >
                Tambah Alamat Baru
              </button>
            </div>
            <div className={s.list}>
              {address?.addresses.length > 0 ? (
                address?.addresses.map((add: any, idx: any) => {
                  return add.isMain ? (
                    <div
                      key={idx}
                      className={s.address}
                      style={{ backgroundColor: "#ebffef" }}
                    >
                      <span>{add.label}</span>
                      <p>{add.receiver}</p>
                      <span>{add.phone}</span>
                      <span>{add.address}</span>
                      <div className={s.action}>
                        <div
                          id={s.start}
                          onClick={() => {
                            setAddressUpdate(
                              new Address(
                                add.id,
                                add.label,
                                add.receiver,
                                add.phone,
                                add.city,
                                add.postalCode,
                                add.address
                              )
                            );
                            setEditPopUp(true);
                          }}
                        >
                          <p>Ubah Alamat</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className={s.address}
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <span>{add.label}</span>
                      <p>{add.receiver}</p>
                      <span>{add.phone}</span>
                      <span>{add.address}</span>
                      <div className={s.action}>
                        <div
                          id={s.start}
                          onClick={() => {
                            setAddressUpdate(
                              new Address(
                                add.id,
                                add.label,
                                add.receiver,
                                add.phone,
                                add.city,
                                add.postalCode,
                                add.address
                              )
                            );
                            setEditPopUp(true);
                          }}
                        >
                          <p>Ubah Alamat</p>
                        </div>
                        <div
                          id={s.mid}
                          onClick={async () => {
                            try {
                              await setMainAddress({
                                variables: {
                                  id: add.id,
                                },
                              });
                              Router.reload();
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          <p>Jadikan Alamat Utama</p>
                        </div>
                        <div
                          id={s.end}
                          onClick={async () => {
                            try {
                              await deleteAddress({
                                variables: {
                                  id: add.id,
                                },
                              });
                              Router.reload();
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          <p>Hapus Alamat</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={s.err}>
                  <p>Tidak ada alamat</p>
                </div>
              )}
            </div>
          </div>
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
                <h3>Lengkapi detail alamat</h3>
              </div>
              <div className={s.field}>
                <label htmlFor="label">Label</label>
                <input type="text" {...register("label")} />
              </div>
              <div className={s.field}>
                <label htmlFor="receiver">Nama Penerima</label>
                <input type="text" {...register("receiver")} />
              </div>
              <div className={s.field}>
                <label htmlFor="phone">Nomor HP</label>
                <input type="text" {...register("phone")} />
              </div>
              <div className={s.field}>
                <label htmlFor="city">Kota</label>
                <input type="text" {...register("city")} />
              </div>
              <div className={s.field}>
                <label htmlFor="postalcode">Kode Pos</label>
                <input type="text" {...register("postalcode")} />
              </div>
              <div className={s.field}>
                <label htmlFor="address">Alamat Lengkap</label>
                <textarea {...register("address")}></textarea>
              </div>
              <div className={s.check}>
                <input
                  type="checkbox"
                  onChange={() => {
                    setMain(!isMain);
                  }}
                />{" "}
                Jadikan alamat utama
              </div>
              <div className={s.submit}>
                <p>
                  Dengan klik “Simpan”, kamu menyetujui Syarat &#38; Ketentuan.
                </p>
                <button type="submit">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editPopUp && addressUpdate != null && (
        <div className={s.innerCon}>
          <div className={s.form}>
            {console.log(addressUpdate)}
            <div
              className={s.back}
              onClick={() => {
                setEditPopUp(false);
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
            </div>
            <form>
              <div className={s.field}>
                <h3>Ubah Alamat</h3>
              </div>
              <div className={s.field}>
                <label htmlFor="label">Label</label>
                <input
                  onChange={(e) => handleChange("label", e.target.value)}
                  type="text"
                  name="label"
                  defaultValue={addressUpdate.label}
                />
              </div>
              <div className={s.field}>
                <label htmlFor="receiver">Nama Penerima</label>
                <input
                  onChange={(e) => handleChange("receiver", e.target.value)}
                  type="text"
                  name="receiver"
                  defaultValue={addressUpdate.receiver}
                />
              </div>
              <div className={s.field}>
                <label htmlFor="phone">Nomor HP</label>
                <input
                  onChange={(e) => handleChange("phone", e.target.value)}
                  type="text"
                  name="phone"
                  defaultValue={addressUpdate.phone}
                />
              </div>
              <div className={s.field}>
                <label htmlFor="city">Kota</label>
                <input
                  onChange={(e) => handleChange("city", e.target.value)}
                  type="text"
                  name="city"
                  defaultValue={addressUpdate.city}
                />
              </div>
              <div className={s.field}>
                <label htmlFor="postalcode">Kode Pos</label>
                <input
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  type="text"
                  name="postalCode"
                  defaultValue={addressUpdate.postalCode}
                />
              </div>
              <div className={s.field}>
                <label htmlFor="address">Alamat Lengkap</label>
                <textarea
                  onChange={(e) => handleChange("address", e.target.value)}
                  name="address"
                  defaultValue={addressUpdate.address}
                ></textarea>
              </div>
              <div className={s.submit}>
                <p>
                  Dengan klik “Simpan”, kamu menyetujui Syarat &#38; Ketentuan.
                </p>
                <button
                  type="submit"
                  onClick={async () => {
                    try {
                      await updateAddress({
                        variables: {
                          label: addressUpdate.label,
                          receiver: addressUpdate.receiver,
                          phone: addressUpdate.phone,
                          city: addressUpdate.city,
                          postalCode: addressUpdate.postalCode,
                          address: addressUpdate.address,
                          id: addressUpdate.id,
                        },
                      });
                    } catch (error) {
                      console.log(error);
                    }
                    Router.reload();
                  }}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer></Footer>
    </div>
  );
};

export default EditProfile;
