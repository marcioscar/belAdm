import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { FcCheckmark, FcFullTrash, FcEditImage } from "react-icons/fc";

import { ArrowUpDown } from "lucide-react";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";
import { Form, NavLink } from "@remix-run/react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@radix-ui/react-dropdown-menu";

export type Receitas = {
	id: string;
	conta: string;
	valor: number;
	descricao: string;
	loja: string;
	carteira: string;
	data: string;
};

export const columns: ColumnDef<Receitas>[] = [
	{
		accessorKey: "conta",
		header: "Conta",
	},
	{
		accessorKey: "valor",
		header: () => <div className='text-right'>Valor</div>,
		cell: ({ row }) => {
			const valor = parseFloat(row.getValue("valor"));
			const formatted = new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(valor);

			return <div className='text-right font-medium'>{formatted}</div>;
		},
	},
	{
		accessorKey: "descricao",
		header: "Descrção",
	},

	{
		accessorKey: "loja",
		header: "Loja",
	},
	{
		accessorKey: "data",

		header: ({ column }) => {
			return (
				<Button
					className='  place-content-centerr'
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Data
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className='lowercase  '>
				{format(row.getValue("data"), "dd  MMM  yyyy", { locale: ptBR })}
			</div>
		),
	},
	{
		accessorKey: "carteira",
		header: "Carteira",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "id",
		header: " ",
		cell: ({ row }) => (
			<div className=' w-1 mr-4 '>
				<Button
					name='id'
					value={row.getValue("id")}
					type='submit'
					className=' border border-none shadow-none'
					variant='outline'
					size='xs'>
					<FcCheckmark className='w-4 h-4' />
				</Button>
			</div>
		),
	},
	{
		accessorKey: "id",
		header: " ",
		cell: ({ row }) => (
			<div className=' w-1 mr-4 '>
				<Button
					variant='outline'
					size='xs'
					className=' border border-none shadow-none'>
					<NavLink to={row.getValue("id")}>
						<FcEditImage className='w-4 h-4' />
					</NavLink>
				</Button>
			</div>
		),
	},
	{
		accessorKey: "id",
		header: "",
		cell: ({ row }) => (
			<Dialog>
				<DialogTrigger asChild>
					<Button
						size='xs'
						variant='outline'
						className=' border border-none shadow-none'>
						<FcFullTrash className='w-4 h-4' />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<Form method='post'>
						<DialogHeader>
							<DialogTitle className=' text-stone-600'>
								Tem Certeza que quer apagar
							</DialogTitle>
							<Separator className='my-4' />
							<DialogDescription className='mt-8'>
								<div className='flex h-5 items-center space-x-4 text-sm'>
									<div>{row.getValue("conta")}</div>

									<div>
										R$
										{row.getValue("valor").toLocaleString("pt-br", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</div>
								</div>
							</DialogDescription>
						</DialogHeader>
						<input
							hidden
							type='text'
							name='id'
							defaultValue={row.getValue("id")}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<button
									type='submit'
									className='rounded-xl mt-2 bg-red-500 text-white px-3 py-2 font-semibold transition duration-300 ease-in-out hover:bg-red-700 hover:-translate-y-1'
									name='_action'
									value='delete'>
									Apagar
								</button>
							</DialogClose>
						</DialogFooter>
					</Form>
				</DialogContent>
			</Dialog>
		),
	},
];
