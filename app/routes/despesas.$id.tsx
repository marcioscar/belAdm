import type {
	LoaderFunctionArgs,
	ActionFunctionArgs,
	UploadHandler,
} from "@remix-run/node";
import {
	json,
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { z } from "zod";
import { parse } from "@conform-to/zod";

import { redirect, useLoaderData } from "@remix-run/react";
import {
	createConta,
	createFornecedor,
	getContas,
	getDespesa,
	updateDespesa,
} from "./utils/despesas.server";

import { getFornecedores } from "./utils/compras.server";
import FormDespesa from "./components/FormDespesa";
import { s3UploadHandler } from "./utils/s3.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const despesa = await getDespesa(params.id as string);
	const fornecedores = await getFornecedores();
	const contas = await getContas();

	return json({ despesa, fornecedores, contas });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const uploadHandler: UploadHandler = composeUploadHandlers(
		s3UploadHandler,
		createMemoryUploadHandler()
	);

	const formData = await parseMultipartFormData(request, uploadHandler);

	const action = formData.get("_action");

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
	const tudo = { ...submission.value, ...params };
	await updateDespesa(tudo);

	return redirect("/despesas");
};

// const formData = await request.formData();
// let values = Object.fromEntries(formData);
// const tudo = { ...values, ...params };
// await updateDespesa(tudo);
// return redirect("/despesas");
// };

export default function RouteComponent() {
	const { despesa, fornecedores, contas } = useLoaderData<typeof loader>();

	return (
		<>
			<h1 className=' text-center font-semibold text-blue-600 text-xl m-6'>
				Editar Despesas
			</h1>
			{/* <{FormRec(formas, receita)} /> */}
			{FormDespesa(fornecedores, contas, despesa)}
		</>
	);
}
