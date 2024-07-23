import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getDespesas, getTransferencias } from "./utils/despesas.server";
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
	const transferencias = await getTransferencias();
	return json({ despesas, receitas, compras, estoque, transferencias });
};

export default function Index() {
	const { receitas, despesas, compras, estoque, transferencias } =
		useLoaderData<typeof loader>();

	const [numberMounth, setMumberMounth] = useState(
		format(new Date(), "MM", { locale: pt })
	);
	const [store, setStore] = useState("todas");

	const handleSelectChange = (event: any) => {
		setMumberMounth(event.target.value);
	};

	const handleStore = (event: any) => {
		setStore(event.target.value);
	};

	const ano = getYear(new Date());
	const mes = getMonth(new Date(`2024/${numberMounth}`)) + 1;

	//receitas
	const recMes = _.filter(receitas, (item) => {
		const itemDate = new Date(item.data);
		const loja = store;
		return loja === "todas"
			? getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes &&
					item.conta !== "transferencia"
			: getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes &&
					item.loja === loja.toUpperCase();
	});

	const recMesTotal = _.sumBy(recMes, "valor");

	function recLoja() {
		const tot = _.map(_.groupBy(recMes, "loja"), (loja, idx) => {
			return { loja: idx, valor: _.sumBy(loja, "valor") };
		});
		return _.orderBy(tot, ["valor"], ["desc"]);
	}

	function recCarteira() {
		const tot = _.map(_.groupBy(recMes, "carteira"), (carteira, idx) => {
			return { carteira: idx, valor: _.sumBy(carteira, "valor") };
		});

		return _.orderBy(tot, ["valor"], ["desc"]);
	}

	//fim receitas

	//despesas

	const despMes = _.filter(despesas, (item) => {
		const loja = store;
		const itemDate = new Date(item.data);
		return loja === "todas"
			? getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes &&
					item.conta !== "transferencia"
			: getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes &&
					item.loja === loja;
	});

	// const despMesBack = _.filter(despesas, (item) => {
	// 	const itemDate = new Date(item.data);
	// 	return getYear(itemDate) === ano && getMonth(itemDate) + 1 === mes;
	// });

	const despMesFixa = _.filter(despesas, (item) => {
		const loja = store;
		const itemDate = new Date(item.data);
		return loja === "todas"
			? getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes &&
					item.tipo === "fixa"
			: getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes &&
					item.tipo === "fixa" &&
					item.loja === loja;
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

	//compras lojas -> Transferencias

	const transferenciaMes = _.filter(transferencias, (item) => {
		const loja = store;
		const itemDate = new Date(item.data);
		return (
			getYear(itemDate) === ano &&
			getMonth(itemDate) + 1 === mes &&
			item.destino === loja
		);
	});

	const transferenciaMesTotal = _.sumBy(transferenciaMes, "valor");

	//fim compras

	//estoque
	const estoqueMesAtual = _.filter(estoque, (item) => {
		const itemDate = new Date(item.data);
		return (
			getYear(itemDate) === ano &&
			getMonth(itemDate) + 1 === mes &&
			item.local === "todas"
		);
	});

	//estoque Lojas
	const estoqueMesAtualLojas = _.filter(estoque, (item) => {
		const loja = store;

		const itemDate = new Date(item.data);
		return (
			getYear(itemDate) === ano &&
			getMonth(itemDate) + 1 === mes &&
			item.local === loja.toLocaleLowerCase()
		);
	});

	const estoqueMesAnteriorLojas = _.filter(estoque, (item) => {
		const itemDate = new Date(item.data);
		const loja = store;
		return (
			getYear(itemDate) === ano &&
			getMonth(itemDate) + 1 === mes - 1 &&
			item.local === loja.toLocaleLowerCase()
		);
	});

	//fim estoque lojas

	const estoqueMesAnterior = _.filter(estoque, (item) => {
		const itemDate = new Date(item.data);

		return (
			getYear(itemDate) === ano &&
			getMonth(itemDate) + 1 === mes - 1 &&
			item.local === "todas"
		);
	});

	const estoqueAtual = parseFloat(
		estoqueMesAtual.map((e) => e.valor).toString()
	);

	const estoqueAtualLoja = parseFloat(
		estoqueMesAtualLojas.map((e) => e.valor).toString()
	);

	const estoqueAnterior = parseFloat(
		estoqueMesAnterior.map((e) => e.valor).toString()
	);

	const estoqueAnteriorLoja = parseFloat(
		estoqueMesAnteriorLojas.map((e) => e.valor).toString()
	);

	const CMV = estoqueAnterior + compraMesTotal - estoqueAtual;
	const CMVLojas =
		estoqueAnteriorLoja + transferenciaMesTotal - estoqueAtualLoja;

	//fim estoque

	return (
		<>
			<img
				alt='logo'
				src='/images/adm.svg'
				className=' w-3/4 md:w-1/4 mt-3 container text-center'
			/>
			<div className='flex mt-10 justify-center  mb-4 items-center'>
				<label
					className=' hidden md:block mr-4 font-light   text-sm '
					htmlFor='rec'>
					MÊS E ANO DE REFERÊNCIA
				</label>

				<IoMdArrowDropright className='hidden md:block' />
				<select
					className=' rounded text-zinc-600 h-8  pl-5 pr-10 hover:border-gray-400 focus:outline-none '
					name='rec'
					defaultValue={format(new Date(), "MMM-yyyy", { locale: pt })}
					value={numberMounth}
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

				<label
					className=' hidden md:block mr-4 font-light ml-9  text-sm '
					htmlFor='loja'>
					LOJA
				</label>
				<IoMdArrowDropright className='hidden md:block' />
				<select
					className=' rounded text-zinc-600 h-8  pl-5 pr-10 hover:border-gray-400 focus:outline-none '
					name='loja'
					defaultValue={store}
					value={store}
					onChange={handleStore}>
					{/* // onChange={(event) => rec.submit(event.target.form)}> */}
					<option hidden={true} value=''>
						Selecione a Loja
					</option>
					<option value='todas'>Todas</option>
					<option value='Qi'>QI</option>
					<option value='Qne'>QNE</option>
					<option value='Nrt'>NRT</option>
					<option value='Sds'>SDS</option>
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
				<Card className=''>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className=' text-xl  font-medium'>Compras</CardTitle>
						<Badge
							variant='outline'
							className='font-normal  text-sm  font-mono'>
							{store === "todas"
								? compraMesTotal.toLocaleString("pt-BR", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
								  })
								: transferenciaMesTotal.toLocaleString("pt-BR", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
								  })}
						</Badge>
					</CardHeader>
					<CardContent className='grid grid-cols-4 place-items-center space-x-2  mt-4  '>
						<div className=' grid  place-items-center text-sm'>
							{store === "todas"
								? estoqueAnterior.toLocaleString("pt-BR", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
								  })
								: estoqueAnteriorLoja.toLocaleString("pt-BR", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
								  })}
							<Badge
								variant='secondary'
								className=' w-full place-content-center text-center  mt-1 font-light text-green-600  text-xs '>
								Est. Anterior
							</Badge>
						</div>
						<div className=' grid  place-items-center text-sm'>
							{store === "todas"
								? estoqueAtual.toLocaleString("pt-BR", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
								  })
								: estoqueAtualLoja.toLocaleString("pt-BR", {
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
							{store === "todas"
								? CMV.toLocaleString("pt-BR", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
								  })
								: CMVLojas.toLocaleString("pt-BR", {
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
				<Card className='xl:col-span-3 shadow border border-white/50 bg-white/80'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className=' text-xl  font-medium'>Carteiras</CardTitle>
						{/* <Badge
							variant='outline'
							className='font-normal  text-sm  font-mono'>
							{recMesTotal.toLocaleString("pt-BR", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Badge> */}
					</CardHeader>
					<CardContent className='grid grid-cols-4 xl:grid-cols-7 place-items-center  mt-4  '>
						{recCarteira().map((l) => (
							<div
								key={l.carteira}
								className=' grid  place-items-center text-sm'>
								{l.valor.toLocaleString("pt-BR", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
								<Badge
									variant='outline'
									className=' w-full  shadow-sm  place-content-center text-center  mt-1 font-light text-purple-600  text-xs '>
									{l.carteira}
								</Badge>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
			<div className='container p-1 mx-auto'>
				{Fluxomes(receitas, numberMounth, despesas, CMV, store, CMVLojas)}
			</div>
		</>
	);
}
