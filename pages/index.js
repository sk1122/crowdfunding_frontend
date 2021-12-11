import Head from 'next/head'

import Navbar from '../components/navbar'
import Main from '../components/main'

export const CONTRACT_ADDRESS = '0x49409089958B64dD76E5B904aEe609a3B3346B74'

export default function Home() {
  return (
    <div className='bg'>
      <Head>
        <title>Crowdfunding</title>
      </Head>
      <div className='w-full h-screen'>
        <Navbar></Navbar>
        <Main></Main>
      </div>
    </div>
  )
}
