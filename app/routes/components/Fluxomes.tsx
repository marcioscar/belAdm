import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getMonth, getYear } from "date-fns";
import { format } from "date-fns/format";
import { ptBR } from "date-fns/locale/pt-BR";
import _ from "lodash";

export default function Fluxomes(
	receitas: any,
	numberMouth: any,
	despesas: any,
	CMV: any,
	store: string,
	CMVLojas: any
) {
	const ano = getYear(new Date());
	const mes = getMonth(new Date(`2024/${numberMouth}`)) + 1;

	//receitas

	const recMes = _.filter(receitas, (item) => {
		const loja = store;
		const itemDate = new Date(item.data);
		return loja === "todas"
			? getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes &&
					item.conta !== "transferencia"
			: getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes &&
					item.loja === loja.toUpperCase();
	});

	const recMesAnterior = _.filter(receitas, (item) => {
		const loja = store;
		const itemDate = new Date(item.data);
		return loja === "todas"
			? getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes - 1 &&
					item.conta !== "transferencia"
			: getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes - 1 &&
					item.loja === loja.toUpperCase();
	});

	function recTipoMes() {
		const tot = _.map(_.groupBy(recMes, "conta"), (conta, idx) => {
			return { conta: idx, valor: _.sumBy(conta, "valor") };
		});
		return _.orderBy(tot, ["valor"], ["desc"]);
	}
	function recTipoMesAnterior() {
		const tot = _.map(_.groupBy(recMesAnterior, "conta"), (conta, idx) => {
			return { conta: idx, valor: _.sumBy(conta, "valor") };
		});
		return _.orderBy(tot, ["valor"], ["desc"]);
	}
	const recMesTotal = _.sumBy(recMes, "valor");
	const recMesTotalAnterior = _.sumBy(recMesAnterior, "valor");

	console.log(
		_.filter(recTipoMesAnterior(), { conta: "pix" }).map((m) => m.valor)
	);

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

	// const despMes = _.filter(despesas, (item) => {
	// 	const itemDate = new Date(item.data);
	// 	return getYear(itemDate) === ano && getMonth(itemDate) + 1 === mes;
	// });

	const despMesVariavel = _.filter(despesas, (item) => {
		const loja = store;
		const itemDate = new Date(item.data);
		return loja === "todas"
			? getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes &&
					item.tipo === "variavel" &&
					item.conta !== "transferencia"
			: getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes &&
					item.tipo === "variavel" &&
					item.loja === loja;
	});

	const despMesVariavelAnterior = _.filter(despesas, (item) => {
		const loja = store;
		const itemDate = new Date(item.data);
		return loja === "todas"
			? getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes - 1 &&
					item.tipo === "variavel" &&
					item.conta !== "transferencia"
			: getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes - 1 &&
					item.tipo === "variavel" &&
					item.loja === loja;
	});
	function grupodespesasVariavel(fornecedor: any) {
		const desp = _.groupBy(
			despMesVariavel.filter((o: { tipo: string; fornecedor: string }) =>
				o.fornecedor.includes(fornecedor)
			),
			"conta"
		);

		return _.flatten(_.values(desp));
	}

	const despMesVariavelTotal = _.sumBy(despMesVariavel, "valor");
	const despMesVariavelTotalAnterior = _.sumBy(
		despMesVariavelAnterior,
		"valor"
	);

	// const despMesFixa = _.filter(despMes, (item) => {
	// 	const itemDate = new Date(item.data);
	// 	return (
	// 		getYear(itemDate) === ano &&
	// 		getMonth(itemDate) + 1 === mes &&
	// 		item.tipo === "fixa"
	// 	);
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
	const despMesFixaAnterior = _.filter(despesas, (item) => {
		const loja = store;
		const itemDate = new Date(item.data);

		return loja === "todas"
			? getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes - 1 &&
					item.tipo === "fixa"
			: getYear(itemDate) === ano &&
					getMonth(itemDate) + 1 === mes - 1 &&
					item.tipo === "fixa" &&
					item.loja === loja;
	});

	const despMesFixaTotal = _.sumBy(despMesFixa, "valor");
	const despMesFixaTotalAnterior = _.sumBy(despMesFixaAnterior, "valor");

	function despTipoMes() {
		const tot = _.map(_.groupBy(despMesFixa, "conta"), (conta, idx) => {
			return { conta: idx, valor: _.sumBy(conta, "valor") };
		});
		return _.orderBy(tot, ["valor"], ["desc"]);
	}
	function despTipoMesAnterior() {
		const tot = _.map(_.groupBy(despMesFixaAnterior, "conta"), (conta, idx) => {
			return { conta: idx, valor: _.sumBy(conta, "valor") };
		});
		return _.orderBy(tot, ["valor"], ["desc"]);
	}

	function despTipoMesVariavel() {
		const tot = _.map(
			_.groupBy(despMesVariavel, "fornecedor"),
			(fornecedor, idx) => {
				return { conta: idx, valor: _.sumBy(fornecedor, "valor") };
			}
		);
		return _.orderBy(tot, ["valor"], ["desc"]);
	}

	function despTipoMesVariavelAnterior() {
		const tot = _.map(
			_.groupBy(despMesVariavelAnterior, "fornecedor"),
			(fornecedor, idx) => {
				return { conta: idx, valor: _.sumBy(fornecedor, "valor") };
			}
		);
		return _.orderBy(tot, ["valor"], ["desc"]);
	}

	function grupodespesas(conta: any) {
		const desp = _.groupBy(
			despMesFixa.filter((o: { tipo: string; conta: string }) =>
				o.conta.includes(conta)
			),
			"conta"
		);

		return _.flatten(_.values(desp));
	}

	//fim despesas

	//resultados
	const margemContribuicao = recMesTotal - despMesVariavelTotal;
	const margemContribuicaoAnterior =
		recMesTotalAnterior - despMesVariavelTotalAnterior;

	const lucroOperacional = margemContribuicao - despMesFixaTotal;
	const lucroOperacionalCMV =
		recMesTotal - (store === "todas" ? CMV : CMVLojas + despMesFixaTotal);
	const pontoEquilibrio =
		despMesFixaTotal / (1 - despMesVariavelTotal / recMesTotal);

	//fim resultados

	return (
		<Table className='border mt-2 border-stone-100   '>
			<TableHeader className='bg-zinc-400'>
				<TableRow>
					<TableHead className=' text-white font-medium text-center'>
						Descrição
					</TableHead>
					<TableHead className='text-white font-medium text-right'>
						Valor
					</TableHead>
					<TableHead className='text-white font-medium text-center'>
						% receita
					</TableHead>
					<TableHead className='text-white font-medium '>
						% mês anterior
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow className='bg-zinc-300 text-blue-600'>
					<TableCell className='font-medium '>Lucro Operacional CMV</TableCell>
					<TableCell className='font-mono text-right'>
						{lucroOperacionalCMV.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</TableCell>
					<TableCell className='font-mono text-center'>
						{new Intl.NumberFormat("de-DE", {
							style: "percent",
						}).format(lucroOperacionalCMV / recMesTotal)}
					</TableCell>
				</TableRow>
				<TableRow className='bg-zinc-200 text-green-600'>
					<TableCell className='font-medium'>Lucro Operacional</TableCell>
					<TableCell className='font-mono text-right'>
						{lucroOperacional.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</TableCell>
					<TableCell className='font-mono text-center'>
						{new Intl.NumberFormat("de-DE", {
							style: "percent",
						}).format(lucroOperacional / recMesTotal)}
					</TableCell>
					<TableCell></TableCell>
				</TableRow>
				<TableRow className=' bg-zinc-100 text-violet-700'>
					<TableCell className='font-medium'>Ponto de Equilíbrio</TableCell>
					<TableCell className='font-mono text-right'>
						{pontoEquilibrio.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</TableCell>
					<TableCell></TableCell>
					<TableCell></TableCell>
				</TableRow>
				<TableRow className='bg-stone-50'>
					<TableCell className='font-medium'>Receita | Faturamento</TableCell>
					<TableCell className='font-medium text-right font-mono'>
						{recMesTotal.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</TableCell>
					<TableCell></TableCell>
					<Badge
						className={
							recMesTotal / recMesTotalAnterior - 1 < 0
								? "font-medium text-center bg-red-600 font-mono"
								: "font-medium text-center bg-green-700 font-mono"
						}>
						<TableCell>
							{new Intl.NumberFormat("de-DE", {
								style: "percent",
							}).format(recMesTotal / recMesTotalAnterior - 1)}
						</TableCell>
					</Badge>
				</TableRow>
				<TableRow className='bg-stone-50'>
					<TableCell className='font-medium'>Receitas </TableCell>
					<TableCell></TableCell>
					<TableCell></TableCell>
					<TableCell></TableCell>
				</TableRow>
				{recTipoMes()?.map((rec: any, index: number) => (
					<TableRow className='bg-stone-50' key={index}>
						<TableCell className=' font-thin text-sm pl-6'>
							{rec.conta}
						</TableCell>
						<TableCell className='font-medium text-right font-mono'>
							{rec.valor.toLocaleString("pt-br", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</TableCell>
						<TableCell className='font-medium text-center font-mono'>
							{new Intl.NumberFormat("de-DE", {
								style: "percent",
							}).format(rec.valor / recMesTotal)}
						</TableCell>
						<Badge
							className={
								rec.valor /
									Number(
										_.filter(recTipoMesAnterior(), { conta: rec.conta }).map(
											(m) => m.valor
										)
									) -
									1 <
								0
									? "font-medium bg-red-600 text-center font-mono"
									: "font-medium bg-green-700 text-center font-mono"
							}>
							<TableCell>
								{new Intl.NumberFormat("de-DE", {
									style: "percent",
								}).format(
									rec.valor /
										Number(
											_.filter(recTipoMesAnterior(), { conta: rec.conta }).map(
												(m) => m.valor
											)
										) -
										1
								)}
							</TableCell>
						</Badge>
					</TableRow>
				))}
				<TableRow className='bg-stone-50'>
					<TableCell className='font-medium'>Custos Variáveis</TableCell>
					<TableCell className='font-medium font-mono  text-right'>
						{despMesVariavelTotal.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</TableCell>
					<TableCell className='font-mono text-center'>
						{new Intl.NumberFormat("de-DE", {
							style: "percent",
						}).format(despMesVariavelTotal / recMesTotal)}
					</TableCell>
					<Badge
						className={
							despMesVariavelTotal / despMesVariavelTotalAnterior - 1 < 0
								? "font-mono bg-green-700 text-center"
								: " bg-red-600 font-mono text-center"
						}>
						<TableCell>
							{new Intl.NumberFormat("de-DE", {
								style: "percent",
							}).format(
								despMesVariavelTotal / despMesVariavelTotalAnterior - 1
							)}
						</TableCell>
					</Badge>
				</TableRow>
				{despTipoMesVariavel().map((f: any, index) => (
					<TableRow className='bg-stone-50' key={index}>
						<TableCell className='font-thin text-sm pl-6'>
							<Accordion className='p-0' type='single' collapsible>
								<AccordionItem value='desp'>
									{grupodespesasVariavel(f.conta).length >= 1 &&
									grupodespesasVariavel(f.conta)
										.map((g) => g.descricao)
										.toString() !== "" ? (
										<AccordionTrigger className='font-light  '>
											{f.conta}
										</AccordionTrigger>
									) : (
										f.conta
									)}

									{grupodespesasVariavel(f.conta).map((g) => (
										<AccordionContent key={f.conta}>
											{grupodespesasVariavel(f.conta).length >= 1 &&
												g.descricao !== null && (
													<div className=' grid grid-cols-2'>
														<div>
															{format(g.data, "dd  MMM  yyyy", {
																locale: ptBR,
															})}
														</div>
														<div className='  text-end'>
															{g.valor.toLocaleString("pt-br", {
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															})}
														</div>
													</div>
												)}
										</AccordionContent>
									))}
								</AccordionItem>
							</Accordion>
							{/* {f.conta} */}
						</TableCell>
						<TableCell className='font-mono text-right'>
							{f.valor.toLocaleString("pt-br", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</TableCell>
						<TableCell className='font-mono text-center'>
							{new Intl.NumberFormat("de-DE", {
								style: "percent",
							}).format(f.valor / despMesVariavelTotal)}
						</TableCell>
						<Badge
							className={
								f.valor /
									Number(
										_.filter(despTipoMesVariavelAnterior(), {
											conta: f.conta,
										}).map((m) => m.valor)
									) -
									1 <
								0
									? "font-medium mt-1   bg-green-700 font-mono"
									: "font-medium  mt-1 bg-red-600 font-mono"
							}>
							<TableCell>
								{new Intl.NumberFormat("de-DE", {
									style: "percent",
								}).format(
									f.valor /
										Number(
											_.filter(despTipoMesVariavelAnterior(), {
												conta: f.conta,
											}).map((m) => m.valor)
										) -
										1
								)}
							</TableCell>
						</Badge>
					</TableRow>
				))}
				<TableRow className='bg-stone-50'>
					<TableCell className='font-medium'>Margem de Contribuição</TableCell>
					<TableCell className='font-mono text-right'>
						{margemContribuicao.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</TableCell>
					<TableCell className='font-mono text-center'>
						{new Intl.NumberFormat("de-DE", {
							style: "percent",
						}).format(margemContribuicao / recMesTotal)}
					</TableCell>
					<Badge>
						<TableCell className='font-mono text-center'>
							{new Intl.NumberFormat("de-DE", {
								style: "percent",
							}).format(margemContribuicao / margemContribuicaoAnterior - 1)}
						</TableCell>
					</Badge>
				</TableRow>
				<TableRow className='bg-stone-50'>
					<TableCell className='font-medium'>Despesas Fixas</TableCell>
					<TableCell className='font-mono text-right'>
						{despMesFixaTotal.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</TableCell>
					<TableCell className='font-mono text-center'>
						{new Intl.NumberFormat("de-DE", {
							style: "percent",
						}).format(despMesFixaTotal / recMesTotal)}
					</TableCell>
					<Badge
						className={
							despMesFixaTotal / despMesFixaTotalAnterior - 1 < 0
								? "font-mono m-0.5  bg-green-700 "
								: "font-mono  m-0.5 bg-red-500 "
						}>
						<TableCell>
							{new Intl.NumberFormat("de-DE", {
								style: "percent",
							}).format(despMesFixaTotal / despMesFixaTotalAnterior - 1)}
						</TableCell>
					</Badge>
				</TableRow>
				{despTipoMes().map((f: any, index) => (
					<TableRow className='bg-stone-50' key={index}>
						<TableCell className='font-thin text-sm pl-6'>
							<Accordion className='p-0' type='single' collapsible>
								<AccordionItem value='desp'>
									{grupodespesas(f.conta).length >= 1 &&
									grupodespesas(f.conta)
										.map((g) => g.descricao)
										.toString() !== "" ? (
										<AccordionTrigger className='font-light  '>
											{f.conta}
										</AccordionTrigger>
									) : (
										f.conta
									)}

									{grupodespesas(f.conta).map((g) => (
										<AccordionContent key={f.conta}>
											{grupodespesas(f.conta).length >= 1 &&
												g.descricao !== null && (
													<div className=' grid grid-cols-2'>
														<div>{g.descricao}</div>
														<div className='  text-end'>
															{g.valor.toLocaleString("pt-br", {
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															})}
														</div>
													</div>
												)}
										</AccordionContent>
									))}
								</AccordionItem>
							</Accordion>
							{/* {f.conta} */}
						</TableCell>
						<TableCell className='font-mono text-right'>
							{f.valor.toLocaleString("pt-br", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</TableCell>
						<TableCell className='font-mono text-center'>
							{new Intl.NumberFormat("de-DE", {
								style: "percent",
							}).format(f.valor / despMesFixaTotal)}
						</TableCell>
						<Badge
							className={
								f.valor /
									Number(
										_.filter(despTipoMesAnterior(), {
											conta: f.conta,
										}).map((m) => m.valor)
									) -
									1 >
								1
									? "font-medium text-center font-mono m-0.5 bg-red-500"
									: "font-medium text-center font-mono m-0.5 bg-green-700"
							}>
							<TableCell>
								{new Intl.NumberFormat("de-DE", {
									style: "percent",
								}).format(
									f.valor /
										Number(
											_.filter(despTipoMesAnterior(), {
												conta: f.conta,
											}).map((m) => m.valor)
										) -
										1
								)}
							</TableCell>
						</Badge>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
