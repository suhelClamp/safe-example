import Head from 'next/head'
import {Center, Text} from "@mantine/core";
import Login from "@/components/Login";

export default function Home() {
  return (
    <>
      <Head>
        <title>Safe Example</title>
        <meta name="description" content="Cryptbites - your social recovery crypto wallet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Text>Hello Safe</Text>
          <Center>
              <Login />
          </Center>
      </main>
    </>
  )
}
