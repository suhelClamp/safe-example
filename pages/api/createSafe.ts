import {SafeAccountConfig, SafeDeploymentConfig, SafeFactory} from '@safe-global/safe-core-sdk'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import {ethers} from 'ethers'
import {NextApiRequest, NextApiResponse} from "next";
import {goerliRpc} from "@/constants";

/**
 * The createSafe API endpoint is used to create a new Safe on Goerli testnet.
 * It accepts a list of owners and a threshold.
 * It prints the safe transaction hash and the safe address to the console.
 * It returns the safe address to the client.
 * */

interface Config {
    DEPLOYER_ADDRESS_PRIVATE_KEY: string
    DEPLOY_SAFE: {
        SALT_NONCE: string
    }
}

const config: Config = {
    DEPLOYER_ADDRESS_PRIVATE_KEY: process.env.PRIVATE_KEY as string,
    DEPLOY_SAFE: {
        SALT_NONCE: Math.floor(Math.random() * 9999).toString()
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {owners, threshold} = req.body as {owners: string[], threshold: number}
    const provider = new ethers.providers.JsonRpcProvider(goerliRpc)
    const deployerSigner = new ethers.Wallet(config.DEPLOYER_ADDRESS_PRIVATE_KEY, provider)
    console.log('Deployer address:', deployerSigner.address)

    const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: deployerSigner
    })

    // Create SafeFactory instance
    const safeFactory = await SafeFactory.create({ ethAdapter })

    // Config of the deployed Safe
    const safeAccountConfig: SafeAccountConfig = {
        owners: owners,
        threshold: threshold
    }
    const safeDeploymentConfig: SafeDeploymentConfig = {
        saltNonce: config.DEPLOY_SAFE.SALT_NONCE
    }

    // Predict deployed address
    const predictedDeployAddress = await safeFactory.predictSafeAddress({
        safeAccountConfig,
        safeDeploymentConfig
    })

    function callback(txHash: string) {
        console.log('Transaction hash:', txHash)
    }

    // Deploy Safe
    const safe = await safeFactory.deploySafe({
        safeAccountConfig,
        safeDeploymentConfig,
        callback
    })

    console.log('Predicted deployed address:', predictedDeployAddress)
    console.log('Deployed Safe:', safe.getAddress())

    res.status(200).json({safeAddress: safe.getAddress()})
}