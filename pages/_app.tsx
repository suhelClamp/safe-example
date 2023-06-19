import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {SafeAuthContextProvider} from "@/context/SafeAuthContext";
import {Notifications} from "@mantine/notifications";

export default function App({Component, pageProps}: AppProps) {
    return (
        <SafeAuthContextProvider>
            <Notifications position="top-right"/>
            <Component {...pageProps} />
        </SafeAuthContextProvider>
    )
}
