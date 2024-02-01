import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from "@remix-run/node";
import { getDespesas } from "./utils/despesas.server";
import { getReceitas } from "./utils/receitas.server";
import { useLoaderData } from "@remix-run/react";

import { format } from "date-fns/format";
import { pt } from "date-fns/locale";
import { IoMdArrowDropright } from "react-icons/io";
import _ from "lodash";
import { useState } from "react";
import { getMonth, getYear } from "date-fns";
import { getCompras, getEstoque } from "./utils/compras.server";
import Fluxomes from "./components/Fluxomes";
import { requireUserSession } from "./utils/auth.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserSession(request);
	const receitas = await getReceitas();
	const despesas = await getDespesas();
	const compras = await getCompras();
	const estoque = await getEstoque();
	return json({ despesas, receitas, compras, estoque });
};
export const action = async ({ request }: ActionFunctionArgs) => {
	return null;
};

export default function Index() {
	const { receitas, despesas, compras, estoque } =
		useLoaderData<typeof loader>();

	const [value, setValue] = useState(format(new Date(), "MM", { locale: pt }));
	const handleSelectChange = (event: any) => {
		setValue(event.target.value);
	};

	const ano = getYear(new Date());
	const mes = getMonth(new Date(`2024/${value}`)) + 1;

	//receitas
	const recMes = _.filter(receitas, (item) => {
		const itemDate = new Date(item.data);
		return getYear(itemDate) === ano && getMonth(itemDate) + 1 === mes;
	});
	const recMesTotal = _.sumBy(recMes, "valor");

	function recLoja() {
		const tot = _.map(_.groupBy(recMes, "loja"), (loja, idx) => {
			return { loja: idx, valor: _.sumBy(loja, "valor") };
		});

		return _.orderBy(tot, ["valor"], ["desc"]);
	}

	//fim receitas

	//despesas
	const despMes = _.filter(despesas, (item) => {
		const itemDate = new Date(item.data);
		return getYear(itemDate) === ano && getMonth(itemDate) + 1 === mes;
	});

	const despMesFixa = _.filter(despesas, (item) => {
		const itemDate = new Date(item.data);
		return (
			getYear(itemDate) === ano &&
			getMonth(itemDate) + 1 === mes &&
			item.tipo === "fixa"
		);
	});
	const despMesTotal = _.sumBy(despMes, "valor");
	const despMesFixaTotal = _.sumBy(despMesFixa, "valor");

	function despConta() {
		const tot = _.map(_.groupBy(despMes, "conta"), (conta, idx) => {
			return { conta: idx, valor: _.sumBy(conta, "valor") };
		});

		return _.orderBy(tot, ["valor"], ["desc"]).slice(0, 4);
	}

	//fim despesas

	//compras
	const ComprasMes = _.filter(compras, (item) => {
		const itemDate = new Date(item.data);
		return getYear(itemDate) === ano && getMonth(itemDate) + 1 === mes;
	});
	const compraMesTotal = _.sumBy(ComprasMes, "valor");

	//fim compras

	//estoque
	const estoqueMesAtual = _.filter(estoque, (item) => {
		const itemDate = new Date(item.data);
		return getYear(itemDate) === ano && getMonth(itemDate) + 1 === mes;
	});

	const estoqueMesAnterior = _.filter(estoque, (item) => {
		const itemDate = new Date(item.data);

		return getYear(itemDate) === ano && getMonth(itemDate) + 1 === mes - 1;
	});

	const estoqueAtual = parseFloat(
		estoqueMesAtual.map((e) => e.valor).toString()
	);
	const estoqueAnterior = parseFloat(
		estoqueMesAnterior.map((e) => e.valor).toString()
	);

	const CMV = estoqueAnterior + compraMesTotal - estoqueAtual;
	//fim estoque

	return (
		<>
			<img
				alt='logo'
				src='/images/adm.svg'
				className='w-1/4 mt-3 container text-center'
			/>
			<div className='flex mt-10 justify-center  mb-4 items-center'>
				<label className='mr-4 font-light   text-sm ' htmlFor='rec'>
					MÊS E ANO DE REFERÊNCIA
				</label>

				<IoMdArrowDropright />
				<select
					className='rounded text-zinc-600 h-8  pl-5 pr-10 hover:border-gray-400 focus:outline-none '
					name='rec'
					defaultValue={format(new Date(), "MMM-yyyy", { locale: pt })}
					value={value}
					onChange={handleSelectChange}>
					{/* // onChange={(event) => rec.submit(event.target.form)}> */}
					<option hidden={true} value=''>
						Selecione mês e ano referencia
					</option>
					<option value='01'>Janeiro - 2024</option>
					<option value='02'>Fevereiro - 2024</option>
					<option value='03'>Março - 2024</option>
					<option value='04'>Abril - 2024</option>
					<option value='05'>Maio - 2024</option>
					<option value='06'>Junho - 2024</option>
					<option value='07'>Julho - 2024</option>
					<option value='08'>Agosto - 2024</option>
					<option value='09'>Setembro - 2024</option>
					<option value='10'>Outubro - 2024</option>
					<option value='11'>Novembro - 2024</option>
					<option value='12'>Dezembro - 2024</option>
				</select>
			</div>

			<div className='grid gap-4 mt-2 container px-2 mx-auto  md:grid-cols-2 xl:grid-cols-3 '>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className=' text-xl font-medium'>Receitas</CardTitle>
						<Badge
							variant='outline'
							className=' font-normal  text-sm  font-mono'>
							{recMesTotal.toLocaleString("pt-BR", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Badge>
					</CardHeader>
					<CardContent className='grid grid-cols-4 place-items-center  mt-4  '>
						{recLoja().map((l) => (
							<div key={l.loja} className=' grid  place-items-center text-sm'>
								{l.valor.toLocaleString("pt-BR", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
								<Badge
									variant='secondary'
									className=' w-full   place-content-center text-center  mt-1 font-light text-blue-800  text-xs '>
									{l.loja}
								</Badge>
							</div>
						))}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className=' text-xl  font-medium'>Despesas</CardTitle>
						<Badge
							variant='outline'
							className='font-normal  text-sm  font-mono'>
							{despMesTotal.toLocaleString("pt-BR", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Badge>
					</CardHeader>
					<CardContent className='grid grid-cols-4 place-items-center  mt-4  '>
						{despConta().map((l) => (
							<div key={l.conta} className=' grid  place-items-center text-sm'>
								{l.valor.toLocaleString("pt-BR", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
								<Badge
									variant='secondary'
									className=' w-full   place-content-center text-center  mt-1 font-light text-red-500  text-xs '>
									{l.conta}
								</Badge>
							</div>
						))}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className=' text-xl  font-medium'>Compras</CardTitle>
						<Badge
							variant='outline'
							className='font-normal  text-sm  font-mono'>
							{compraMesTotal.toLocaleString("pt-BR", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Badge>
					</CardHeader>
					<CardContent className='grid grid-cols-4 place-items-center space-x-2  mt-4  '>
						<div className=' grid  place-items-center text-sm'>
							{estoqueAnterior.toLocaleString("pt-BR", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
							<Badge
								variant='secondary'
								className=' w-full   place-content-center text-center  mt-1 font-light text-green-600  text-xs '>
								Est. Anterior
							</Badge>
						</div>
						<div className=' grid  place-items-center text-sm'>
							{estoqueAtual.toLocaleString("pt-BR", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
							<Badge
								variant='secondary'
								className=' w-full   place-content-center text-center  mt-1 font-light text-green-600  text-xs '>
								Est. Atual
							</Badge>
						</div>
						<div className=' grid  place-items-center text-sm'>
							{CMV.toLocaleString("pt-BR", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
							<Badge
								variant='secondary'
								className=' w-full   place-content-center text-center  mt-1 font-light text-green-600  text-xs '>
								CMV
							</Badge>
						</div>
						<div className=' grid  place-items-center text-sm'>
							{despMesFixaTotal.toLocaleString("pt-BR", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
							<Badge
								variant='secondary'
								className=' w-full   place-content-center text-center  mt-1 font-light text-green-600  text-xs '>
								Fixas Total
							</Badge>
						</div>
					</CardContent>
				</Card>
			</div>
			<div className='container p-1 mx-auto'>
				{Fluxomes(receitas, value, despesas, CMV)}
			</div>
		</>
	);
}
