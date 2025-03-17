'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { TenantProvider } from '@prisma/client';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { formatDate } from 'date-fns';

import { Button } from '@/shadcn/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';

import PaginationControls from '@/blocks/PaginationControls';

import TenantOptions from './TenantOptions';

interface TenantProvidersProps {
  id: string;
  providers: TenantProvider[];
  pagination: Pagination;
}

function getColumns(tenantId: string): ColumnDef<TenantProvider>[] {
  const columns: ColumnDef<TenantProvider>[] = [
    {
      header: 'Name',
      cell: ({ row }) => {
        return row.original.url;
      },
    },
    {
      header: 'Audience',
      cell: ({ row }) => {
        return row.original.audience;
      },
    },
    {
      header: 'Earliest Issuance Time allowed',
      cell: ({ row }) => {
        const earliestIssuanceTimeAllowed = row.original.earliestIssuanceTimeAllowed;
        return earliestIssuanceTimeAllowed > 1 ? `${earliestIssuanceTimeAllowed} hours` : '1 hour';
      },
    },
    {
      header: 'Created at',
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        return formatDate(createdAt, 'MMM dd, yyyy');
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <TenantOptions tenantId={tenantId} provider={row.original} />
        </div>
      ),
    },
  ];
  return columns;
}

export default function TenantProviders({ id, providers, pagination }: TenantProvidersProps) {
  const columns = useMemo(() => getColumns(id), [id]);

  const table = useReactTable({
    data: providers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex">
        <h1 className="text-2xl font-medium">Providers</h1>
        <Button asChild className="ml-auto">
          <Link href={`/u/tenants/${id}/add`}>Add new provider</Link>
        </Button>
      </div>
      <div className="mt-10 rounded-md border">
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
