import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import LoggedNavbar from "../../../../components/layout/Navbar/LoggedNavbar";
import noPhoto from "../../../../public/images/productnophoto.png";
import Image from "next/image";
import s from "../cart.module.scss";
import Footer from "../../../../components/layout/Footer/Footer";
import Card from "../../../../components/common/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import Link from "next/link";
import { checkCookies } from "cookies-next";

const Checkout = () => {
  try {
    const item = window.localStorage.getItem("voucher");
    console.log(item);
  } catch (error) {
    // If error also return initialValue
    console.log(error);
  }
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const [voucherPopUp, setVoucherPopUp] = useState(false);
  const [voucherInput, setVoucherInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [chosen, setChosen] = useState();
  const [chosenCourier, setChosenCourier] = useState("");
  const [voucherID, setVoucherID] = useLocalStorage("voucher", "");
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const [chosenAddress, setChosenAddress] = useState();
  const [chosenShippingId, setChosenShippingId] = useState("");
  const [addressPopUp, setAddressPopUp] = useState(false);

  useEffect(() => {
    if (!checkCookies("user")) {
      Router.push("/");
    }
  });

  const getCurrentUserQuery = gql`
    query getCurrentUser {
      getCurrentUser {
        name
        image
        role
        balance
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
        carts {
          id
          product {
            id
            name
            images {
              image
            }
            shop {
              id
              name
            }
            price
            discount
          }
          quantity
          note
          checked
        }
      }
    }
  `;

  const { loading: l, error: e, data } = useQuery(getCurrentUserQuery);

  var user;
  if (data) {
    user = data?.getCurrentUser;
  }

  const voucherQuery = gql`
    query vouchers {
      vouchers {
        id
        name
        description
        discountRate
        condition
        startDate
        endDate
        global
        shop {
          id
          name
        }
      }
    }
  `;

  const { loading: vLoad, error: vErr, data: vData } = useQuery(voucherQuery);
  console.log(vData);

  const courierQuery = gql`
    query couriers {
      couriers {
        id
        name
        shippings {
          id
          label
          duration
          lateProb
          price
        }
      }
    }
  `;

  const { loading: cLoad, error: cErr, data: courier } = useQuery(courierQuery);

  const createTransactionQuery = gql`
    mutation createTransaction(
      $chosenAddressId: String!
      $courierId: String!
      $shippingId: String!
      $voucherId: String!
      $productIds: [String!]!
      $qtys: [Int!]!
      $totalPrice: Int!
    ) {
      createTransaction(
        input: {
          chosenAddressId: $chosenAddressId
          courierId: $courierId
          shippingId: $shippingId
          voucherId: $voucherId
          productIds: $productIds
          qtys: $qtys
        }
        totalPrice: $totalPrice
      ) {
        id
      }
    }
  `;

  const [createTransaction] = useMutation(createTransactionQuery);

  const vouchers = [];
  const carts = [];
  const couriers = [];
  let shippings = [];
  let productIds = [];
  let qtys = [];

  useEffect(() => {
    let totalPrice = 0;
    let totalDisc = 0;
    user?.carts?.length > 0
      ? user?.carts?.map((c: any, idx: any) => {
          if (c?.checked == true) {
            totalPrice += c?.product.price * c?.quantity;
            totalDisc +=
              (c?.product.discount / 100) * c?.product.price * c?.quantity;
          }
        })
      : null;

    setPrice(totalPrice);
    setDiscount(totalDisc);
  }, [user]);

  console.log(user);
  return (
    <div className={s.body}>
      <LoggedNavbar></LoggedNavbar>
      <div className={s.container}>
        <div className={s.containerLeft}>
          <h2>Checkout</h2>
          <div className={s.addressCon}>
            <h4>Shipping Address</h4>
            {chosenAddress ? (
              <div className={s.chosenAddress}>
                <h4>
                  {chosenAddress?.receiver} ({chosenAddress?.label})
                </h4>
                <p>{chosenAddress?.address}</p>
                <span>{chosenAddress?.phone}</span>
                <span>
                  {chosenAddress?.city}, {chosenAddress?.postalCode}
                </span>
              </div>
            ) : user?.addresses?.length > 0 ? (
              user?.addresses?.map((addr: any, idx: any) => {
                if (addr?.isMain) {
                  return (
                    <div className={s.chosenAddress}>
                      {setChosenAddress(addr)}
                      <h4>
                        {addr?.receiver} ({addr?.label})
                      </h4>
                      <p>{addr?.address}</p>
                      <span>{addr?.phone}</span>
                      <span>
                        {addr?.city}, {addr?.postalCode}
                      </span>
                    </div>
                  );
                }
              })
            ) : null}
            <div className={s.adrAction}>
              <button onClick={() => setAddressPopUp(true)}>
                Pilih alamat
              </button>
            </div>
          </div>
          <div className={s.prodContainer}>
            <div className={s.prods}>
              {user?.carts.length > 0 ? (
                user?.carts.map((c: any, idx: any) => {
                  if (c?.checked) {
                    carts.push(c);
                    console.log(c?.product?.id);
                    productIds.push(c?.product?.id);
                    qtys.push(c?.quantity);
                  }
                  return c?.checked ? (
                    <Card key={idx} className={s.cartCheckout}>
                      <h5>{c?.product?.shop?.name}</h5>
                      <div className={s.product}>
                        <div className={s.img}>
                          <Image
                            src={
                              c?.product?.images[0]
                                ? c?.product?.images[0].image
                                : noPhoto
                            }
                            alt="prod"
                            objectFit="cover"
                            layout="fill"
                          ></Image>
                        </div>
                        <div className={s.detail}>
                          <p>{c?.product?.name}</p>
                          {c?.product?.discount > 0 ? (
                            <div className={s.dets}>
                              <span>{c?.product.discount}%</span>
                              <p>Rp{c?.product.price}%</p>
                              <h5>
                                Rp
                                {c?.product?.price -
                                  (c?.product.discount / 100) *
                                    c?.product?.price}
                              </h5>
                            </div>
                          ) : (
                            <div className={s.dets}>
                              <h5>{c?.product?.price}</h5>
                            </div>
                          )}
                        </div>
                        <div className={s.qty}>x{c?.quantity}</div>
                      </div>
                      <div className={s.action}>
                        <div className={s.note}>
                          <p>{c?.note}</p>
                        </div>
                      </div>
                    </Card>
                  ) : null;
                })
              ) : (
                <div>Keranjangmu kosong!</div>
              )}
            </div>
            <div className={s.shipping}>
              <div className={s.courier}>
                <h5>Kurir Pilihan</h5>
                <select
                  id="kurir"
                  onChange={(e) => {
                    setChosenCourier(e.target.value);
                    console.log(e.target.value);
                  }}
                >
                  <option value="">Pilih kurir</option>
                  {courier?.couriers?.length > 0
                    ? courier?.couriers?.map((c: any, idx: any) => {
                        couriers.push(c);
                        return (
                          <option key={idx} value={c?.id}>
                            {c?.name}
                          </option>
                        );
                      })
                    : null}
                </select>
                {chosenCourier != ""
                  ? couriers?.length > 0
                    ? couriers?.map((c: any, idx: any) => {
                        if (c?.id == chosenCourier) {
                          shippings = c?.shippings;
                          console.log(c?.shippings);
                        }
                      })
                    : null
                  : null}

                {chosenCourier != "" ? (
                  <div className={s.ships}>
                    <select
                      id="shipping"
                      onChange={(e) => {
                        console.log(e.target.value);
                        setChosenShippingId(e.target.value);
                      }}
                    >
                      <option value="">Pilih durasi</option>
                      {shippings?.length > 0
                        ? shippings?.map((s: any, id: any) => {
                            console.log(s);
                            return (
                              <option key={id} value={s?.id}>
                                {s?.label} (Rp{s?.price})
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className={s.containerRight}>
          <Card>
            <div
              className={s.promo}
              onClick={() => {
                setVoucherPopUp(true);
              }}
            >
              <h5>
                {chosen
                  ? `Kamu bisa hemat Rp${voucherDiscount}`
                  : "Makin hemat pakai promo >"}
              </h5>
            </div>
            <div className={s.summary}>
              <h4>Ringkasan belanja</h4>
              <div className={s.summaryUp}>
                <span>Total Harga ({carts.length} barang)</span>
                <span>Rp{price}</span>
              </div>
              <div className={s.summaryDown}>
                <span>Total Diskon Barang</span>
                <span>-Rp{discount + voucherDiscount}</span>
              </div>
              <div className={s.total}>
                <h4>Total Harga</h4>
                <h4>Rp{price - discount - voucherDiscount}</h4>
              </div>
              <div className={s.buy}>
                <button
                  onClick={async () => {
                    let okay = false;

                    if (
                      chosenAddress == undefined ||
                      chosenCourier == "" ||
                      chosenShippingId == "" ||
                      voucherID == "" ||
                      productIds.length < 1 ||
                      qtys.length < 1
                    ) {
                      setErrorMsg("Fill all fields!");
                    } else {
                      okay = true;
                    }
                    let chosenAddressId = chosenAddress?.id;

                    if (okay) {
                      try {
                        await createTransaction({
                          variables: {
                            chosenAddressId: chosenAddressId,
                            courierId: chosenCourier,
                            shippingId: chosenShippingId,
                            voucherId: voucherID,
                            productIds: productIds,
                            qtys: qtys,
                            totalPrice: price,
                          },
                        });
                        setErrorMsg("");
                      } catch (error) {
                        if (error.message == "Invalid balance!") {
                          setErrorMsg(error.message);
                        }
                        console.log(error);
                      }
                    }
                  }}
                >
                  Beli
                </button>
              </div>
              <p style={{ color: "red" }}>{errorMsg ? errorMsg : null}</p>
            </div>
          </Card>
        </div>
      </div>
      {voucherPopUp && (
        <div className={s.voucherCon}>
          <div className={s.popUp}>
            <div className={s.vTitle}>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setVoucherPopUp(false);
                }}
              >
                {"<"}
              </p>
              <h3>Pakai Promo</h3>
            </div>
            {chosen && (
              <div className={s.chosen}>
                <h4>1 promo dipilih</h4>
              </div>
            )}

            <div className={s.vInput}>
              <input
                type="text"
                defaultValue={chosen?.id}
                placeholder="Masukkan kode voucher"
                onChange={(e) => {
                  setVoucherInput(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  console.log(carts);

                  for (let i = 0; i < vouchers.length; i++) {
                    const vo = vouchers[i];
                    if (vo?.id == voucherInput) {
                      if (vo?.global) {
                        setChosen(vo);
                        setVoucherID(vo?.id);
                      } else {
                        for (let j = 0; j < carts.length; j++) {
                          const ca = carts[j];

                          if (ca?.product?.shop?.id == vo?.shop?.id) {
                            setChosen(vo);
                            setVoucherID(vo?.id);
                          } else {
                            break;
                          }
                        }
                      }
                      break;
                    }
                  }
                }}
              >
                Terapkan
              </button>
            </div>
            <p style={{ color: "red" }}>{errorMsg ? errorMsg : null}</p>
            <h4>Kupon Saya</h4>
            <div className={s.vouchers}>
              {vData?.vouchers?.length > 0
                ? vData?.vouchers?.map((v: any, idx: any) => {
                    vouchers.push(v);
                    return v?.global ? (
                      <Card key={idx} className={s.voucherCard}>
                        <h4>{v?.name}</h4>
                        <span>Kode: {v?.id}</span>
                        <p>{v?.description}</p>
                        <p>{v?.condition}</p>
                      </Card>
                    ) : null;
                  })
                : null}
            </div>
            <h4>Kupon Toko</h4>
            <div className={s.vouchers}>
              {vouchers?.length > 0
                ? vouchers?.map((v: any, idx: any) => {
                    return !v?.global ? (
                      <Card key={idx} className={s.voucherCard}>
                        <h4>{v?.name}</h4>
                        <span>Kode: {v?.id}</span>
                        <p>{v?.description}</p>
                        <p>{v?.condition}</p>
                      </Card>
                    ) : null;
                  })
                : null}
            </div>
            <div
              className={s.btn}
              onClick={() => {
                if (chosen) {
                  let chosendisc = 0;
                  if (chosen?.global == true) {
                    for (let i = 0; i < carts.length; i++) {
                      const c = carts[i];
                      console.log(c);
                      console.log(chosen);
                      // c?.price -= c?.price * chosen?.discountRate;
                      chosendisc +=
                        c?.product?.price * (chosen?.discountRate / 100);
                    }
                  } else {
                    for (let i = 0; i < carts.length; i++) {
                      const c = carts[i];
                      console.log(c);
                      if (c?.product?.shop?.id == chosen?.shop?.id) {
                        chosendisc +=
                          c?.product?.price * (chosen?.discountRate / 100);
                      }
                    }
                  }
                  setVoucherDiscount(chosendisc);
                  console.log(chosendisc);
                }
                setVoucherPopUp(false);
              }}
            >
              <button>Pakai promo</button>
            </div>
          </div>
        </div>
      )}
      {addressPopUp && (
        <div className={s.innerCon}>
          <div className={s.form}>
            <div
              className={s.back}
              onClick={() => {
                setAddressPopUp(false);
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
            </div>
            <div className={s.title}>
              <h3>Mau kirim belanjaan ke mana?</h3>
            </div>
            <div className={s.list}>
              {user?.addresses.length > 0 ? (
                user?.addresses.map((add: any, idx: any) => {
                  return add.isMain ? (
                    <div key={idx} className={s.address}>
                      <div className={s.addressDets}>
                        <div className={s.mainDets}>
                          <h5>
                            {add?.receiver} ({add?.label})
                          </h5>
                          <div className={s.isMain}>
                            <span>Utama</span>
                          </div>
                        </div>
                        <p>{add?.phone}</p>
                        <p>{add?.address}</p>
                        <p>
                          {add?.city}, {add?.postalCode}
                        </p>
                      </div>
                      <div
                        className={s.btn}
                        onClick={() => {
                          console.log("halo");
                          setChosenAddress(add);
                          setAddressPopUp(false);
                        }}
                      >
                        <button>Pilih</button>
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className={s.address}>
                      <div className={s.addressDets}>
                        <div className={s.mainDets}>
                          <h5>
                            {add?.receiver} ({add?.label})
                          </h5>
                        </div>
                        <p>{add?.phone}</p>
                        <p>{add?.address}</p>
                        <p>
                          {add?.city}, {add?.postalCode}
                        </p>
                      </div>
                      <div className={s.btn}>
                        <button
                          onClick={() => {
                            setChosenAddress(add);
                            setAddressPopUp(false);
                            console.log("halo");
                          }}
                        >
                          Pilih
                        </button>
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
      )}
      <Footer></Footer>
    </div>
  );
};

export default Checkout;

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
