import Head from "next/head"
import Link from "next/link"
import {ethers, utils} from "ethers"
import { useState, useEffect } from 'react'
import projectContract from "../../interface/projectContract.json"

import Navbar from "../../components/navbar"
import FAQ from "../../components/faq"
import Footer from "../../components/footer"

const contractAddress = "0x1E0715F1Fc2a9930A89Fd03f51b4E3b410386578";

export default function Dashboard() {
	let [allProjects, setAllProjects] = useState([]);
    
	useEffect( getProjectsFunc , []);
	async function getProjectsFunc() {
		
		let account = await ethereum.request({ method: 'eth_accounts' });
		const provider = new ethers.providers.Web3Provider(window.ethereum);

		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, projectContract.abi, signer);
        
		try {
			let getAllProjectsArray = await contract.getAllProjects(); 
			console.log(getAllProjectsArray);
			console.log(getAllProjectsArray[0].title);
			console.log(getAllProjectsArray[0][4]);
			console.log(getAllProjectsArray)
			setAllProjects(getAllProjectsArray);
		}
		catch (e) {
			console.log(e);
		}
	}
	
	return (
		<div className="w-full h-full">
			<Head>
				<title>Dashboard - Crowdfunding</title>
			</Head>
			<Navbar></Navbar>
			
			<div className="w-full h-screen flex flex-col justify-center items-center">
				<h1 className='text-5xl font-bold mb-5'>Dashboard</h1>
				<div className="grid grid-cols-3 gap-4">
					<div className="flex flex-col justify-around items-center">
						<h1 className="text-3xl">12</h1>
						<h2 className="text-xl">Projects Funded</h2>
					</div>
					<div className="flex flex-col justify-center items-center">
						<h1 className="text-3xl">12</h1>
						<h2 className="text-xl">Total Fund Raised</h2>
					</div>
					<div className="flex flex-col justify-center items-center">
						<h1 className="text-3xl">12</h1>
						<h2 className="text-xl">Total Fund Used</h2>
					</div>
				</div>
			</div>
			
			<div className="w-full h-full bg-gray-400 flex justify-start items-center flex-col">
				<h1 className='text-4xl font-bold mb-10 mt-10'>Projects</h1>
				<div className="grid grid-cols-3 grid-rows-2 gap-10 m-10">
					{allProjects.map(project => (
						<div class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm">
							<Link href={`/project/${project.projectId}`} id={project.projectId}>
								<img src={project.img} alt="" className="w-full h-64" />
							</Link>
							<div class="p-5">
								<Link href={`/project/${project.projectId}`}>
									<h5 className='font-bold text-lg'>{project.title}</h5>
								</Link>
								<p>{project.description}</p>
								<div className="grid grid-cols-2 grid-rows-2 text-sm mt-5 mb-5">
									<p>{project.currentBalance.toNumber()} ETH Raised</p>
									<p>{ethers.utils.formatEther(project.amountGoal)} ETH Remaining</p>
									<p>{ethers.utils.formatEther(project.amountGoal) - ethers.utils.formatEther(project.currentBalance)} ETH Needed</p>
								</div>
								<Link href='#'>
									<a className='bg-gray-900 text-white px-3 py-2 rounded-md text-md font-medium hover:bg-gray-400 hover:text-black mt-4'>Request Funds</a>
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
			<FAQ></FAQ>
			<Footer></Footer>
		</div>
	)
}