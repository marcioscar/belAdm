import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";

import {
	getCompra,
	getFornecedores,
	updateCompra,
} from "./utils/compras.server";
import FormCompra from "./components/FormCompra";
import { requireUserSession } from "./utils/auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	await requireUserSession(request);
	const compra = await getCompra(params.id as string);
	const fornecedores = await getFornecedores();
	return json({ fornecedores, compra });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const formData = await request.formData();
	let values = Object.fromEntries(formData);
	const tudo = { ...values, ...params };
	await updateCompra(tudo);
	return redirect("/compras");
};

export default function RouteComponent() {
	const { fornecedores, compra } = useLoaderData<typeof loader>();
	console.log(compra);
	return (
		<>
			<h1 className=' text-center font-semibold text-blue-600 text-xl m-6'>
				Editar Compra
			</h1>
			{/* <{FormRec(formas, receita)} /> */}
			{FormCompra(fornecedores, compra)}
		</>
	);
}
