import {
    SafeAuthKit,
    SafeAuthProviderType,
    SafeAuthSignInData,
} from "@safe-global/auth-kit";
import { SafeEventEmitterProvider } from "@web3auth/base";
import React, { useEffect, useState } from "react";
import {goerliRpc} from "@/constants";

const SafeAuthContext = React.createContext({
    loading: true,
    setLoading: (loading: boolean) => {},
    safeAuth: undefined as SafeAuthKit | undefined,
    setSafeAuth: (safeAuth: SafeAuthKit | undefined) => {},
    provider: null as SafeEventEmitterProvider | null,
    setProvider: (provider: SafeEventEmitterProvider | null) => {},
    safeAuthSignInResponse: null as SafeAuthSignInData | null,
    setSafeAuthSignInResponse: (
        safeAuthSignInResponse: SafeAuthSignInData | null
    ) => {},
});

export const SafeAuthContextProvider = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [safeAuth, setSafeAuth] = useState<SafeAuthKit>();
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<SafeAuthSignInData | null>(null)
    const chainId = "0x5"

    useEffect(() => {
        if (!localStorage.getItem("safeAuthSignInResponse")) {
            setLoading(false);
            return;
        }
        const data = JSON.parse(
            localStorage.getItem("safeAuthSignInResponse")!
        );
        setSafeAuthSignInResponse(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (loading) return;
        (async () => {
            const rpc = goerliRpc
            console.log("INITIALIZING SAFE AUTH KIT");
            const data = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
                chainId: chainId,
                txServiceUrl: "https://safe-transaction-goerli.safe.global",
                authProviderConfig: {
                    rpcTarget: rpc,
                    clientId:
                        "BPatAL0fSqJMuTrWQnymMW-GLCneYVZRZZ9giqfTJdX-0tILOtoTn_iVOvrGB9gPbTrOWAxqh4JPbrRPzWiRyiU",
                    network: "testnet",
                    theme: "dark",
                },
            });
            console.log("INITIALIZED SAFE AUTH KIT", data);
            if (safeAuthSignInResponse?.eoa) {
                const response = await data!.signIn();
                sessionStorage.setItem(
                    "safeAuthSignInResponse",
                    JSON.stringify(response)
                );
                console.log("SIGN IN RESPONSE: ", response)

                setSafeAuthSignInResponse(response);
                setProvider(data!.getProvider() as SafeEventEmitterProvider);
            }
            setSafeAuth(data);
        })();
    }, [chainId, loading]);

    return (
        <SafeAuthContext.Provider
            value={{
                loading,
                setLoading,
                safeAuth,
                setSafeAuth: (data) => {
                    console.log("SETTING SAFE AUTH", data);
                    setSafeAuth(data);
                },
                provider,
                setProvider,
                safeAuthSignInResponse,
                setSafeAuthSignInResponse,
            }}
        >
            {props.children}
        </SafeAuthContext.Provider>
    );
};

export default SafeAuthContext;