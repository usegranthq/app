'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { MouseEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function makePage(pageNumber: number, text: string, isActive: boolean) {
  return {
    number: pageNumber,
    text,
    active: isActive,
  };
}

function computePageLimits(pagination: Pagination, maxSize: number) {
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Default page limits
  let startPage = 1;
  let endPage = totalPages;

  const isMaxSized = maxSize ? maxSize < totalPages : false;

  // recompute if maxSize
  if (isMaxSized && maxSize) {
    // current page is displayed in the middle of the visible ones
    startPage = Math.max(pagination.page - Math.floor(maxSize / 2), 1);
    endPage = startPage + maxSize - 1;

    // Adjust if limit is exceeded
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - maxSize + 1;
    }
  }

  return {
    startPage,
    endPage,
    totalPages,
    isMaxSized,
  };
}

function getPages(pagination: Pagination, maxSize: number) {
  const pageLimits = computePageLimits(pagination, maxSize);

  const pages = [];

  // add page number links
  for (let pageNumber = pageLimits.startPage; pageNumber <= pageLimits.endPage; pageNumber += 1) {
    const page = makePage(pageNumber, pageNumber.toString(), pageNumber === pagination.page);
    pages.push(page);
  }

  // add links to move between page sets
  if (pageLimits.isMaxSized && maxSize > 0) {
    if (pageLimits.startPage > 1) {
      // need ellipsis for all options unless range is too close to beginning
      if (pageLimits.startPage > 3) {
        const previousPageSet = makePage(pageLimits.startPage - 1, '...', false);
        pages.unshift(previousPageSet);
      }

      if (pageLimits.startPage === 3) {
        // need to replace ellipsis when the buttons would be sequential
        const secondPageLink = makePage(2, '2', false);
        pages.unshift(secondPageLink);
      }

      // add the first page
      const firstPageLink = makePage(1, '1', false);
      pages.unshift(firstPageLink);
    }

    if (pageLimits.endPage < pageLimits.totalPages) {
      // need ellipsis for all options unless range is too close to end
      if (pageLimits.endPage < pageLimits.totalPages - 2) {
        const nextPageSet = makePage(pageLimits.endPage + 1, '...', false);
        pages.push(nextPageSet);
      }

      // need to replace ellipsis when the buttons would be sequential
      if (pageLimits.endPage === pageLimits.totalPages - 2) {
        const secondToLastPageLink = makePage(pageLimits.totalPages - 1, (pageLimits.totalPages - 1).toString(), false);
        pages.push(secondToLastPageLink);
      }

      // add the last page
      const lastPageLink = makePage(pageLimits.totalPages, pageLimits.totalPages.toString(), false);
      pages.push(lastPageLink);
    }
  }

  return pages;
}

function getControlState(pagination: Pagination) {
  return {
    canGoToPrevious: pagination.page > 1,
    canGoToNext: pagination.page < pagination.total,
  };
}

export default function PaginationControl({ pagination }: { pagination: Pagination }) {
  const pages = getPages(pagination, 2);
  const controlState = getControlState(pagination);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageClick = (e: MouseEvent, page: number) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(pathname + '?' + params);
  };

  return (
    <Pagination className="mx-0 justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className={controlState.canGoToPrevious ? '' : 'pointer-events-none opacity-75'} />
        </PaginationItem>
        {pages.map((page) => {
          if (page.text === '...') {
            return (
              <PaginationItem key={page.number}>
                <PaginationEllipsis onClick={(e) => handlePageClick(e, page.number)} />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page.number}>
              <PaginationLink isActive={page.active} onClick={(e) => handlePageClick(e, page.number)}>
                {page.text}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext className={controlState.canGoToNext ? '' : 'pointer-events-none opacity-75'} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
