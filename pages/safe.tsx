import {useRouter} from "next/router";
import {Layout} from "@/components/Layout";
import {Button, Text, TextInput} from "@mantine/core";
import Head from "next/head";
import {useContext, useState} from "react";
import SafeAuthContext from "@/context/SafeAuthContext";
import {ethers} from "ethers";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import Safe from "@safe-global/safe-core-sdk";
import {MetaTransactionData, OperationType} from "@safe-global/safe-core-sdk-types";
import {gaslessTxn} from "@/lib/gaslessTxn";

export default function Home() {
    const router = useRouter()
    const ctx = useContext(SafeAuthContext);
    const [loading, setLoading] = useState(false);
    const [receiver, setReceiver] = useState("");
    const [amount, setAmount] = useState("0");

    const gelatoTxn = async () => {
        setLoading(true);
        // Using ethers
        const provider = new ethers.providers.Web3Provider(ctx.provider!);
        const signer = provider.getSigner();

        // Create EthAdapter instance
        const ethAdapter = new EthersAdapter({
            ethers,
            signerOrProvider: signer,
        });

        // Create Safe instance
        const safe = await Safe.create({
            ethAdapter,
            safeAddress: router?.query?.address as string,
        });

        /**
         * Creates a meta-transaction object to be used with a contract.
         *
         * @typedef {Object} MetaTransactionData
         * @property {string} to - The address of the contract to send funds to.
         * @property {string} data - The data payload to send with the transaction.
         * to interact with custom contracts, the data needs to be as follows:
         *      const iFace = new ethers.utils.Interface(<ABI of the smart contract>);
         *      const data = iFace.encodeFunctionData(func.name, args_);
         * @property {string} value - The amount of ETH to send with the transaction, in wei.
         * @property {OperationType} operation - The type of operation to perform.
         */

        const safeTransactionData: MetaTransactionData = {
            to: receiver,
            data: '0x',// leave blank for ETH transfers
            value: ethers.utils.parseEther(amount).toString(),
            operation: OperationType.Call
        }

        const safeTransaction = await safe.createTransaction({
            safeTransactionData
        })

        const signedSafeTx = await safe.signTransaction(safeTransaction)
        console.log(signedSafeTx.signatures)

        const encodedTx = safe.getContractManager().safeContract.encode('execTransaction', [
            signedSafeTx.data.to,
            signedSafeTx.data.value,
            signedSafeTx.data.data,
            signedSafeTx.data.operation,
            signedSafeTx.data.safeTxGas,
            signedSafeTx.data.baseGas,
            signedSafeTx.data.gasPrice,
            signedSafeTx.data.gasToken,
            signedSafeTx.data.refundReceiver,
            signedSafeTx.encodedSignatures()
        ])

        const response = await gaslessTxn(encodedTx, router.query.address as string, 5)

        console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)
        setLoading(false);
    }


    return (
        <>
            <Head>
                <title>Cryptbites - Safe</title>
            </Head>
            <Layout>
                <Text>{router?.query?.address}</Text>
                <TextInput label="Receiver Address" placeholder="0x00000" onChange={
                    (event) => {
                        setReceiver(event.currentTarget.value)
                    }
                } />
                <TextInput label="Amount" placeholder="1" onChange={
                    (event) => {
                        setAmount(event.currentTarget.value)
                    }
                } />
                <Button onClick={gelatoTxn} loading={loading}>Send Funds</Button>
            </Layout>
        </>
    )
}