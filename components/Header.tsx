import {Button, Group, Header, Text, Title} from "@mantine/core";
import {useContext} from "react";
import SafeAuthContext from "@/context/SafeAuthContext";
import {useRouter} from "next/router";

export default function Headers() {
    const ctx = useContext(SafeAuthContext);
    const router = useRouter()

    const logout = async () => {
        if (!ctx.safeAuth) return;
        await ctx.safeAuth.signOut();
        localStorage.removeItem("safeAuthSignInResponse");
        localStorage.removeItem("provider");
        ctx.setProvider(null);
        ctx.setSafeAuthSignInResponse(null);
        router.push("/");
    };

    return (
        <Header height={80} bg="black" p="md">
            <Group position="apart">
                <Title>Safe Test</Title>
                <Group>
                    <Text>{ctx.safeAuthSignInResponse?.eoa}</Text>
                <Button color="red" onClick={logout}>Logout</Button>
                </Group>
            </Group>
        </Header>
    )
}