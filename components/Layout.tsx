import {AppShell, Navbar, Header, Title} from "@mantine/core";
import {useContext, useEffect, useState} from "react";
import SafeAuthContext from "@/context/SafeAuthContext";
import {useRouter} from "next/router";
import Headers from "@/components/Header";

export function Layout({children}: { children: React.ReactNode }) {
    const ctx = useContext(SafeAuthContext);
    const router = useRouter();

    useEffect(() => {
        if (ctx.loading) return;
        if (!ctx.safeAuthSignInResponse?.eoa) router.push("/");
    }, [ctx.safeAuthSignInResponse, ctx.provider, ctx.loading]);

    return (
        <AppShell
            // navbar={<Navbar />}
            header={<Headers />}
        >
            {children}
        </AppShell>
    );
}