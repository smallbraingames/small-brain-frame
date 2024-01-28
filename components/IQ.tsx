"use client";

import { useEffect, useState } from "react";


const IQ = () => {
    const [iq, setIq] = useState<number| undefined>(undefined);

    useEffect(() => {
        fetch("/api/iq").then((res) => res.json()).then((iq) => setIq(iq ?? undefined));    
    }, [])

    return (
        <>
            <div>
                <main >
                    Small Brain Resizer: ${iq ?? "-"}
                </main>
            </div>
        </>
    );
}

export default IQ;
