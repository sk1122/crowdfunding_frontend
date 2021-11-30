import Head from 'next/head'
import Link from 'next/link'

export default function Main() {
	return (
		<div className='w-full h-full flex flex-col justify-center items-center'>
			<h1 className='text-6xl text-arvo font-semibold text-center'>Creative work shows us what’s possible. <br /> Help fund it here.</h1>
			<div className="flex justify-center items-center mt-3 text-white mt-5">
				<Link href='#'>
					<a className='bg-gray-900 text-white px-3 py-2 rounded-md text-xl font-medium hover:bg-gray-400 hover:text-black mr-12'>Start a Project</a>
				</Link>
				<Link href='#'>
					<a className='bg-gray-900 text-white px-3 py-2 rounded-md text-xl font-medium hover:bg-gray-400 hover:text-black'>Fund a Project</a>
				</Link>
			</div>
		</div>
	)
}