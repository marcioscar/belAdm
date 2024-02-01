import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
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
	value: any,
	despesas: any,
	CMV: any
) {
	const ano = getYear(new Date());
	const mes = getMonth(new Date(`2024/${value}`)) + 1;

	//receitas
	const recMes = _.filter(receitas, (item) => {
		const itemDate = new Date(item.data);
		return getYear(itemDate) === ano && getMonth(itemDate) + 1 === mes;
	});
	function recTipoMes() {
		const tot = _.map(_.groupBy(recMes, "conta"), (conta, idx) => {
			return { conta: idx, valor: _.sumBy(conta, "valor") };
		});
		return _.orderBy(tot, ["valor"], ["desc"]);
	}
	const recMesTotal = _.sumBy(recMes, "valor");
	//fim receitas

	//despesas
	const despMes = _.filter(despesas, (item) => {
		const itemDate = new Date(item.data);
		return getYear(itemDate) === ano && getMonth(itemDate) + 1 === mes;
	});

	const despMesVariavel = _.filter(despesas, (item) => {
		const itemDate = new Date(item.data);
		return (
			getYear(itemDate) === ano &&
			getMonth(itemDate) + 1 === mes &&
			item.tipo === "variavel"
		);
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

	const despMesFixa = _.filter(despMes, (item) => {
		const itemDate = new Date(item.data);
		return (
			getYear(itemDate) === ano &&
			getMonth(itemDate) + 1 === mes &&
			item.tipo === "fixa"
		);
	});

	const despMesFixaTotal = _.sumBy(despMesFixa, "valor");

	function despTipoMes() {
		const tot = _.map(_.groupBy(despMesFixa, "conta"), (conta, idx) => {
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
	const lucroOperacional = margemContribuicao - despMesFixaTotal;
	const lucroOperacionalCMV = recMesTotal - (CMV + despMesFixaTotal);
	const pontoEquilibrio =
		despMesFixaTotal / 1 - despMesVariavelTotal / recMesTotal;

	//fim resultados

	return (
		<Table className='border mt-2 border-stone-100  '>
			<TableHeader className='bg-zinc-400'>
				<TableRow>
					<TableHead className=' text-white font-medium text-center'>
						Descrição
					</TableHead>
					<TableHead className='text-white font-medium text-right'>
						Valor
					</TableHead>
					<TableHead className='text-white font-medium text-center'>
						AV
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
				</TableRow>
				<TableRow className='bg-stone-100'>
					<TableCell className='font-medium'>Receita | Faturamento</TableCell>
					<TableCell className='font-medium text-right font-mono'>
						{recMesTotal.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</TableCell>
					<TableCell></TableCell>
				</TableRow>
				<TableRow className='bg-stone-100'>
					<TableCell className='font-medium'>Receitas </TableCell>
				</TableRow>
				{recTipoMes()?.map((rec: any, index: number) => (
					<TableRow key={index}>
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
					</TableRow>
				))}
				<TableRow className='bg-stone-100'>
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
				</TableRow>
				{despTipoMesVariavel().map((f: any, index) => (
					<TableRow key={index}>
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
					</TableRow>
				))}
				<TableRow className='bg-stone-100'>
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
				</TableRow>
				<TableRow className='bg-stone-100'>
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
				</TableRow>
				{despTipoMes().map((f: any, index) => (
					<TableRow key={index}>
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
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
