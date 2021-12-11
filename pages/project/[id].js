import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import {ethers, utils} from "ethers"

import FAQ from "../../components/faq"
import Footer from "../../components/footer"
import Navbar from "../../components/navbar"
import { useEffect } from 'react/cjs/react.development'
import projectContract from "../../interface/projectContract.json"

const contractAddress = "0x1E0715F1Fc2a9930A89Fd03f51b4E3b410386578";

export default function Project() {	
	const router = useRouter()
  	const { id } = router.query

	const [project, setProject] = useState({})

	useEffect(() => {getProject(id)}, [])
	async function getProject(id) {
		let account = await ethereum.request({ method: 'eth_accounts' });
		const provider = new ethers.providers.Web3Provider(window.ethereum);

		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, projectContract.abi, signer);
        
		try {
			let getProject = await contract.getDetails(Number(id));
			setProject(getProject)
		}
		catch (e) {
			console.log(e);
		}
	}
	return (
		<div className="w-full h-full">
			<Navbar></Navbar>
			<div className="w-full h-screen flex flex-col justify-center items-center">
				<div className='flex justify-center items-center'>
					<img src={project.img} alt="" className='h-64 h-48' />
					<div class="w-96 p-5">
						<a href="#">
							<h5 className='font-bold text-lg'>{project.title}</h5>
						</a>
						<p>Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
						<div className="grid grid-cols-2 grid-rows-2 text-sm mt-5">
							<p>{project.currentBalance.toNumber()} ETH Raised</p>
							<p>{ethers.utils.formatEther(project.amountGoal)} ETH Remaining</p>
							<p>{ethers.utils.formatEther(project.amountGoal) - ethers.utils.formatEther(project.currentBalance)} ETH Needed</p>
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