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

export default function FormCompra(fornecedores: any, compra?: any) {
	const data = useActionData<typeof action>();
	const [form, fields] = useForm({
		lastSubmission: data,
	});

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(compra?.fornecedor?.toLowerCase());
	const [date, setDate] = useState<Date | undefined>(
		compra?.data ? new Date(compra?.data) : new Date()
	);

	return (
		<div className='container'>
			<Form className=' mx-auto  w-3/4 ' method='post' {...form.props}>
				<input
					hidden
					readOnly
					value={value?.charAt(0).toUpperCase() + value?.substring(1)}
					name='fornecedor'
					id='fornecedor'
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
						defaultValue={compra?.valor.toLocaleString("pt-BR", {
							minimumFractionDigits: 2,
						})}
					/>
					<div className=' text-sm text-red-500'>{fields.valor.errors}</div>
				</FormItem>
				<FormItem className='mt-2'>
					<Label htmlFor='nf'>Nota Fiscal</Label>
					<Input
						type='text'
						name='nf'
						placeholder='Número da NF'
						defaultValue={compra?.nf}
					/>
					{/* {data && data.error.descricao && (
						<p>{data.error.descricao._errors[0]}</p>
					)} */}
					<div className=' text-sm text-red-500'>{fields.nf.errors}</div>
				</FormItem>

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
				<FormItem className='mt-4 mb-3 text-right'>
					<Button
						className='shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear'
						type='submit'>
						Salvar
					</Button>
				</FormItem>
			</Form>
		</div>
	);
}
