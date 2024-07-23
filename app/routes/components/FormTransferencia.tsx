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

export default function FormTransferencia(despesa?: any) {
	const data = useActionData<typeof action>();
	const [form, fields] = useForm({
		lastSubmission: data,
	});

	const [open, setOpen] = useState(false);
	const [valueLSaida, setValueLSaida] = useState(despesa?.loja?.toLowerCase());
	const [valueLEntrada, setValueLEntrada] = useState(
		despesa?.loja?.toLowerCase()
	);
	const [openLSaida, setOpenLSaida] = useState(false);
	const [openLEntrada, setOpenLEntrada] = useState(false);

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
					value={
						valueLSaida?.charAt(0).toUpperCase() + valueLSaida?.substring(1)
					}
					name='origem'
					id='origem'
				/>
				<input
					hidden
					readOnly
					value={
						valueLEntrada?.charAt(0).toUpperCase() + valueLEntrada?.substring(1)
					}
					name='destino'
					id='destino'
				/>

				<input type='text' hidden readOnly value={date} name='date' id='date' />
				<FormItem className='mt-3'>
					<Label htmlFor='loja'>Loja Saída</Label>
					<Popover open={openLSaida} onOpenChange={setOpenLSaida}>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								role='combobox'
								aria-expanded={open}
								className='w-full justify-between text-zinc-500'>
								{valueLSaida
									? lojas.find((lojas: any) => lojas.loja === valueLSaida)
											?.etiqueta
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
											onSelect={(currentValueLSaida) => {
												setValueLSaida(
													currentValueLSaida === valueLSaida
														? ""
														: currentValueLSaida
												);
												setOpenLSaida(false);
											}}>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													valueLSaida === lojas.loja
														? "opacity-100"
														: "opacity-0"
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
				<FormItem className='mt-3'>
					<Label htmlFor='loja'>Loja Entrada</Label>
					<Popover open={openLEntrada} onOpenChange={setOpenLEntrada}>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								role='combobox'
								aria-expanded={open}
								className='w-full justify-between text-zinc-500'>
								{valueLEntrada
									? lojas.find((lojas: any) => lojas.loja === valueLEntrada)
											?.etiqueta
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
											onSelect={(currentValueLEntrada) => {
												setValueLEntrada(
													currentValueLEntrada === valueLEntrada
														? ""
														: currentValueLEntrada
												);
												setOpenLEntrada(false);
											}}>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													valueLEntrada === lojas.loja
														? "opacity-100"
														: "opacity-0"
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
						<FormItem className='mt-14 mb-3 text-right'>
							<Button
								className='hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear'
								type='submit'>
								Transferir
							</Button>
						</FormItem>
					</div>
				</div>
			</Form>
		</div>
	);
}
