'use client';

import {
  ColumnDef,
  columnVisibilityFeature,
  flexRender,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { formatRelative } from 'date-fns';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';
import { ApiKey } from '@/types/app.types';
import { formatDate } from '@/utils/date';
import { isNullOrUndefined } from '@/utils/validators';

import ApiKeyOptions from './ApiKeyOptions';

const features = tableFeatures({ columnVisibilityFeature, rowSelectionFeature });

const columns: ColumnDef<typeof features, ApiKey>[] = [
  {
    header: 'Name',
    cell: ({ row }) => {
      const { name } = row.original;
      return <div className="capitalize">{name}</div>;
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
    header: 'Expires At',
    cell: ({ row }) => {
      const expiresAt = row.original.expiresAt;
      if (isNullOrUndefined(expiresAt)) return <span className="text-muted-foreground">Never</span>;
      return formatDate(expiresAt);
    },
  },
  {
    header: 'Last Used At',
    cell: ({ row }) => {
      const lastRefillAt = row.original.lastRequest;
      if (isNullOrUndefined(lastRefillAt)) return <span className="text-muted-foreground">Never</span>;
      return formatRelative(lastRefillAt, new Date());
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ApiKeyOptions apiKey={row.original} />
      </div>
    ),
  },
];

interface ApiKeysListProps {
  apiKeys: ApiKey[];
}

export default function ApiKeysList({ apiKeys }: ApiKeysListProps) {
  const table = useTable({
    features,
    data: apiKeys,
    columns,
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
