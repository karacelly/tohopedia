import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import Card from "../../../components/common/Card";
import Footer from "../../../components/layout/Footer/Footer";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import nophoto from "../../../public/images/default_user.jpg";
import Image from "next/image";

import s from "./allProduct.module.scss";
import Link from "next/link";

const UserManagement = () => {
  const users = gql`
    query usersPaginate($limit: Int!, $offset: Int!) {
      usersPaginate(limit: $limit, offset: $offset) {
        id
        name
        email
        image
        isSuspended
        unsuspendReq
      }
    }
  `;

  const allUser = gql`
    query users {
      users {
        name
        email
        image
        isSuspended
      }
    }
  `;

  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { loading, error, data: all } = useQuery(allUser);

  const {
    loading: l,
    error: err,
    data: user,
  } = useQuery(users, {
    variables: {
      limit: limit,
      offset: offset,
    },
    pollInterval: 1000,
  });
  console.log(user);

  let nProd = all?.users?.length;
  let page = Math.floor(offset / limit) + 1;
  let pages =
    nProd % limit == 0
      ? Math.floor(nProd / limit)
      : Math.floor(nProd / limit + 1);

  const suspendUserQuery = gql`
    mutation suspendUser($userId: String!) {
      suspendUser(userId: $userId) {
        id
      }
    }
  `;

  const [suspendUser] = useMutation(suspendUserQuery);

  return (
    <div>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.body}>
        <div className={s.container}>
          <div className={s.title}>
            <h3>All Users</h3>
          </div>
          <div className={s.card}>
            <Card className={s.table}>
              <table>
                <tr>
                  <th>User Info</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
                {user?.usersPaginate?.length > 0 ? (
                  user?.usersPaginate.map((p: any) => {
                    return (
                      <tr key={p?.id}>
                        <td className={s.info}>
                          <div className={s.img}>
                            <Image
                              src={p?.image ? p?.image : nophoto}
                              alt="user"
                              layout="fill"
                              objectFit="cover"
                            ></Image>
                          </div>
                          <span>{p?.name}</span>
                        </td>
                        <td>
                          <span>{p.email}</span>
                        </td>
                        <td>
                          <span>
                            {p?.isSuspended ? "Suspended" : "Active"}
                            {p?.unsuspendReq
                              ? ", asking to be unsuspended"
                              : ""}
                          </span>
                        </td>
                        <td>
                          {p.isSuspended ? (
                            <button
                              onClick={async () => {
                                try {
                                  await suspendUser({
                                    variables: {
                                      userId: p?.id,
                                    },
                                  });
                                } catch (error) {
                                  console.log(error);
                                }
                              }}
                            >
                              Unsuspend
                            </button>
                          ) : (
                            <button
                              style={{ backgroundColor: "red" }}
                              onClick={async () => {
                                try {
                                  await suspendUser({
                                    variables: {
                                      userId: p?.id,
                                    },
                                  });
                                } catch (error) {
                                  console.log(error);
                                }
                              }}
                            >
                              Suspend
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>No products</tr>
                )}
              </table>
            </Card>
            <div className={s.paginate}>
              {page - 1 > 0 && (
                <button
                  onClick={() =>
                    setOffset(page > 2 ? offset - 10 : offset - 11)
                  }
                  className={s.act}
                >
                  «
                </button>
              )}
              <p>{page}</p>
              {page + 1 <= pages && (
                <button
                  onClick={() => setOffset(limit * page + 1)}
                  className={s.act}
                >
                  »
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default UserManagement;
