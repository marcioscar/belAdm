import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { baixarReceita } from "./utils/receitas.server";
import { redirect, useLoaderData } from "@remix-run/react";
import { columns } from "./components/Compcolumns";
import { DataTable } from "./components/Data-table";
import { deleteCompra, getCompras } from "./utils/compras.server";
import { requireUserSession } from "./utils/auth.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserSession(request);
	const compras = await getCompras();
	return compras;
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	let values = Object.fromEntries(formData);

	if (values._action === "delete") {
		await deleteCompra(values);
		return redirect(`.`);
	}
	await baixarReceita(formData.get("id"));
	return null;
};

export default function Compras() {
	const compras = useLoaderData<typeof loader>();

	return (
		<>
			<div className='container mx-auto py-4'>
				<div className=' flex place-content-around  font-semibold   text-center  text-xl  text-blue-700'>
					Compras
					{/* <div>
						<Drawer>
							<DrawerTrigger>
								<Button
									className=' text-zinc-700 font-normal'
									variant='outline'>
									Nova Conta
								</Button>
							</DrawerTrigger>
							<DrawerContent className='h-3/4'>
								<DrawerHeader>
									<DrawerTitle>Are you absolutely sure?</DrawerTitle>
									<DrawerDescription>
										This action cannot be undone.
									</DrawerDescription>
								</DrawerHeader>
								<DrawerFooter>
									<Button>Submit</Button>
									<DrawerClose>
										<Button variant='outline'>Cancel</Button>
									</DrawerClose>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					</div> */}
				</div>
				<DataTable columns={columns} data={compras} />
			</div>
		</>
	);
}
