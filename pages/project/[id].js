import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import {BigNumber, ethers, utils} from "ethers"
import MyModal from '../../components/modal'

import FAQ from "../../components/faq"
import Footer from "../../components/footer"
import Navbar from "../../components/navbar"
import { useEffect } from 'react/cjs/react.development'
import projectContract from "../../interface/projectContract.json"

const contractAddress = "0x16CCD8732057a52D805F03932b8b102E0695b3CD";

export default function Project() {	
	let [isOpen, setIsOpen] = useState(false);
	const router = useRouter()
  	const { id } = router.query
    const [account, setAccount] = useState("")
    const [Creator, setCreator] = useState("")
	const [project, setProject] = useState([]);
	const [requests, setRequests] = useState([]);
	const [amountToFund, setAmount] = useState()
	const [myFunds, setMyFunds] = useState("");
	
	


	useEffect(() => {getProject(id)}, [id]) 
	
	async function getProject(id) { 
		console.log(id)
		let account = await ethereum.request({ method: 'eth_accounts' });
		setAccount(account[0]);
        let creator = project.creator;
		setCreator(creator);
		 
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
		let account = await ethereum.request({ method: 'eth_accounts' });
		console.log("account is ", account[0], Creator);
		
		let myFunding = await contract.myContributions(Number(id), account[0]);
	
		console.log(myFunding);
		setMyFunds((Number(myFunding)/1000000000000000000).toFixed(6));
	}

	async function getAllRequest() {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let contract = new ethers.Contract(contractAddress, projectContract.abi, provider);

		try {
		let allRequests = await contract.getAllRequests(Number(id));
		setRequests(allRequests);	
			
		} catch (e) {
			console.log(e);
			
		}

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
			{   <div className="w-full h-full bg-gray-400 flex justify-start items-center flex-col">
					<h1 className='text-4xl font-bold mb-10 mt-10'> Project Withdrawal Requests</h1>
					{ <a onClick={() => setIsOpen(true)} className='bg-gray-900 text-white px-3 py-2 rounded-md text-xl font-medium hover:bg-gray-400 hover:text-black mr-12'> Create Withdrawal Request</a>}
					<div className="grid grid-cols-3 grid-rows-2 gap-10 m-10">


					<div class="p-4 md:w-full w-full"> 
					{requests.map( (request) => (<div class="h-full bg-gray-100 p-8 rounded">
          
        
                       <p className="leading-relaxed mb-6"> {request.desc} </p>
                       <a className="inline-flex items-center">
            			<span className="flex-grow flex flex-col pl-4">
             			 <span className="title-font font-medium text-gray-900"> Withdrawal Address  - {request.receipient}</span>
             			 <span className="title-font font-medium text-gray-900"> Withdrawal Value  - {(Number(request.value)/1000000000000000000).toFixed(6)} </span>
             			 <span className="title-font font-medium text-gray-900"> Total Current Votes  - {request.noOfVoter} </span>
             			 <span className="title-font font-medium text-gray-900"> Votes Required For Withdrawal  - {Number(project.noOfContributors) - Number(request.noOfVoter)} </span>
						  <a className='bg-gray-900 text-white px-3  py-2 rounded-md text-md font-medium hover:bg-gray-400 hover:text-black mt-4' > Vote This Request</a> 
            
                      </span>
                   </a>
                   </div>) )}
                  </div>
					 
					 
						

					</div>
				</div> 






					

				
				
				}
				<MyModal isOpen={isOpen} setIsOpen={setIsOpen} title='Start a Project'>
				<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="title">
							Project Name
						</label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Title" />
					</div>
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="description">
							Project Description
						</label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" placeholder="Description" />
					</div>
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="fundamount">
							Project Fund Amount
						</label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="fundamount" type="number" placeholder="Fund Amount" />
					</div>
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="time">
							Raise Until (In days)
						</label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="time" type="number" placeholder="Raise Until" />
					</div>
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="location">
							Location
						</label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="location" type="text" placeholder="Location" />
					</div>
					
					<div class="w-full px-3 mb-6 md:mb-0">
						<label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
							Category
						</label> 
					
					</div>
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="location">
						Upload Project Cover (On IPFS)
						</label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="location" type="file" name="fileInput" id="fileInput" placeholder="Upload Project Cover" />
					</div>
					<div class="flex items-center justify-center mt-5">
						<button onClick={() => {setIsOpen(false);
						  startProject();  }} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
							Start
						</button>
					</div>
				</form>
			</MyModal>

			<FAQ></FAQ>
			<Footer></Footer>
		</div>
	)
}