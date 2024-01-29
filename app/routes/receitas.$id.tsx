import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { getFormas, getReceita, updateReceita } from "./utils/receitas.server";
import FormRec from "./components/FormRec";
import { getFornecedores } from "./utils/compras.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const receita = await getReceita(params.id as string);
	const formas = await getFormas();

	return json({ receita, formas });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const formData = await request.formData();
	let values = Object.fromEntries(formData);
	const tudo = { ...values, ...params };
	await updateReceita(tudo);
	return redirect("/receitas");
};

export default function RouteComponent() {
	const { receita, formas } = useLoaderData<typeof loader>();

	return (
		<>
			<h1 className=' text-center font-semibold text-blue-600 text-xl m-6'>
				Editar Receita
			</h1>
			{/* <{FormRec(formas, receita)} /> */}
			{FormRec(formas, receita)}
		</>
	);
}
