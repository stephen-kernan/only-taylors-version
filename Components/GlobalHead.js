import React from "react";
import Head from "next/head";

export const GlobalHead = ({ title = "Taylor's Version Converter" }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/dot-tv-logo.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:ital,wght@0,300;0,700;1,300&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
};
