import Head from "next/head";
import {Group, Image, Text, Title, Modal, Button} from "@mantine/core";
import {useContext, useState} from "react";
import SafeAuthContext from "@/context/SafeAuthContext";
import makeBlockie from "ethereum-blockies-base64";
import {Layout} from "@/components/Layout";
import CreateSafeForm from "@/components/CreateSafeForm";

export default function Home(){
    const safeContext = useContext(SafeAuthContext);
    const [modalOpened, setModalOpened] = useState(false);

    const open = () => {
        setModalOpened(true);
    };

    const modal = (
        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} centered radius={"lg"} returnFocus
               title={"Create Safe"}>
            <CreateSafeForm/>
        </Modal>
    );

    return (
        <>
            <Head>
                <title>Safe Test</title>
            </Head>
            <Layout>
                <Title>You are logged in!</Title>
                <Group>
                    <Image width={60} radius="xl" src={makeBlockie(safeContext.safeAuthSignInResponse?.eoa || "0x00")} />
                    <Text>{safeContext.safeAuthSignInResponse?.eoa}</Text>
                </Group>
                <Button onClick={open}>Create Safe</Button>
                {modal}
            </Layout>
        </>
    )
}