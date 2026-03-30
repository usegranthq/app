'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';

import PaginationControls from '@/components/PaginationControls';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';
import { Client } from '@/types/app.types';
import { formatDate } from '@/utils/date';

import ClientOptions from './ClientOptions';

function getColumns(providerId: string): ColumnDef<Client>[] {
  const columns: ColumnDef<Client>[] = [
    {
      header: 'Name',
      cell: ({ row }) => {
        return row.original.name;
      },
    },
    {
      header: 'Created At',
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        return formatDate(createdAt);
      },
    },
    {
      header: 'Subject',
      cell: ({ row }) => {
        return row.original.subject;
      },
    },
    {
      header: 'Audience',
      cell: ({ row }) => {
        return row.original.audience;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ClientOptions providerId={providerId} client={row.original} />
        </div>
      ),
    },
  ];
  return columns;
}

interface ClientsListProps {
  clients: Client[];
  id: string;
  pagination: Pagination;
}

export default function ClientsList({ clients, id, pagination }: ClientsListProps) {
  const columns = useMemo(() => getColumns(id), [id]);

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls pagination={pagination} className="mt-6" />
    </div>
  );
}
