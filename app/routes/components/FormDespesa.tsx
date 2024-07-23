import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@conform-to/react";
import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Form, useActionData } from "@remix-run/react";

import { ChevronsUpDown, Check } from "lucide-react";
import { useState } from "react";

import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import type { action } from "../receitas.nova";
import Drawerfornecedor from "./Drawer-Fornecedor";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Drawerconta from "./Drawer-conta";

export default function FormDespesa(
	fornecedores: any,
	contas?: any,
	despesa?: any
) {
	const data = useActionData<typeof action>();
	const [form, fields] = useForm({
		lastSubmission: data,
	});

	const [open, setOpen] = useState(false);
	const [openConta, setOpenConta] = useState(false);
	const [value, setValue] = useState(despesa?.fornecedor?.toLowerCase());
	const [valueConta, setValueConta] = useState(despesa?.conta?.toLowerCase());
	const [valueL, setValueL] = useState(despesa?.loja?.toLowerCase());
	const [openL, setOpenL] = useState(false);

	const lojas = [
		{
			etiqueta: "QI",
			loja: "qi",
		},
		{
			etiqueta: "QNE",
			loja: "qne",
		},
		{
			etiqueta: "NRT",
			loja: "nrt",
		},
		{
			etiqueta: "SDS",
			loja: "sds",
		},
	];

	const [date, setDate] = useState<Date | undefined>(
		despesa?.data ? new Date(despesa?.data) : new Date()
	);

	return (
		<div className='container'>
			<Form
				className=' mx-auto  w-3/4 '
				method='post'
				encType='multipart/form-data'
				{...form.props}>
				<input
					hidden
					readOnly
					value={value?.charAt(0).toUpperCase() + value?.substring(1)}
					name='fornecedor'
					id='fornecedor'
				/>
				<input
					hidden
					readOnly
					value={valueConta?.charAt(0).toUpperCase() + valueConta?.substring(1)}
					name='conta'
					id='conta'
				/>
				<input
					hidden
					readOnly
					value={valueL?.charAt(0).toUpperCase() + valueL?.substring(1)}
					name='loja'
					id='loja'
				/>

				<input type='text' hidden readOnly value={date} name='date' id='date' />
				<FormItem>
					<div className='flex space-x-4 items-center mb-1 '>
						<Label htmlFor='fornecedor'>Fornecedor</Label>
						<Drawerfornecedor />
					</div>

					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								role='combobox'
								aria-expanded={open}
								className='w-full justify-between text-zinc-500'>
								{value
									? fornecedores.find(
											(fornecedores: any) =>
												fornecedores.nome.toLowerCase() === value
									  )?.nome
									: "Fornecedor..."}
								<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-full p-2 rounded-xl my-2'>
							<Command>
								<CommandInput placeholder='Procurar fornecedor...' />
								<CommandEmpty>Fornecedor não encontrado</CommandEmpty>
								<CommandGroup>
									{fornecedores?.map((fornecedores: any) => (
										<CommandItem
											key={fornecedores.nome}
											value={fornecedores.nome}
											onSelect={(currentValue) => {
												setValue(currentValue === value ? "" : currentValue);
												setOpen(false);
											}}>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													value === fornecedores.nome
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{fornecedores.nome}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</FormItem>
				<FormItem className='mt-2'>
					<Label htmlFor='forma'>Valor</Label>
					<Input
						type='text'
						name='valor'
						placeholder='Valor'
						defaultValue={despesa?.valor.toLocaleString("pt-BR", {
							minimumFractionDigits: 2,
						})}
					/>
					<div className=' text-sm text-red-500'>{fields.valor.errors}</div>
				</FormItem>
				{/* <FormItem className='mt-2'>
					<Label htmlFor='nf'>Nota Fiscal</Label>
					<Input
						type='text'
						name='nf'
						placeholder='Número da NF'
						defaultValue={despesa?.nf}
					/>

					<div className=' text-sm text-red-500'>{fields.nf.errors}</div>
				</FormItem> */}
				<FormItem className='mt-2'>
					<Label htmlFor='descricao'>Descricao</Label>
					<Input
						type='text'
						name='descricao'
						placeholder='Descrição'
						defaultValue={despesa?.descricao}
					/>

					<div className=' text-sm text-red-500'>{fields.descricao.errors}</div>
				</FormItem>
				<FormItem>
					<div className='flex space-x-4 items-center mb-1 '>
						<Label htmlFor='fornecedor'>Conta</Label>
						<Drawerconta />
					</div>

					<Popover open={openConta} onOpenChange={setOpenConta}>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								role='combobox'
								aria-expanded={openConta}
								className='w-full justify-between text-zinc-500'>
								{valueConta
									? contas.find(
											(contas: any) => contas.conta.toLowerCase() === valueConta
									  )?.conta
									: "Conta..."}
								<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-full p-2 rounded-xl my-2'>
							<Command>
								<CommandInput placeholder='Procurar fornecedor...' />
								<CommandEmpty>Conta não encontrada</CommandEmpty>
								<CommandGroup>
									{contas?.map((contas: any) => (
										<CommandItem
											key={contas.conta}
											value={contas.conta}
											onSelect={(currentValue) => {
												setValueConta(
													currentValue === valueConta ? "" : currentValue
												);
												setOpenConta(false);
											}}>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													valueConta === contas.conta
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{contas.conta}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</FormItem>

				<FormItem className='mt-3'>
					<Label htmlFor='loja'>Loja</Label>
					<Popover open={openL} onOpenChange={setOpenL}>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								role='combobox'
								aria-expanded={open}
								className='w-full justify-between text-zinc-500'>
								{valueL
									? lojas.find((lojas: any) => lojas.loja === valueL)?.etiqueta
									: "Unidade..."}
								<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
							</Button>
						</PopoverTrigger>
						<PopoverContent id='loja' className='w-full p-2 rounded-xl my-2'>
							<Command id='loja'>
								<CommandInput placeholder='Procurar loja...' />
								<CommandEmpty>Conta não encontrada</CommandEmpty>
								<CommandGroup>
									{lojas?.map((lojas: any) => (
										<CommandItem
											key={lojas.loja}
											value={lojas.loja}
											onSelect={(currentValueL) => {
												setValueL(
													currentValueL === valueL ? "" : currentValueL
												);
												setOpenL(false);
											}}>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													valueL === lojas.loja ? "opacity-100" : "opacity-0"
												)}
											/>
											{lojas.etiqueta}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</FormItem>

				<FormItem>
					<Label>Tipo</Label>
					<RadioGroup
						name='tipo'
						defaultValue={despesa?.tipo ? despesa.tipo : "fixa"}
						className='flex space-x-3'>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='fixa' id='fixa' />
							<Label htmlFor='fixa'>Fixa</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='variavel' id='variavel' />
							<Label htmlFor='aberto'>Variável</Label>
						</div>
					</RadioGroup>
					<div className=' text-sm text-red-500'>{fields.tipo.errors}</div>
				</FormItem>
				<div className='grid grid-cols-2'>
					<FormItem className='mt-6 '>
						{/* <Label htmlFor='date'>Data</Label> */}
						<Calendar
							className='rounded-md border bg-white w-64 '
							mode='single'
							selected={date}
							onSelect={setDate}
							initialFocus
						/>
					</FormItem>
					<div>
						<FormItem>
							<Label htmlFor='img-field'>Comprovante</Label>
							<Input id='img-field' type='file' name='img' />
						</FormItem>

						<FormItem className='mt-14 mb-3 text-right'>
							<Button
								className='hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear'
								type='submit'>
								Salvar
							</Button>
						</FormItem>
					</div>
				</div>
			</Form>
		</div>
	);
}
