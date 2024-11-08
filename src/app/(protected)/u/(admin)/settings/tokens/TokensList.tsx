'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format, formatRelative } from 'date-fns';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Token } from '@/types/app.types';

import TokenOptions from './TokenOptions';
import { isNullOrUndefined } from '@/utils/validators';

export const columns: ColumnDef<Token>[] = [
  {
    header: 'Name',
    cell: ({ row }) => {
      const { name, expiresAt } = row.original;

      return (
        <div>
          <div className="capitalize">{name}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {expiresAt ? format(new Date(expiresAt), 'MMM d, yyyy') : 'No expiration'}
          </div>
        </div>
      );
    },
  },
  {
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return format(createdAt, 'MMM d, yyyy');
    },
  },
  {
    header: 'Expires At',
    cell: ({ row }) => {
      const expiresAt = row.original.expiresAt;
      if (isNullOrUndefined(expiresAt)) return <span className="text-muted-foreground">Never</span>;
      return format(expiresAt, 'MMM d, yyyy');
    },
  },
  {
    header: 'Last Used At',
    cell: ({ row }) => {
      const lastUsedAt = row.original.lastUsedAt;
      if (isNullOrUndefined(lastUsedAt)) return <span className="text-muted-foreground">Never</span>;
      return formatRelative(lastUsedAt, new Date());
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <TokenOptions token={row.original} />
      </div>
    ),
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
