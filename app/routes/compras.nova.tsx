import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { parse } from "@conform-to/zod";

import { redirect } from "@vercel/remix";
import FormCompra from "./components/FormCompra";
import {
	createCompra,
	createFornecedor,
	getFornecedores,
} from "./utils/compras.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const fornecedores = await getFornecedores();
	return json({ fornecedores });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const action = formData.get("_action");
	if (action === "fornecedor") {
		let values = Object.fromEntries(formData);
		await createFornecedor(values);
		console.log(formData);
	}

	const submission = parse(formData, {
		schema: z.object({
			fornecedor: z.string({ required_error: "Preencha o fornecedor" }).min(3),
			valor: z.string({ required_error: "Preencha o valor" }).min(1),
			nf: z.number({ required_error: "Preencha o número da NF" }).min(1),
			date: z.string({ required_error: "Preencha a Data" }).min(1),
		}),
	});
	if (submission.intent !== "submit" || !submission.value) {
		return json(submission);
	}

	await createCompra(submission.value);
	return redirect("/compras");
};

export default function CompraNova() {
	const { fornecedores } = useLoaderData<typeof loader>();

	return (
		<>
			<h1 className=' text-center font-semibold text-blue-600 text-xl m-6'>
				Nova Compra
			</h1>
			{/* <{FormRec(formas, receita)} /> */}
			{FormCompra(fornecedores)}
		</>
	);
}
