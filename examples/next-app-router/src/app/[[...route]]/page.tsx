import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

type PageProps = {
    title: string;
    content?: string;
};

const pagePropsByPath: Record<string, PageProps> = {
    "/": {
        title: "Privatperson",
    },
    "/arbeidsgiver": {
        title: "Arbeidsgiver",
    },
    "/samarbeidspartner": {
        title: "Samarbeidspartner",
    },
};

export default async function Home({ params }: { params: Promise<{ route: string[] }> }) {
    const { route } = await params;
    const path = "/" + (route?.join("/") || "");

    console.log(`Fetching from ${path}`);

    const pageProps = pagePropsByPath[path];

    return (
        <main className={styles.main}>
            <Link href={"/"}>{"Privatperson"}</Link>
            <Link href={"/arbeidsgiver"}>{"Arbeidsgiver"}</Link>
            <Link href={"/samarbeidspartner"}>{"Samarbeidspartner"}</Link>
            <Link href={"/aap"}>{"AAP"}</Link>
            {<h1>{pageProps ? pageProps.title : `Fant ikke siden for ${path}`}</h1>}
            {pageProps && <p>{pageProps.content}</p>}
        </main>
    );
}
