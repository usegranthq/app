'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { formatDate } from 'date-fns';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shadcn/components/ui/breadcrumb';
import { Button } from '@/shadcn/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';

import { ROUTES } from '@/constants/routes';
import { domainWithoutProtocol } from '@/utils/url';
import PaginationControls from '@/components/PaginationControls';
import { Tenant, TenantProvider } from '@/types/app.types';

import TenantOptions from './TenantOptions';

interface TenantProvidersProps {
  id: string;
  tenant: Tenant;
  providers: TenantProvider[];
  pagination: Pagination;
}

function getColumns(tenantId: string): ColumnDef<TenantProvider>[] {
  const columns: ColumnDef<TenantProvider>[] = [
    {
      header: 'Name',
      cell: ({ row }) => {
        return domainWithoutProtocol(row.original.url);
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
      header: 'Added at',
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

export default function TenantProviders({ id, providers, pagination, tenant }: TenantProvidersProps) {
  const columns = useMemo(() => getColumns(id), [id]);
  const router = useRouter();

  const table = useReactTable({
    data: providers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (row: TenantProvider) => {
    router.push(`/u/tenants/${id}/providers/${row.id}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center">
        <div className="grid gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={ROUTES.TENANTS}>Tenants</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Providers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-medium">{tenant.name}</h1>
        </div>
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="cursor-pointer"
                onClick={() => handleRowClick(row.original)}
              >
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
