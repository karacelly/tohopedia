import React from "react";
import Router, { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";

const Email = () => {
  const { query } = useRouter();
  var email = query?.email;

  const editEmailQuery = gql`
    mutation updateEmail($email: String!) {
      updateEmail(email: $email) {
        id
      }
    }
  `;
  const [editEmail] = useMutation(editEmailQuery);

  editEmail({
    variables: {
      email: email,
    },
  })
    .then(() => {
      alert("Success!");
      Router.push("/user/editProfile");
    })
    .catch((e) => {
      console.log(e);
    });

  return <div>Verifying ...</div>;
};

export default Email;
