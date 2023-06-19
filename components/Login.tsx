import {Button} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {useContext} from "react";
import SafeAuthContext from "@/context/SafeAuthContext";
import {SafeEventEmitterProvider} from "@web3auth/base";
import {useRouter} from "next/router";

export default function Login() {
    const safeContext = useContext(SafeAuthContext);
    const router = useRouter();
    const login = async () => {
        if (!safeContext.safeAuth) return;
        notifications.show({
            id: "login",
            title: "Logging in...",
            message: "Please wait...",
            autoClose: false,
            loading: true,
        });
        try {
            const response = await safeContext.safeAuth.signIn();
            localStorage.setItem(
                "safeAuthSignInResponse",
                JSON.stringify(response)
            );
            console.log("SIGN IN RESPONSE: ", response);
            safeContext.setSafeAuthSignInResponse(response);
            safeContext.setProvider(
                safeContext.safeAuth.getProvider() as SafeEventEmitterProvider
            );
            notifications.update({
                id: "login",
                title: "Logged in",
                message: "You are now logged in",
                autoClose: true,
            })
            setTimeout(() => {
                router.push("/home");
            }, 1500)
        } catch (e) {
            console.log("SIGN IN ERROR: ", e);
            notifications.update({
                id: "login",
                title: "Error logging in",
                message: "Please try again",
                autoClose: true,
                color: "red",
            });
        }
    };

    return (
        <Button onClick={login}>
            Login
        </Button>
    )
}