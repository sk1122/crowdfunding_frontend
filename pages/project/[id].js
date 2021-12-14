import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import {BigNumber, ethers, utils} from "ethers"
import MyModal from '../../components/modal'

import FAQ from "../../components/faq"
import Footer from "../../components/footer"
import Navbar from "../../components/navbar"
import { useEffect } from 'react'
import projectContract from "../../interface/projectContract.json"

const contractAddressRinkeby = "0x6E4EC75096C050Cda0467fD9DC0D35496538b019";
const contractAddress = "0x6C9AE8B5FCAFBCaFb0404e259f72F6b143d4e69f"; // mumbai matic
export default function Project() {	
	let [isOpen, setIsOpen] = useState(false);
	const router = useRouter()
  	const { id } = router.query
	const [account, setAccount] = useState("")
 
	const [project, setProject] = useState([]);
	
	const [requests, setRequests] = useState([]);
	const [amountToFund, setAmount] = useState()
	const [myFunds, setMyFunds] = useState(0);

	// state for withdraw
	const [amountToWithdraw, setAmountToWithdraw] = useState(0);
	const [description, setDescription ] = useState("");
	const [receiptent, setReceiptent] = useState("");

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
		
		await getAllRequest();
	}

	async function fundProject() {
		console.log(amountToFund);
		getProject(id)
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner();
		let contract = new ethers.Contract(contractAddress, projectContract.abi, signer);

		if(amountToFund == "" || amountToFund <= 0) {
			alert("funding amount can't be 0 or less since you can't pour from an empty cup");
		}
		else {
			try {
				let amountToContribute  = utils.parseEther(amountToFund);
				const options = {value: amountToContribute }
				let fundProjectTxn = await contract.contribute(Number(id), options);
				await fundProjectTxn.wait();
				getProject(id)	
			} catch (e) {
				alert("project is expired or succesfull, consider updating the state (from button below fund project) so that it can appear on the project that the project is expired for everyone" )
			}
		}
	}

	async function getRefund() {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner();
		let contract = new ethers.Contract(contractAddress, projectContract.abi, signer);
		try {
		let refundtxn  = await contract.getRefund(Number(id));
		await refundtxn.wait();

		// alert("refund status",refundtxn)
		getProject(id)

		}
		catch (e) {
			alert(e);
		}

	}

	async function updateStatus() {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner();
		let contract = new ethers.Contract(contractAddress, projectContract.abi, signer);

		let check = await contract.checkIfFundingCompleteOrExpired(Number(id));
		await check.wait();
		getProject(id)
	}
 

	async function vote(e) {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner();
		let contract = new ethers.Contract(contractAddress, projectContract.abi, signer);
		try {
			console.log(e.currentTarget.id);
			
			let votetxn  = await contract.voteRequest(Number(id), e.currentTarget.id);
			await votetxn.wait();
			getProject(id)
		}
		catch (e) {
			alert(e);
		}
	}

	async function myContribution() {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner();
		let contract = new ethers.Contract(contractAddress, projectContract.abi, provider);
		console.log(id);
		let accounts = await ethereum.request({ method: 'eth_accounts' });
		console.log("account is ", accounts[0]);
		
		
		let myFunding = await contract.myContributions(Number(id), accounts[0]);
	
		console.log(myFunding);
		setMyFunds((Number(myFunding)/1000000000000000000).toFixed(6));
	}

	async function getAllRequest() {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let contract = new ethers.Contract(contractAddress, projectContract.abi, provider);
	   
	  	
		try {
			let allRequests = await contract.getAllRequests(Number(id));
			setRequests(allRequests);	
			console.log(allRequests);		
		} catch (e) {
			console.log(e)
		}

	}

	async function createRequest() {
		if(account.toLowerCase() != project.creator.toLowerCase() ) {
			alert("You are not the creator of this project/campaign so you can't create request");
		}

		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner();
		let contract = new ethers.Contract(contractAddress, projectContract.abi, signer);


		try {
			let amount = ethers.utils.parseEther(amountToWithdraw);
			console.log(amount, description, receiptent);
			let createRequestTxn = await contract.createRequest(Number(id), description, amount, receiptent);
			await createRequestTxn.wait();
			console.log("request created"); 
			getAllRequest();
		} catch (e) {
			alert(e.message)
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
							<p>MATIC Raised :- {(Number(project.currentBalance)/1000000000000000000).toFixed(2)} </p>
							<br />
							<p> MATIC Goal :- {Number(project.amountGoal)/1000000000000000000}</p>
							<br />
							{Number(project.amountGoal) > (Number(project.currentBalance)) && <p> MATIC Needed :- {(Number(project.amountGoal)/1000000000000000000 - Number(project.currentBalance)/1000000000000000000).toFixed(3)} </p> }
							{Number(project.amountGoal) < (Number(project.currentBalance)) && <p> MATIC Needed :- 0</p> }
						</div>
					</div> 
				</div>
				<p className='translate-x-36'>	Your Contribution - {myFunds} </p>
				<input className="shadow appearance-none translate-x-32  border rounded w-230 py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="number" placeholder="Amount In Ether" onChange={(e)=> setAmount(e.currentTarget.value)} />

					<a className='bg-gray-900 text-white px-3  translate-x-32  py-2 rounded-md text-md font-medium hover:bg-gray-400 hover:text-black mt-4' onClick={fundProject}>Fund this Project</a>
					<br />
				<p className=''> If getting error while funding, it means project is expired (if not succesful), consider updating the status 👇 so that it can appear on the project that the project is expired for everyone  </p>	<a className='bg-gray-200 text-white px-3  translate-x-32  py-2 rounded-md text-md font-medium hover:bg-gray-100 hover:text-black mt-4' onClick={updateStatus}> Update State</a>

				{project.state == 1 && <a className='bg-gray-900 text-white px-3  translate-x-32  py-2 rounded-md text-md font-medium hover:bg-gray-400 hover:text-black mt-4' onClick={getRefund}> Get Refund</a>}
			
			</div>
			{   <div className="w-full h-full bg-gray-400 flex justify-start items-center flex-col">
					<h1 className='text-4xl font-bold mb-5 mt-10'> Project Withdrawal Requests</h1>
					<a  className=' text-black px-3 py-2 text-xl font-medium mr-12 '> Balance - {(Number(project.currentBalance)/1000000000000000000).toFixed(5)} </a>


					{<a onClick={() => setIsOpen(true)  } className='bg-gray-900 text-white px-3 py-2 rounded-md text-xl font-medium hover:bg-gray-400 hover:text-black mr-12 '> Create Withdrawal Request</a>}
					<div className="grid grid-cols-3 grid-rows-2 gap-10 m-10">


					{requests.map( (request) => (<div class="p-4 md:w-full w-full"> 
						  <div class="h-full bg-gray-100 p-8 rounded">
		  
		
					   <p className="leading-relaxed font-medium mb-6"> {request.desc} </p>
					   <a className="inline-flex items-center">
						<span className="flex-grow flex flex-col ">
						<span className="title-font font-medium text-gray-900"> Current Status  - {!request.status && "Not Completed"} {request.status && "Completed"}</span>
							<br />
						<span className="title-font font-medium text-gray-900"> Request ID  - {Number(request.requestId)}</span>
						<span className="title-font font-medium text-gray-900"> Withdrawal Address  - {request.receipient}</span>
						<span className="title-font font-medium text-gray-900"> Withdrawal Value  - {(Number(request.value)/1000000000000000000).toFixed(3)} </span>
						<span className="title-font font-medium text-gray-900"> Withdrawal Fee (3%) - {(Number(request.value)*3/100000000000000000000).toFixed(3)} </span>
						<span className="title-font font-medium text-gray-900"> Total Current Votes  - {Number(request.noOfVoter)} </span>
						<span className="title-font font-medium text-gray-900">
						   Votes Required For Withdrawal  - {Math.round((Number(project.noOfContributors) - Number(request.noOfVoter))/2)}
						</span>
						  { !request.status && <a className='bg-gray-900 text-white px-16  py-2 rounded-md text-md font-medium hover:bg-gray-400 hover:text-black mt-10' id={Number(request.requestId)} onClick={(e) => {vote(e)}} > <p className='mx-16 px-4'> Vote This Request</p></a> }
			
					  </span>
				   </a>
				   </div>
				  </div>) )}
					 
					 
						

					</div>
				</div> }
				<MyModal isOpen={isOpen} setIsOpen={setIsOpen} title='Start a Project'>
				<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="description">
							Request Description
						</label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" onChange={(e) => setDescription(e.currentTarget.value)} type="text" placeholder="description" />
					</div>
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="amount">
							Request  Amount
						</label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={(e) => setAmountToWithdraw(e.currentTarget.value)} id="amount" type="number" placeholder="request Amount" />
					</div>
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="location">
							Receiptent Address
						</label>
						<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={(e)=> setReceiptent(e.currentTarget.value)} id="address" type="text" placeholder="address of the receiptent" />
					</div>
					<a onClick={() =>{ setIsOpen(false)
					createRequest() } } className='bg-gray-900 text-white px-3 py-2 rounded-md text-xl font-medium hover:bg-gray-400 hover:text-black mr-12'> Create Withdrawal Request</a>
				</form>
			</MyModal>

			<FAQ></FAQ>
			<Footer></Footer>
		</div>
	)
}