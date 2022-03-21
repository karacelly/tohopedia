import React from "react";
import LoggedNavbar from "../../components/layout/Navbar/LoggedNavbar";
import s from "./dashboard.module.scss";

import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { gql, useQuery } from "@apollo/client";
import Footer from "../../components/layout/Footer/Footer";

const Dashboard = () => {
  const productPerCategoryQuery = gql`
    query productPerCategory {
      productPerCategory {
        name
        count
      }
    }
  `;
  const transactionPerCourierQuery = gql`
    query transactionPerCourier {
      transactionPerCourier {
        name
        count
      }
    }
  `;
  const suspendedUserQuery = gql`
    query suspendedUser {
      suspendedUser {
        name
        count
      }
    }
  `;

  const {
    loading: l1,
    data: d1,
    error: e1,
  } = useQuery(productPerCategoryQuery);

  const {
    loading: l2,
    data: d2,
    error: e2,
  } = useQuery(transactionPerCourierQuery);

  const { loading: l3, data: d3, error: e3 } = useQuery(suspendedUserQuery);

  let first = [];
  if (d1 && d1?.productPerCategory) {
    console.log(d1?.productPerCategory);
    first = d1?.productPerCategory?.map((p: any) => ({
      name: p?.name,
      count: p?.count,
    }));
    console.log(first);
  }

  let second = [];
  if (d2 && d2?.transactionPerCourier) {
    console.log(d2?.transactionPerCourier);
    second = d2?.transactionPerCourier?.map((p: any) => ({
      name: p?.name,
      count: p?.count,
    }));
    console.log(second);
  }

  let third = [];
  if (d3 && d3?.suspendedUser) {
    console.log(d3?.suspendedUser);
    third = d3?.suspendedUser?.map((p: any) => ({
      name: p?.name,
      count: p?.count,
    }));
    console.log(third);
  }

  if (l1 || l2 || l3) {
    <div>Loading...</div>;
  }

  return (
    <>
      <div className={s.body}>
        <LoggedNavbar></LoggedNavbar>
        <div className={s.container}>
          <h3>Product Per Category</h3>
          <PieChart width={300} height={200}>
            <Pie
              dataKey="count"
              data={first}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#03ac0e"
            />
          </PieChart>
          <h3>Product Per Category</h3>
          <BarChart width={300} height={250} data={second}>
            <Bar dataKey="count" fill="#03ac0e" />
            <Legend></Legend>
          </BarChart>
          <h3>User Status</h3>
          <BarChart width={200} height={250} data={third}>
            <Bar dataKey="count" fill="#03ac0e" />
            <Legend></Legend>
          </BarChart>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
};

export default Dashboard;
