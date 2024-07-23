import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

import { redirect, useLoaderData } from "@remix-run/react";
import { columns } from "./components/Transfcolumns";
import { DataTable } from "./components/Data-table";
import { deleteDespesa, getTransferencias } from "./utils/despesas.server";
import { requireUserSession } from "./utils/auth.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserSession(request);
	const transferencias = await getTransferencias();
	return transferencias;
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

export default function Transferencias() {
	const despesas = useLoaderData<typeof loader>();

	return (
		<>
			<div className='container mx-auto py-4'>
				<div className=' flex place-content-around  font-semibold   text-center  text-xl  text-blue-700'>
					Transferencias
				</div>
				<DataTable columns={columns} data={despesas} />
			</div>
		</>
	);
}
