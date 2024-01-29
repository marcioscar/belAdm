import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

import { Form } from "@remix-run/react";

export default function Drawerconta() {
	return (
		<Drawer>
			<DrawerTrigger>
				<Button
					type='reset'
					variant='outline'
					size='xs'
					name='_action'
					value='abrir'>
					+
				</Button>
			</DrawerTrigger>
			<DrawerContent className=' h-3/4'>
				<div className='mx-auto w-full max-w-md'>
					<Form method='post' encType='multipart/form-data'>
						<DrawerHeader className=' mx-auto w-full  place-content-center'>
							<DrawerTitle>Cadastro conta de Recebimento</DrawerTitle>
						</DrawerHeader>
						<div>
							<label htmlFor='conta' className='text-blue-600 font-semibold'>
								Conta
							</label>
							<input
								id='conta'
								name='conta'
								type='text'
								className='bg-gray-50 border p-2 my-2 border-gray-300 text-gray-900 mb-6  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'></input>
						</div>
						<DrawerFooter>
							<DrawerClose className=' flex place-content-center  space-x-6'>
								<Button
									className=' w-1/6'
									type='submit'
									name='_action'
									value='conta'
									variant='default'>
									Salvar
								</Button>
								<Button name='_action' value='sairconta' variant='destructive'>
									Cancelar
								</Button>
							</DrawerClose>
						</DrawerFooter>
					</Form>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
