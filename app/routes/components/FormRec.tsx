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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Form, useActionData } from "@remix-run/react";

import { ChevronsUpDown, Check } from "lucide-react";
import { useState } from "react";
import Drawerforma from "./Drawer-forma";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import type { action } from "../receitas.nova";

export default function FormRec(formas: any, receita?: any) {
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
	const data = useActionData<typeof action>();
	const [form, fields] = useForm({
		lastSubmission: data,
	});

	const [open, setOpen] = useState(false);
	const [openL, setOpenL] = useState(false);
	const [value, setValue] = useState(receita?.conta.toLowerCase());
	const [valueL, setValueL] = useState(receita?.loja.toLowerCase());
	const [date, setDate] = useState<Date | undefined>(
		receita?.data ? new Date(receita?.data) : new Date()
	);

	return (
		<div className='container'>
			{/* <h1 className=' text-center font-semibold text-blue-600 text-xl m-6'>
				Nova Receita
			</h1> */}

			<Form className=' mx-auto  w-3/4 ' method='post' {...form.props}>
				<input hidden readOnly value={value} name='conta' id='conta' />
				<input hidden readOnly value={valueL} name='loja' id='loja' />
				<input type='text' hidden readOnly value={date} name='date' id='date' />
				<FormItem>
					<div className='flex space-x-4 items-center mb-1 '>
						<Label htmlFor='forma'>Forma de Recebimento</Label>
						<Drawerforma />
					</div>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								role='combobox'
								aria-expanded={open}
								className='w-full justify-between text-zinc-500'>
								{value
									? formas.find((formas: any) => formas.forma === value)
											?.etiqueta
									: "Forma de recebimento..."}
								<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
							</Button>
						</PopoverTrigger>
						<PopoverContent id='forma' className='w-full p-2 rounded-xl my-2'>
							<Command id='forma'>
								<CommandInput placeholder='Procurar conta...' />
								<CommandEmpty>Conta não encontrada</CommandEmpty>
								<CommandGroup>
									{formas?.map((formas: any) => (
										<CommandItem
											key={formas.forma}
											value={formas.forma}
											onSelect={(currentValue) => {
												setValue(currentValue === value ? "" : currentValue);
												setOpen(false);
											}}>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													value === formas.forma ? "opacity-100" : "opacity-0"
												)}
											/>
											{formas.etiqueta}
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
						defaultValue={receita?.valor.toLocaleString("pt-BR", {
							minimumFractionDigits: 2,
						})}
					/>
					<div className=' text-sm text-red-500'>{fields.valor.errors}</div>
				</FormItem>
				<FormItem className='mt-2'>
					<Label htmlFor='descricao'>Descrição</Label>
					<Input
						type='text'
						name='descricao'
						placeholder='Descrição'
						defaultValue={receita?.descricao}
					/>
					{/* {data && data.error.descricao && (
						<p>{data.error.descricao._errors[0]}</p>
					)} */}
					<div className=' text-sm text-red-500'>{fields.descricao.errors}</div>
				</FormItem>
				<FormItem>
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
					<Label>Status</Label>
					<RadioGroup
						name='status'
						defaultValue={receita?.status ? receita.status : "Recebido"}
						className='flex space-x-3'>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='Recebido' id='recebido' />
							<Label htmlFor='recebido'>Recebido</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='Aberto' id='aberto' />
							<Label htmlFor='aberto'>Aberto</Label>
						</div>
					</RadioGroup>
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
