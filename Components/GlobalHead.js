import React from "react";
import Head from "next/head";

export const GlobalHead = ({ title = "Only (Taylor's Version)" }) => {
  return (
    <Head>
      <link rel="icon" href="/initial-2.png" type="image/icon type" />
      <title>{title}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
          href="https://fonts.googleapis.com/css2?family=Mr+De+Haviland&family=Sacramento&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
          crossOrigin="true"
      />
      <link rel="stylesheet" href="https://use.typekit.net/msl6gcw.css" crossOrigin="true" />
    </Head>
  );
};
