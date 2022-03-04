import { gql, useQuery } from "@apollo/client";
import React from "react";
import Card from "../../common/Card";

const UserSidebar = () => {
  const getCurrentShopQuery = gql`
    query getCurrentShop {
      getCurrentShop {
        id
        name
        slug
        image
        user {
          name
          image
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(getCurrentShopQuery);

  return (
    <div style={{ width: "20%" }}>
      <Card></Card>
    </div>
  );
};

export default UserSidebar;
