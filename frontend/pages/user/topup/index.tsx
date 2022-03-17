import { gql, useMutation, useQuery } from "@apollo/client";
import Router from "next/router";
import React, { useState } from "react";
import Card from "../../../components/common/Card";
import Footer from "../../../components/layout/Footer/Footer";
import LoggedNavbar from "../../../components/layout/Navbar/LoggedNavbar";
import s from "./topup.module.scss";

const Topup = () => {
  const [Nominal, setNominal] = useState(0);
  const [Generate, setGenerate] = useState(false);
  const [GeneratedCode, setGeneratedCode] = useState("");
  const [InputCode, setInputCode] = useState("");
  const [ErrorMsg, setErrorMsg] = useState("");

  const getCurrentUserQuery = gql`
    query getCurrentUser {
      getCurrentUser {
        id
        phone
      }
    }
  `;

  const topUpQuery = gql`
    mutation topup($nominal: Int!) {
      topup(nominal: $nominal) {
        id
      }
    }
  `;

  const { loading: l, error: e, data: user } = useQuery(getCurrentUserQuery);
  const [topup] = useMutation(topUpQuery);

  if (l) {
    return <div>Loading...</div>;
  }

  return (
    <div className={s.body}>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.container}>
        <div className={s.title}>
          <h2>Top Up Saldo</h2>
        </div>
        <div className={s.topup}>
          <div className={s.left}>
            <Card>
              <p>Nominal</p>
              <input
                type="number"
                placeholder="Minimum top up of 10.000 and maximum 500.000"
                min={10000}
                max={500000}
                onChange={(e) => {
                  setNominal(parseInt(e.target.value));
                }}
              />
            </Card>
            <p style={{ color: "red" }}>{ErrorMsg ? ErrorMsg : null}</p>
            {Generate && <h3>Your generate code are {GeneratedCode}</h3>}
          </div>
          <Card className={s.right}>
            <h3>Ringkasan Top up</h3>
            <div className={s.details}>
              <span>Nominal top up</span>
              <span>Rp {Nominal}</span>
            </div>
            <div className={s.details}>
              <h4>Total Bayar</h4>
              <p>Rp {Nominal}</p>
            </div>
            <div className={s.btn}>
              <button
                onClick={() => {
                  console.log(Nominal);
                  if (Nominal < 10000 || Nominal > 500000) {
                    setErrorMsg("Please input the correct amount!");
                  } else {
                    setGeneratedCode(
                      user?.getCurrentUser?.id?.substring(2, 9) +
                        Nominal +
                        "-" +
                        user?.getCurrentUser?.id?.substring(11, 20)
                    );
                    setGenerate(true);
                    setErrorMsg("");
                  }
                }}
              >
                Generate Code
              </button>
            </div>
          </Card>
        </div>
        <div className={s.redeem}>
          <h3>Masukkan kode unik untuk topup</h3>
          <div className={s.code}>
            <input
              type="text"
              placeholder="Kode unikmu"
              onChange={(e) => {
                setInputCode(e.target.value);
              }}
            ></input>
            <div className={s.btn}>
              <button
                onClick={async () => {
                  let balance = parseInt(InputCode.split("-")[1]);
                  console.log(balance);

                  try {
                    await topup({
                      variables: {
                        nominal: balance,
                      },
                    });
                    Router.reload();
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Top Up
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Topup;
