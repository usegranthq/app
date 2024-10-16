'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Token } from '@/types/app.types';

import TokenOptions from './TokenOptions';

export const columns: ColumnDef<Token>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const token = row.original;
      const expiresAt = token.expires_at;

      return (
        <div>
          <div className="capitalize">{token.name}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {expiresAt ? format(new Date(expiresAt), 'MMM d, yyyy') : 'No expiration'}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at');
      return format(new Date(createdAt as string), 'MMM d, yyyy');
    },
  },
  {
    accessorKey: 'last_used_at',
    header: 'Last Used At',
    cell: ({ row }) => {
      const lastUsedAt = row.getValue('last_used_at');
      if (!lastUsedAt) return <span className="text-muted-foreground">Never</span>;
      return format(new Date(lastUsedAt as string), 'MMM d, yyyy');
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <TokenOptions token={row.original} />
        </div>
      );
    },
  },
];

interface TokensListProps {
  tokens: Token[];
}

export default function TokensList({ tokens }: TokensListProps) {
  const table = useReactTable({
    data: tokens,
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
                  <TableCell key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
