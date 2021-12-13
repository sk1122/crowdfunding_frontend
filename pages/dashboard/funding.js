import Head from "next/head"
import Link from "next/link"
import {ethers, utils} from "ethers"
import { useState, useEffect } from 'react'
import projectContract from "../../interface/projectContract.json"

import Navbar from "../../components/navbar"
import FAQ from "../../components/faq"
import Footer from "../../components/footer"

const contractAddress = "0x57CbA0853e54f80D566228c6842c32Fc6d11A3a1";

export default function Dashboard() {
	let [allProjects, setAllProjects] = useState([]);
    let [account, setAccount] = useState("");
	useEffect( getProjectsFunc , []);
	async function getProjectsFunc() {
		
		let account = await ethereum.request({ method: 'eth_accounts' });
		setAccount(account);
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
			
			<div className="w-full h-full bg-gray-400 flex justify-start items-center  flex-col">
			<br />
			<br />
			<br />
			<br />
				<h1 className='text-4xl font-bold mb-10 mt-10'>Projects</h1>
				<div className="grid grid-cols-3 grid-rows-2 gap-10 m-10">
						{ allProjects.filter((ele)=> ele.creator.toLowerCase() == account[0].toLowerCase()).map(project => (
							<div class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm" id={project.id}>
							<Link href={`/project/${Number(project.projectId)}`} id={project.projectId}>
									<img src={project.img} alt="" />
							</Link>
								<div class="p-4">
									<a href="#">
										<h5 className='font-bold text-lg'>{project.title}</h5>
									</a>
									{project.state == 0 && <p className=''> Current Status :- Fundrasing</p>}
									{project.state == 1 && <p className=''> Current Status :- Expired</p>}
									{project.state == 2 && <p className=''> Current Status :- Succesfull</p>}
									
									<br />
									<p>{project.description}</p>
									<div className="grid grid-cols-2 grid-rows-2 text-sm mt-5">
										<p>{Number(ethers.utils.formatEther(project.currentBalance)).toFixed(6)} ETH Raised</p>
										<br />
										<p>{Number(ethers.utils.formatEther(project.amountGoal)).toFixed(6)} ETH Goal</p>
										<br />
										<p>{Number(ethers.utils.formatEther(project.amountGoal)).toFixed(6) - Number(ethers.utils.formatEther(project.currentBalance)).toFixed(6)} ETH Needed</p>
									</div>
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