/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { QueryOptions, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect } from 'react';
import React from 'react';

import { useStateCallback } from '@/common/hooks/useStateCallback';

interface IProps {
  initPage: number;
  initLimit: number;
  pageSizes: number[];
  search?: string | undefined;
  pageSizeBackground?: string;
  paginatorOptions: IPaginatorOptions;
  queryOptions?: QueryOptions;
  filters?: any;
  extra?: any;
}

interface IPaginationItemProps {
  page: number | '...';
  currentPage: number | undefined;
  setPage: (state: number, cb?: ((state: number) => void) | undefined) => void;
}

interface IPaginatorOptions {
  queryKey: string[];
  fetch: any;
}

const PaginationItem = ({
  page,
  currentPage,
  setPage,
}: IPaginationItemProps) => {
  const active = currentPage?.toString() === page?.toString() ? 'active' : '';
  return (
    <React.Fragment>
      <button
        type='button'
        onClick={() => typeof page !== 'string' && setPage(page)}
        className={clsx(
          'mx-0 items-center py-2 text-xs font-semibold text-gray-400',
          active
            ? 'cursor-default rounded bg-[#007BC3] text-white'
            : 'hover:bg-gray-50',
          typeof page === 'string' ? 'px-0' : 'px-4'
        )}
      >
        {page}
      </button>
    </React.Fragment>
  );
};

const usePaginator = ({
  initPage,
  initLimit,
  pageSizes,
  paginatorOptions,
  queryOptions,
  search = undefined,
  filters,
  extra,
}: IProps) => {
  const [page, setPage] = useStateCallback<any>(initPage);
  const [shouldFetch, setShouldFetch] = useStateCallback(false);
  const [limitChanged, setLimitChanged] = useStateCallback<number>(initLimit);
  const [limit, setLimit] = useStateCallback(initLimit);

  useEffect(() => {
    setShouldFetch(false, () => {
      setPage(1);
      setLimit(limitChanged);
    });
  }, [limitChanged]);

  useEffect(() => {
    setShouldFetch(true);
  }, [search, page, limit, shouldFetch]);

  const query = useQuery<any>(
    [...paginatorOptions.queryKey, page, limit, extra ?? search],
    () => paginatorOptions.fetch(page, limit, search, filters, extra),
    {
      ...queryOptions,
      keepPreviousData: true,
      staleTime: 60000,
      enabled: shouldFetch,
    }
  );

  const pages = query.data
    ? Array.from(
        Array(Math.ceil(Number(query.data?.total / query.data?.limit))).keys()
      ).length
      ? Array.from(
          Array(Math.ceil(Number(query.data?.total / query.data?.limit))).keys()
        )
      : [0]
    : [];

  const generatePagination = (data: number[]) => {
    return data.map((p, index) => {
      return (
        <PaginationItem
          key={index}
          setPage={setPage}
          currentPage={query.data?.page}
          page={p + 1}
        />
      );
    });
  };

  const paginationComponent = () => {
    return (
      <div className='mt-6 flex items-center justify-between bg-white py-3 sm:px-6 md:px-4'>
        <div className='flex flex-1 flex-col items-center justify-between gap-4 sm:flex-row'>
          <nav aria-label='Pagination' className='flex border-none'>
            {query.data.page > 2 && (
              <button
                type='button'
                disabled={page === 1}
                onClick={() => setPage(1)}
                className='relative inline-flex hidden items-center rounded-l-md px-2 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 md:block'
              >
                <span className='sr-only'>Inicio</span>
                <Image
                  src='/icons/anglesLeft.svg'
                  alt='Inicio'
                  width={14}
                  height={14}
                />
              </button>
            )}
            <button
              disabled={page === 1}
              onClick={() => setPage((old: number) => Math.max(old - 1, 0))}
              type='button'
              className='relative inline-flex items-center px-2 py-2 text-gray-400 hover:bg-gray-50 focus:z-20'
            >
              <span className='sr-only'>Anterior</span>
              <Image
                src='/icons/angleLeft.svg'
                alt='Anterior'
                width={10}
                height={12}
              />
            </button>
            {pages.length < 5 ? (
              <React.Fragment>
                {pages.map((page: number, index: number) => (
                  <PaginationItem
                    key={index}
                    setPage={setPage}
                    currentPage={query.data?.page}
                    page={page + 1}
                  />
                ))}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {pages.slice(0, 4).includes(page - 1) && pages.length !== 5 ? (
                  <React.Fragment>
                    {generatePagination(pages.slice(0, 5))}
                    <PaginationItem
                      setPage={setPage}
                      currentPage={query.data?.page}
                      page='...'
                    />
                    {generatePagination(
                      pages.slice(pages.length - 1, pages.length)
                    )}
                  </React.Fragment>
                ) : pages
                    .slice(pages.length - 5, pages.length)
                    .includes(page - 1) && pages.length !== 5 ? (
                  <React.Fragment>
                    {generatePagination(pages.slice(0, 1))}
                    <PaginationItem
                      setPage={setPage}
                      currentPage={query.data?.page}
                      page='...'
                    />
                    {generatePagination(
                      pages.slice(pages.length - 5, pages.length)
                    )}
                  </React.Fragment>
                ) : pages.slice(4, pages.length - 5).includes(page - 1) ? (
                  <React.Fragment>
                    {generatePagination(pages.slice(0, 1))}
                    <PaginationItem
                      setPage={setPage}
                      currentPage={query.data?.page}
                      page='...'
                    />
                    {generatePagination(pages.slice(page - 2, page + 1))}
                    <PaginationItem
                      setPage={setPage}
                      currentPage={query.data?.page}
                      page='...'
                    />
                    {generatePagination(
                      pages.slice(pages.length - 1, pages.length)
                    )}
                  </React.Fragment>
                ) : (
                  pages.length === 5 && (
                    <React.Fragment>{generatePagination(pages)}</React.Fragment>
                  )
                )}
              </React.Fragment>
            )}
            <button
              type='button'
              onClick={() => setPage((old: number) => Math.max(old + 1, 0))}
              disabled={page === pages[pages.length - 1] + 1}
              className='relative inline-flex items-center px-2 py-2 text-gray-400 hover:bg-gray-50 focus:z-20'
            >
              <span className='sr-only'>Siguiente</span>
              <Image
                src='/icons/angleRight.svg'
                alt='Inicio'
                width={10}
                height={12}
              />
            </button>
            {pages.length > 1 && query?.data?.page < pages.length - 1 && (
              <button
                type='button'
                disabled={page === pages[pages.length - 1] + 1}
                onClick={() => setPage(pages.length)}
                className='relative inline-flex hidden items-center px-2 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 md:block'
              >
                <span className='sr-only'>Último</span>
                <Image
                  src='/icons/anglesRight.svg'
                  alt='Inicio'
                  width={14}
                  height={14}
                />
              </button>
            )}
          </nav>
          <div className='flex items-center gap-2 text-sm text-gray-700'>
            <select
              onChange={(e) => setLimitChanged(Number(e.target.value))}
              defaultValue={limit}
              className='rounded border-none bg-gray-200 py-1.5 pe-6 ps-3 text-xs font-medium text-gray-400'
            >
              {pageSizes.map((size: number, index: number) => (
                <option key={index} value={size} className='pb-3 pt-3'>
                  {size}
                </option>
              ))}
            </select>
            {query?.data?.limit < query?.data?.total && (
              <span className='text-xs font-medium text-gray-400'>
                de {query.data.total} elementos
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return { pages, page, setPage, limit, setLimit, paginationComponent, query };
};

export default usePaginator;
