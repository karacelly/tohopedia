import { checkCookies } from "cookies-next";
import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { NextPage } from "next";

import Card from "../../../components/common/Card";
import s from "./addProduct.module.scss";
import Router from "next/router";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import { array, object, string } from "yup";
import { MultipleFileUploadField } from "../../upload/MultipleFileUploadField";
import ErrorDiv from "../../../components/common/ErrorDiv";
import Category from "../../../models/Category";

const AddProduct: NextPage = () => {
  useEffect(() => {
    if (!checkCookies("user")) {
      Router.push("/login");
    }
  });

  const categoriesQuery = gql`
    query categories {
      categories {
        id
        name
      }
    }
  `;

  const { loading, error, data } = useQuery(categoriesQuery);

  const addProductQuery = gql`
    mutation addProduct(
      $name: String!
      $description: String!
      $images: [String!]!
      $price: Int!
      $stock: Int!
      $discount: Int!
      $categoryId: String!
      $label: String!
      $value: String!
    ) {
      addProduct(
        input: {
          name: $name
          description: $description
          images: $images
          price: $price
          stock: $stock
          discount: $discount
          categoryId: $categoryId
          label: $label
          value: $value
        }
      ) {
        id
      }
    }
  `;

  const [addProduct] = useMutation(addProductQuery);

  return (
    <>
      <LoggedNavbar></LoggedNavbar>

      <Formik
        initialValues={{
          name: "",
          files: [],
          categoryId: "",
          description: "",
          price: 0,
          stock: 1,
          discount: 0,
          label: "",
          value: "",
        }}
        validationSchema={object({
          files: array(
            object({
              url: yup.string().required(),
            })
          ),
          name: yup.string().required(),
          description: yup.string().required(),
          price: yup.number().min(0),
          discount: yup.number().min(0),
          stock: yup.number().min(1),
        })}
        onSubmit={async (values) => {
          console.log(values);
          let images: Array<string> = [""];
          values.files.map((v) => {
            console.log(v.url);
            images.push(v.url);
          });
          console.log(images);
          try {
            await addProduct({
              variables: {
                name: values.name,
                description: values.description,
                images: images,
                price: values.price,
                stock: values.stock,
                discount: values.discount,
                categoryId: values.categoryId,
                label: values.label,
                value: values.value,
              },
            });
          } catch (error) {
            console.log(error);
          }

          return new Promise((res) => setTimeout(res, 2000));
        }}
      >
        {({ values, errors, isValid, isSubmitting }) => (
          <div className={s.body}>
            <div className={s.title}>
              <h1>Add Product</h1>
              {errors ? (
                errors.name ? (
                  <ErrorDiv>{errors.name}</ErrorDiv>
                ) : errors.price ? (
                  <ErrorDiv>{errors.price}</ErrorDiv>
                ) : errors.description ? (
                  <ErrorDiv>{errors.description}</ErrorDiv>
                ) : errors.stock ? (
                  <ErrorDiv>{errors.stock}</ErrorDiv>
                ) : errors.files ? (
                  <ErrorDiv>{errors.files}</ErrorDiv>
                ) : null
              ) : null}
            </div>
            <Form>
              <Card>
                <h3>Upload Produk</h3>
                <div className={s.upload}>
                  <div className={s.leftUpload}>
                    <h4>Foto Produk</h4>
                    <span>
                      Format gambar .jpg .jpeg .png dan ukuran minimum 300 x
                      300px (Untuk gambar optimal gunakan ukuran minimum 700 x
                      700 px).
                    </span>
                    <span>
                      Pilih foto produk atau tarik dan letakkan hingga 5 foto
                      sekaligus di sini. Cantumkan min. 3 foto yang menarik agar
                      produk semakin menarik pembeli.
                    </span>
                  </div>
                  <div className={s.rightUpload}>
                    <MultipleFileUploadField name="files" />
                  </div>
                </div>
              </Card>
              <Card>
                <h3>Informasi Produk</h3>
                <div className={s.input}>
                  <div className={s.inputLeft}>
                    <h4>Product Name</h4>
                    <span>
                      Cantumkan min. 40 karakter agar semakin menarik dan mudah
                      ditemukan oleh pembeli, terdiri dari jenis produk, merek,
                      dan keterangan seperti warna, bahan, atau tipe.
                    </span>
                  </div>
                  <div className={s.inputRight}>
                    <Field type="text" name="name" />
                  </div>
                </div>
                <div className={s.input}>
                  <div className={s.inputLeft}>
                    <h4>Category</h4>
                  </div>
                  <div className={s.inputRight}>
                    <Field as="select" name="categoryId">
                      <option value="null">Choose one</option>
                      {data?.categories?.length > 0 ? (
                        data?.categories?.map((category: Category) => {
                          return (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          );
                        })
                      ) : (
                        <option value="null">Default</option>
                      )}
                    </Field>
                  </div>
                </div>
                <div className={s.input}>
                  <div className={s.inputLeft}>
                    <h4>Product Description</h4>
                    <span>
                      Include a complete description according to the product,
                      such as excellence, specifications, material, size,
                      validity period, and others. The length of the description
                      is between 450-2000 characters.
                    </span>
                  </div>
                  <div className={s.inputRight}>
                    <Field as="textarea" name="description"></Field>
                  </div>
                </div>
                <div className={s.input}>
                  <div className={s.inputLeft}>
                    <h4>Price</h4>
                  </div>
                  <div className={s.inputRight}>
                    <Field type="number" name="price" />
                  </div>
                </div>
                <div className={s.input}>
                  <div className={s.inputLeft}>
                    <h4>Stock</h4>
                  </div>
                  <div className={s.inputRight}>
                    <Field type="number" name="stock" />
                  </div>
                </div>
                <div className={s.input}>
                  <div className={s.inputLeft}>
                    <h4>Discount</h4>
                  </div>
                  <div className={s.inputRight}>
                    <Field type="number" name="discount" />
                  </div>
                </div>
              </Card>
              <Card>
                <div className={s.input}>
                  <div className={s.inputLeft}>
                    <h4>Product Metadata</h4>
                    <span>
                      Add additional information that is unique to your product
                    </span>
                  </div>
                  <div className={s.inputRight}>
                    <div className={s.metadata}>
                      <Field type="text" placeholder="Label" name="label" />
                      <Field type="text" placeholder="Value" name="value" />
                    </div>
                  </div>
                </div>
              </Card>
              <div className={s.btn}>
                <button type="submit" disabled={!isValid || isSubmitting}>
                  Save
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
};

export default AddProduct;
