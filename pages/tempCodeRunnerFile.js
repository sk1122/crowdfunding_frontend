<div className="w-full h-full bg-gray-400 flex justify-start items-center flex-col">
					<h1 className='text-4xl font-bold mb-10 mt-10'>Your Projects</h1>
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