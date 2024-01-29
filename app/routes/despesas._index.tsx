import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

import { redirect, useLoaderData } from "@remix-run/react";
import { columns } from "./components/Despcolumns";
import { DataTable } from "./components/Data-table";
import { deleteDespesa, getDespesas } from "./utils/despesas.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const despesas = await getDespesas();
	return despesas;
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	let values = Object.fromEntries(formData);

	if (values._action === "delete") {
		await deleteDespesa(values);
		return redirect(`.`);
	}

	return null;
};

export default function Despesas() {
	const despesas = useLoaderData<typeof loader>();

	return (
		<>
			<div className='container mx-auto py-4'>
				<div className=' flex place-content-around  font-semibold   text-center  text-xl  text-blue-700'>
					Despesas
				</div>
				<DataTable columns={columns} data={despesas} />
			</div>
		</>
	);
}
