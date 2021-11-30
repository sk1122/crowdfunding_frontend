import Head from 'next/head'

import Navbar from '../components/navbar'
import Main from '../components/main'

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
