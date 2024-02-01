import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { parse } from "@conform-to/zod";

import { createForm, createReceita, getFormas } from "./utils/receitas.server";
import FormRec from "./components/FormRec";
import { redirect } from "@vercel/remix";
import { requireUserSession } from "./utils/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserSession(request);
	const formas = await getFormas();
	return json({ formas });
};

// export const action = async ({ request }: ActionFunctionArgs) => {
// 	const formData = Object.fromEntries(await request.formData());
// 	if (formData._action === "sairconta") {
// 		return redirect(".");
// 	}

// 	const schema = z.object({
// 		conta: z.string().min(1, { message: "Preencha a forma de pagamento" }),
// 		valor: z.string().min(1, { message: "Preencha o valor" }),
// 		descricao: z.string().min(1, { message: "Preencha a descrição" }),
// 		loja: z.string().min(1, { message: "Preencha a Loja" }),
// 		// date: z.string().min(1, { message: "Preencha a data" }),
// 		date: z.any(),
// 		status: z.string().min(1, { message: "Preencha o status" }),
// 	});

// 	const parsed = schema.safeParse(formData);
// 	if (!parsed.success) {
// 		console.log(parsed.error);
// 		return json({ error: parsed.error.format() });
// 	}
// 	const data = parsed.data;
// 	await createReceita(data);
// 	return redirect("/receitas");
// };
export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const action = formData.get("_action");
	if (action === "forma") {
		let values = Object.fromEntries(formData);
		await createForm(values);
		console.log(formData);
	}

	const submission = parse(formData, {
		schema: z.object({
			conta: z
				.string({ required_error: "Preencha a forma de pagamento" })
				.min(1),
			valor: z.string({ required_error: "Preencha o valor" }).min(1),
			descricao: z.string({ required_error: "Preencha a descrição" }).min(1),
			loja: z.string({ required_error: "Preencha a loja" }).min(1),
			date: z.string({ required_error: "Preencha a Data" }).min(1),
			status: z.string({ required_error: "Preencha o Status" }).min(1),
		}),
	});
	if (submission.intent !== "submit" || !submission.value) {
		return json(submission);
	}

	await createReceita(submission.value);
	return redirect("/receitas");
};

export default function ReceitaNova() {
	const { formas } = useLoaderData<typeof loader>();

	return (
		<>
			<h1 className=' text-center font-semibold text-blue-600 text-xl m-6'>
				Nova Receita
			</h1>
			{/* <{FormRec(formas, receita)} /> */}
			{FormRec(formas)}
		</>
	);
}
