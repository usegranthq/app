'use client';

import { useMemo } from 'react';
import Link from 'next/link';
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

import { TenantProvider, TenantProviderPolicy } from '@/types/app.types';

import ROUTES from '@/constants/routes';
import { withoutProtocol } from '@/utils/url';
import PaginationControls from '@/components/PaginationControls';

import PolicyOptions from './PolicyOptions';

interface TenantProviderPoliciesProps {
  id: string;
  tenantProvider: TenantProvider;
  policies: TenantProviderPolicy[];
  pagination: Pagination;
}

function getColumns(tenantId: string, tenantProviderId: string): ColumnDef<TenantProviderPolicy>[] {
  const columns: ColumnDef<TenantProviderPolicy>[] = [
    {
      header: 'Name',
      cell: ({ row }) => {
        return row.original.name;
      },
    },
    {
      header: 'Description',
      cell: ({ row }) => {
        return <span className="inline-block max-w-72 truncate">{row.original.description}</span>;
      },
    },
    {
      header: 'Audience',
      cell: ({ row }) => {
        return row.original.audience;
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
          <PolicyOptions tenantId={tenantId} tenantProviderId={tenantProviderId} policy={row.original} />
        </div>
      ),
    },
  ];
  return columns;
}

export default function TenantProviderPolicies({
  id,
  tenantProvider,
  policies,
  pagination,
}: TenantProviderPoliciesProps) {
  const columns = useMemo(() => getColumns(id, tenantProvider.id), [id, tenantProvider.id]);

  const table = useReactTable({
    data: policies,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
                <BreadcrumbLink href={ROUTES.TENANTS_ID(id)}>Providers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Policies</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="flex items-center gap-2 text-2xl font-medium">
            <span className="inline-block max-w-md truncate">{withoutProtocol(tenantProvider.url)}</span>
          </h1>
        </div>
        <Button asChild className="ml-auto">
          <Link href={`/u/tenants/${id}/providers/${tenantProvider.id}/add`}>Add new policy</Link>
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
