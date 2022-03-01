import { gql, useQuery } from "@apollo/client";
import { Field, Form, Formik } from "formik";
import React from "react";
import Card from "../../../components/common/Card";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import ShopSidebar from "../../../components/layout/Sidebar/ShopSidebar";
import s from "./editshop.module.scss";

const EditShop = () => {
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

  return (
    <div>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.body}>
        <ShopSidebar></ShopSidebar>
        <div className={s.container}>
          <div className={s.title}>
            <h2>{data?.getCurrentShop?.name}</h2>
          </div>
          <Card>
            <div className={s.con}>
              <h4>Informasi Toko</h4>

              <Formik
                initialValues={{
                  name: "",
                  slug: "",
                  slogan: "",
                  description: "",
                }}
                onSubmit={async (values) => {
                  console.log(values);
                }}
              >
                {({ values, errors, isValid, isSubmitting }) => (
                  <Form>
                    <div className={s.flex}>
                      <Card>
                        <label htmlFor="name">Nama Toko</label>
                        <Field type="text" name="name"></Field>
                      </Card>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditShop;
