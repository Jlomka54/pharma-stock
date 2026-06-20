import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
