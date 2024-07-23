import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	UploadHandler,
} from "@remix-run/node";

import {
	json,
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { s3UploadHandler } from "./utils/s3.server";

import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { parse } from "@conform-to/zod";

import { redirect } from "@vercel/remix";

import FormTransferencia from "./components/FormTransferencia";
import {
	createConta,
	createDespesa,
	createFornecedor,
	createTransferencia,
	getContas,
	getFornecedores,
} from "./utils/despesas.server";
import { requireUserSession } from "./utils/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserSession(request);
	const fornecedores = await getFornecedores();
	const contas = await getContas();
	return json({ fornecedores, contas });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();

	let values = Object.fromEntries(formData);

	console.log(values);
	// await createFornecedor(values);

	const submission = parse(formData, {
		schema: z.object({
			origem: z.string({ required_error: "Preencha a Loja de Saida" }).min(1),
			destino: z
				.string({ required_error: "Preencha a Loja de Entrada" })
				.min(1),
			valor: z.string({ required_error: "Preencha o valor" }).min(1),
			date: z.string({ required_error: "Preencha a Data" }).min(1),
		}),
	});
	if (submission.intent !== "submit" || !submission.value) {
		return json(submission);
	}

	await createTransferencia(submission.value);

	return redirect("/transferencias");
};

export default function TransferenciaNova() {
	return (
		<>
			<h1 className=' text-center font-semibold text-blue-600 text-xl m-6'>
				Nova Transferência
			</h1>
			{/* <{FormRec(formas, receita)} /> */}
			{FormTransferencia()}
		</>
	);
}
