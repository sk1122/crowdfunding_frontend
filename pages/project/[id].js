import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import {BigNumber, ethers, utils} from "ethers"

import FAQ from "../../components/faq"
import Footer from "../../components/footer"
import Navbar from "../../components/navbar"
import { useEffect } from 'react/cjs/react.development'
import projectContract from "../../interface/projectContract.json"

const contractAddress = "0x16CCD8732057a52D805F03932b8b102E0695b3CD";

export default function Project() {	
	const router = useRouter()
  	const { id } = router.query

	const [project, setProject] = useState([])
	const [amountToFund, setAmount] = useState()
	const [myFunds, setMyFunds] = useState("");
	const [account, setAccount] = useState("");
	


	useEffect(() => {getProject(id)}, [id]) 
	
	async function getProject(id) { 
		console.log(id)
		let account = await ethereum.request({ method: 'eth_accounts' });
		
		 setAccount(account[0]);
		const provider = new ethers.providers.Web3Provider(window.ethereum);

		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, projectContract.abi, provider);
		
		try {
			console.log(id)
			let getProject = await contract.getDetails(Number(id));
			setProject(getProject)
			console.log(getProject);


			await myContribution(id)
			
		}
		catch (e) {
			console.log(e);
		}
	}

	async function fundProject() {
		console.log(amountToFund);
		getProject(id)
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner();
		let contract = new ethers.Contract(contractAddress, projectContract.abi, signer);

		try {

			let amountToContribute  = utils.parseEther(amountToFund);
			const options = {value: amountToContribute }
			console.log(options);
		 let fundProjectTxn = await contract.contribute(Number(id), options);
		 await fundProjectTxn.wait();
		 getProject(id)
			
		} catch (e) {
			console.log(e);
			
			
		}
	}

	async function getRefund() {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner();
		let contract = new ethers.Contract(contractAddress, projectContract.abi, signer);
        
		let refundtxn  = await contract.getRefund(id);
		alert("refund status",refund)
		getProject(id)
	}

	async function myContribution() {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner();
		let contract = new ethers.Contract(contractAddress, projectContract.abi, provider);
        console.log(id);
		console.log("account is ", account);
		
		let myFunding = await contract.myContributions(Number(id), account);
	
		console.log(myFunding);
		setMyFunds((Number(myFunding)/1000000000000000000).toFixed(6));
	}



	return (
		<div className="w-full h-full">
			<Navbar></Navbar>
			<div className="w-full h-screen flex flex-col justify-center  items-center">
				<div className='flex justify-center items-center '>
					<img src={project.img} alt="" className='h-80 -translate-x-44 ' />
					<div class="w-96 p-4">
						<a href="#">
							<h5 className='font-bold text-lg '>{project.title}</h5>
						</a>
						<p className=''> {project.description} </p>
						<br />
						{project.state == 0 && <p className=''> Current Status :- Fundraising</p>}
						{project.state == 1 && <p className=''> Current Status :- Expired</p>}
						{project.state == 2 && <p className=''> Current Status :- Succesfull</p>}
						<p>{Number(project.deadline)}</p>
						<div className="grid grid-cols-2 grid-rows-2 text-sm mt-5">
							<p>{(Number(project.currentBalance)/1000000000000000000).toString()} ETH Raised</p>
							<br />
							<p>{Number(project.amountGoal)/1000000000000000000} ETH Goal</p>
							<br />
							{Number(project.amountGoal) > (Number(project.currentBalance)) && <p>{Number(project.amountGoal)/1000000000000000000 - Number(project.currentBalance)/1000000000000000000} ETH Needed</p> }
							{Number(project.amountGoal) < (Number(project.currentBalance)) && <p> 0 ETH Needed</p> }
						</div>
					</div>
				</div>
				<p className='translate-x-36'>	Your Contribution - {myFunds} </p>
				<input className="shadow appearance-none translate-x-32  border rounded w-230 py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="number" placeholder="Amount In Ether" onChange={(e)=> setAmount(e.currentTarget.value)} />

					<a className='bg-gray-900 text-white px-3  translate-x-32  py-2 rounded-md text-md font-medium hover:bg-gray-400 hover:text-black mt-4' onClick={fundProject}>Fund this Project</a>

				{project.state == 1 && <a className='bg-gray-900 text-white px-3  translate-x-32  py-2 rounded-md text-md font-medium hover:bg-gray-400 hover:text-black mt-4' onClick={utils.parseEther(getRefund)}> Get Refund</a>}
			
			</div>
			<FAQ></FAQ>
			<Footer></Footer>
		</div>
	)
}