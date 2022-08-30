import React from "react";
import Head from "next/head";

export const GlobalHead = ({ title = "Only (Taylor's Version)" }) => {
  return (
    <Head>
      <link rel="icon" href="/initial-2.png" type="image/icon type" />
      <title>{title}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
};
