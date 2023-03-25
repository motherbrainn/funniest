import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import FunnyImage from "@/components/FunnyImage";
import ImageChoice from "@/components/ImageChoice";
import { GiphyFetch } from "@giphy/js-fetch-api";
import prisma from "../../lib/prisma";
import { GetStaticProps } from "next";
import Router from "next/router";
import {
  dehydrate,
  Hydrate,
  QueryClient,
  QueryClientProvider,
  useQuery,
  type DehydratedState,
} from "react-query";
import { useEffect, useState } from "react";
import App from "./App";
import { getAllImages } from "../pages/api/image/getImages";

//const queryClient = new QueryClient();

//const giphyApiKey = env["GIPHY_API_KEY"];

// pages/index.tsx

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
//const gf = new GiphyFetch(giphyApiKey);

export const getImages = async () => {
  console.log("hi");
  const data = await fetch("/api/image/getImages").then((res) => res.json());
  return data;
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("images", getAllImages);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/image/${id}`, {
    method: "DELETE",
  });
  Router.push("/");
}

async function get(): Promise<void> {
  const test = await fetch(`/api/image/getImages`, {
    method: "GET",
  });
  Router.push("/");
}

async function addPost(): Promise<void> {
  await fetch(`/api/image/addImage`, {
    method: "POST",
  });
  Router.push("/");
}

export const voteForImage = async (imageUrl: string) => {
  await fetch("/api/image/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });
};

export default function Home() {
  const { data } = useQuery("images", getImages);
  useEffect(() => {
    console.log("new data", data);
  }, []);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>which image is funnier?</div>
        <App />
        <footer>
          <a href="#" style={{ textDecoration: "underline" }}>
            todays top 10 funniest images on the web
          </a>
        </footer>
      </main>
    </>
  );
}
