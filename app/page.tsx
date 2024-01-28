import IQ from "@/components/IQ";
import { IQ_KEY } from "@/pages/api/vote";
import { kv } from "@vercel/kv";
import { Metadata } from "next";
import { useEffect, useState } from "react";

const HOST = process.env.NEXT_PUBLIC_HOST;

if (!HOST) throw new Error("NEXT_PUBLIC_HOST is not set");

export const metadata: Metadata = {
    title: "Small Brain Resizer",
    openGraph: {
        title: "Small Brain Resizer",
        images: ["/api/image"],
    },
    other: {
        "fc:frame": "vNext",
        "fc:frame:post_url": `${HOST}/api/vote`,
        "fc:frame:image": `${HOST}/api/image`,
        "fc:frame:button:1": "Bigger",
        "fc:frame:button:2": "Smaller",
    },
}

export default async function Page() {
    return (
        <>
            <div>
                <main >
                    Small Brain Resizer
                    <IQ/>
                </main>
            </div>
        </>
    );

}