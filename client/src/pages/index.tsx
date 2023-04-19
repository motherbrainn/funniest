import Head from "next/head";
import { GetStaticProps } from "next";
import Router from "next/router";
import { dehydrate, QueryClient } from "react-query";
import ImageContainer from "./ImageContainer";
import { getAllImages } from "../pages/api/image/getImages";
import Link from "next/link";

export const getImages = async () => {
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
  return (
    <>
      <Head>
        <title>funniest</title>
        <meta name="description" content="funniest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>which image is funniest?</h1>
        <ImageContainer />
        <footer>
          <Link href="/top10">todays top 10 funniest images on the web</Link>
        </footer>
      </main>
    </>
  );
}
