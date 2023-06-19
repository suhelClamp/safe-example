import type {NextApiRequest, NextApiResponse} from 'next'
import {GelatoRelayAdapter, MetaTransactionOptions, RelayTransaction} from "@safe-global/relay-kit";
import {ethers} from "ethers";

type Data = {
    error?: string
    taskId?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        const {
            encodedTx,
            safeAddress,
            chainId
        } = req.body as { encodedTx: string, safeAddress: string, chainId: number }

        if (!encodedTx || !safeAddress || !chainId) {
            res.status(400).json({error: 'Missing required parameters'})
        }

        /**
         * Obtain the Gelato API key from https://relay.gelato.network/balance
         * */
        const relayAdapter = new GelatoRelayAdapter(process.env.GELATO_API_KEY)

        const gasLimit = '100000'
        const options: MetaTransactionOptions = {
            gasLimit: ethers.BigNumber.from(gasLimit),
            isSponsored: true
        }

        try {
            const relayTransaction: RelayTransaction = {
                target: safeAddress,
                encodedTransaction: encodedTx,
                chainId: chainId,
                options
            }

            const response = await relayAdapter.relayTransaction(relayTransaction)
            res.status(200).json({taskId: response.taskId})
        } catch (e: any) {
            res.status(400).json({error: e.message})
        }
    }
}
