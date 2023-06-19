import axios from "axios";

/**
 * This function is used to send a transaction to Gelato's gasless relayer.
 *
 * @function gaslessTxn
 * @param {string} encodedTx - The encoded transaction to be sent to Gelato's gasless relayer.
 * @param {string} safeAddress - The address of the Safe that will be used to send the transaction.
 * @param {number} chainId - The chainId of the network that the transaction will be sent to.
 *
 * @returns {string} taskIdUrl - The taskIdUrl of the transaction that was sent to Gelato's gasless relayer. Call the url to get the status of the transaction.
 * */

export const gaslessTxn = async (encodedTx: string, safeAddress: string, chainId: number) => {
    const response = await axios.post('/api/gelato', {
        encodedTx,
        safeAddress,
        chainId
    })
    return response.data
}