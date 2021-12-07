import Head from 'next/head'
import Link from 'next/link'
import {ethers, utils} from "ethers"
import { useState, useEffect } from 'react'
import projectContract from "../interface/projectContract.json"

import Navbar from '../components/navbar'
import MyModal from '../components/modal'
import FAQ from '../components/faq'
import Footer from '../components/footer'

const contractAddress = "0x1E0715F1Fc2a9930A89Fd03f51b4E3b410386578";

export default function Home() {
	let [isOpen, setIsOpen] = useState(false)

	let mapp = [1, 2, 3, 4, 5, 6];
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
	
		setAllProjects(getAllProjectsArray);
			}
			catch (e) {
				console.log(e);
				
			}
	}

    
	return (
		<div>
			<Head>
				<title>Fund - Crowdfunding</title>
			</Head>
			<div className='w-full h-full'>
				<Navbar></Navbar>
				<div className="w-full h-screen flex flex-col justify-center items-center">
					<h1 className='text-4xl font-bold mb-5'>Find a Project and fund them in ETH&nbsp;&nbsp;&nbsp;</h1>
					<Link href='#'>
						<a onClick={() => setIsOpen(true)} className='bg-gray-900 text-white px-3 py-2 rounded-md text-xl font-medium hover:bg-gray-400 hover:text-black mr-12'>Find a Project</a>
					</Link>
				</div>
				<div className="w-full h-full bg-gray-400 flex justify-start items-center flex-col">
					<h1 className='text-4xl font-bold mb-10 mt-10'>Projects</h1>
					<div className="grid grid-cols-3 grid-rows-2 gap-10 m-10">
						{allProjects.map(project => (
							<div class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm">
								<a href="#" id={project.id}>
									<img src={project.img} alt="" />
								</a>
								<div class="p-5">
									<a href="#">
										<h5 className='font-bold text-lg'>{project.title}</h5>
									</a>
									<p>{project.description}</p>
									<div className="grid grid-cols-2 grid-rows-2 text-sm mt-5">
									<p>{project.currentBalance.toNumber()} ETH Raised</p>
										<p>{ethers.utils.formatEther(project.amountGoal)} ETH Goal</p>
										<p>{ethers.utils.formatEther(project.amountGoal) - ethers.utils.formatEther(project.currentBalance)} ETH Needed</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<FAQ></FAQ>
				<Footer></Footer>
			</div>
			<MyModal isOpen={isOpen} setIsOpen={setIsOpen} title='Find a Project'>
				<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<div class="w-full px-3 mb-6 md:mb-0">
						<label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
							Category
						</label>
						<div class="relative">
							<select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
								<option>DAO</option>
								<option>NFT</option>
								<option>DeFi</option>
							</select>
							<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
								<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
							</div>
						</div>
					</div>
					<div class="w-full px-3 mb-6 md:mb-0">
						<label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
							Category
						</label>
						<div class="relative">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="fundamount">
							From Project ID
						</label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="fundamount" type="number" placeholder="Enter Project ID" />
						</div>
					</div>
					<div class="w-full px-3 mb-6 md:mb-0">
						
						 <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
							From Project Creator Address
						  </label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Project Creator Address" />
						
					</div>
					<div class="flex items-center justify-center mt-5">
						<button onClick={() => setIsOpen(false)} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
							Discover
						</button>
					</div>
				</form>
			</MyModal>
		</div>
	)
}
