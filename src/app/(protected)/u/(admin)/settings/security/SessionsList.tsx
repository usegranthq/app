'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { formatDate, formatDistanceToNow } from 'date-fns';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';
import { Session } from '@/types/app.types';

import SessionOptions from './SessionOptions';

const columns: ColumnDef<Session>[] = [
  {
    header: 'IP Address',
    cell: ({ row }) => {
      const ipAddress = row.original.ipAddress;
      return ipAddress || 'Unknown';
    },
  },
  {
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return formatDate(createdAt, 'MMM dd, yyyy');
    },
  },
  {
    header: 'Expires At',
    cell: ({ row }) => {
      const expiresAt = row.original.expiresAt;
      if (new Date(expiresAt) < new Date()) {
        return 'Expired';
      }

      return formatDistanceToNow(expiresAt, { addSuffix: true });
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <SessionOptions session={row.original} />
      </div>
    ),
  },
];

interface SessionsListProps {
  sessions: Session[];
}

export default function SessionsList({ sessions }: SessionsListProps) {
  const table = useReactTable({
    data: sessions,
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
    </div>
  );
}
