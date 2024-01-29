import { Link } from "@remix-run/react";
import { FcBullish, FcBearish, FcShipped, FcAddDatabase } from "react-icons/fc";

export default function Sidebar() {
	return (
		// <div className='h-screen w-screen bg-white dark:bg-slate-900'>
		<aside
			id='sidebar'
			className='sticky top-4 h-[calc(100vh-theme(spacing.16))] w-48 overflow-y-auto'
			aria-label='Sidebar'>
			<div className='flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-900'>
				<Link to='/' className='mb-6 flex items-center  w-full'>
					<img src='/images/logo.svg' alt='logo' />
				</Link>
				<ul className='space-y-2 text-sm font-medium'>
					<div className=' font-semibold pl-1'>Receitas</div>
					<Link to='/receitas'>
						<div className='flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'>
							<FcBullish className='w-6 h-6' />
							<span className='ml-3 flex-1 whitespace-nowrap'>Receitas</span>
						</div>
					</Link>
					<Link to='/receitas/nova'>
						<div className='flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'>
							<FcAddDatabase className='w-6 h-6' />
							<span className='ml-3 flex-1 whitespace-nowrap'>Nova</span>
						</div>
					</Link>
					<div className=' font-semibold pl-1'>Saídas</div>
					<Link to='/despesas'>
						<div className='flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'>
							<FcBearish className='w-6 h-6' />
							<span className='ml-3 flex-1 whitespace-nowrap'>Despesas</span>
						</div>
					</Link>
					<Link to='/despesas/nova'>
						<div className='flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'>
							<FcAddDatabase className='w-6 h-6' />
							<span className='ml-3 flex-1 whitespace-nowrap'>Nova</span>
						</div>
					</Link>
					<div className=' font-semibold pl-1'>Compras</div>
					<Link to='/compras'>
						<div className='flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'>
							<FcShipped className='w-6 h-6' />
							<span className='ml-3 flex-1 whitespace-nowrap'>Compras</span>
						</div>
					</Link>
					<Link to='/compras/nova'>
						<div className='flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'>
							<FcAddDatabase className='w-6 h-6' />
							<span className='ml-3 flex-1 whitespace-nowrap'>Nova</span>
						</div>
					</Link>
				</ul>
				{/* <div className='mt-auto flex'>
						<div className='flex w-full justify-between'>
							<span className='text-sm font-medium text-black dark:text-white'>
								email@example.com
							</span>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								aria-roledescription='more menu'
								fill='none'
								stroke='currentColor'
								stroke-width='2'
								className='h-5 w-5 text-black dark:text-white'
								stroke-linecap='round'
								stroke-linejoin='round'
								className='lucide lucide-more-horizontal'>
								<circle cx='12' cy='12' r='1' />
								<circle cx='19' cy='12' r='1' />
								<circle cx='5' cy='12' r='1' />
							</svg>
						</div>
					</div> */}
			</div>
		</aside>
		// </div>
	);
}
