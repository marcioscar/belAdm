import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import React from "react";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./pagination";
import { Form, useLocation } from "@remix-run/react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
		initialState: {
			pagination: {
				pageSize: 15,
			},
		},
	});
	const location = useLocation().pathname;

	return (
		<div className='w-full'>
			{location === "/receitas" && (
				<div className='flex items-center py-4'>
					<Input
						placeholder='Filtrar Loja...'
						value={(table.getColumn("loja")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("loja")?.setFilterValue(event.target.value)
						}
						className='max-w-sm bg-white/50'
					/>
				</div>
			)}
			{location === "/transferencias" && (
				<div className='flex items-center py-4'>
					<Input
						placeholder='Filtrar Loja...'
						value={(table.getColumn("loja")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("loja")?.setFilterValue(event.target.value)
						}
						className='max-w-sm bg-white/50'
					/>
				</div>
			)}
			{(location === "/compras" || location === "/despesas") && (
				<div className='flex items-center py-4'>
					<Input
						placeholder='Filtrar fornecedor...'
						value={
							(table.getColumn("fornecedor")?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn("fornecedor")?.setFilterValue(event.target.value)
						}
						className='max-w-sm bg-white/50'
					/>
				</div>
			)}

			<Form method='post' className='rounded-md border bg-white'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											className=' bg-zinc-200  text-zinc-700'
											key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									Sem Resultados
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<DataTablePagination table={table} />
				{/* <div className='flex items-center justify-end space-x-2 py-4'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}>
						Anteriores
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}>
						Próximos
					</Button>
				</div> */}
			</Form>
		</div>
	);
}
