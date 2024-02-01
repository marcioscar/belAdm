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

import FormDespesa from "./components/FormDespesa";
import {
	createConta,
	createDespesa,
	createFornecedor,
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
	const uploadHandler: UploadHandler = composeUploadHandlers(
		s3UploadHandler,
		createMemoryUploadHandler()
	);

	const formData = await parseMultipartFormData(request, uploadHandler);

	const action = formData.get("_action");
	console.log(action);
	if (action === "fornecedor") {
		let values = Object.fromEntries(formData);
		await createFornecedor(values);
	}
	if (action === "conta") {
		let values = Object.fromEntries(formData);
		await createConta(values);
	}

	const submission = parse(formData, {
		schema: z.object({
			fornecedor: z.string({ required_error: "Preencha o fornecedor" }).min(3),
			valor: z.string({ required_error: "Preencha o valor" }).min(1),

			date: z.string({ required_error: "Preencha a Data" }).min(1),
			descricao: z.string({ required_error: "Preencha a Descricao" }).min(1),
			tipo: z.string({ required_error: "Preencha a Tipo" }).min(1),
			conta: z.string({ required_error: "Preencha a Conta" }).min(1),
			img: z.string().optional(),
			_action: z.string().optional(),
		}),
	});
	if (submission.intent !== "submit" || !submission.value) {
		return json(submission);
	}

	await createDespesa(submission.value);

	return redirect("/despesas");
};

export default function CompraNova() {
	const { fornecedores, contas } = useLoaderData<typeof loader>();

	return (
		<>
			<h1 className=' text-center font-semibold text-blue-600 text-xl m-6'>
				Nova Despesa
			</h1>
			{/* <{FormRec(formas, receita)} /> */}
			{FormDespesa(fornecedores, contas)}
		</>
	);
}
