import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default async function Home(props: { params: { route: string[] } }) {
    const { params } = props;

    const path = params.route?.join("/") || "";

    console.log(`Fetching from ${path}`);

    const pageProps = await fetch(
        `http://localhost:8080/_/service/no.nav.navno/sitecontent?id=/www.nav.no/${path}`,
        { headers: { secret: "dummyToken" } },
    ).then((res) => res.json());

    return (
        <main className={styles.main}>
            <Link href={"/"}>{"Privatperson"}</Link>
            <Link href={"/arbeidsgiver"}>{"Arbeidsgiver"}</Link>
            <Link href={"/aap"}>{"AAP"}</Link>
            <h1>{pageProps.displayName}</h1>
            {/*<code>{JSON.stringify(pageProps)}</code>*/}
        </main>
    );
}
