import { useRouter } from 'next/router'
import Link from 'next/link'

import FAQ from "../../components/faq"
import Footer from "../../components/footer"
import Navbar from "../../components/navbar"

export default function Project() {	
	const router = useRouter()
  	const { id } = router.query
	return (
		<div className="w-full h-full">
			<Navbar></Navbar>
			<div className="w-full h-screen flex flex-col justify-center items-center">
				<div className='flex justify-center items-center'>
					<img src="https://flowbite.com/docs/images/blog/image-1.jpg" alt="" className='w-64 h-48' />
					<div class="w-96 p-5">
						<a href="#">
							<h5 className='font-bold text-lg'>Noteworthy technology acquisitions 2021</h5>
						</a>
						<p>Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
						<div className="grid grid-cols-2 grid-rows-2 text-sm mt-5">
							<p>25 ETH Raised</p>
							<p>10 ETH Remaining</p>
							<p>35 ETH Needed</p>
						</div>
					</div>
				</div>
				<Link href='#'>
					<a className='bg-gray-900 text-white px-3 py-2 rounded-md text-md font-medium hover:bg-gray-400 hover:text-black mt-4'>Fund this Project</a>
				</Link>
			</div>
			<FAQ></FAQ>
			<Footer></Footer>
		</div>
	)
}