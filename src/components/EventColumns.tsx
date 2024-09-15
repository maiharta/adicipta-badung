"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { ActionButtonsWrapper } from "./ActionButtonsWrapper";
import {
  EditActionButton,
  RemoveActionButton,
  ViewActionButton,
} from "./Buttons";
import { Event } from "@prisma/client";
import { deleteAgenda } from "@/lib/actions";
import { formatDateToLocal } from "@/lib/utils";

export const columns: ColumnDef<Event>[] = [
  {
    id: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Agenda" />
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lokasi" />
    ),
  },
  {
    accessorKey: "startDate",
    accessorFn: (row) => formatDateToLocal(row.startDate.toDateString()),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal" />
    ),
    cell: ({ row }) => {
      return formatDateToLocal(row.original.startDate.toDateString());
    },
    sortingFn: (rowA, rowB) => {
      return (
        rowA.original.startDate.getTime() - rowB.original.startDate.getTime()
      );
    },
  },
  {
    id: "time",
    accessorFn: (row) => `${row.startTime} - ${row.endTime}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jam" />
    ),
    cell: ({ row }) => {
      return `${row.original.startTime} - ${row.original.endTime}`;
    },
  },
  {
    accessorKey: "coordinator",
    accessorFn: (row) => row.coordinator || "-",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Penanggung Jawab" />
    ),
  },
  {
    accessorKey: "coordinatorPhoneNumber",
    accessorFn: (row) => row.coordinatorPhoneNumber || "-",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="No. Telepon Penanggung Jawab"
      />
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      return (
        <ActionButtonsWrapper>
          <ViewActionButton href={`/dashboard/agenda/${row.original.id}`} />
          <EditActionButton
            href={`/dashboard/agenda/${row.original.id}/edit`}
          />
          <RemoveActionButton onRemove={() => deleteAgenda(row.original.id)} />
        </ActionButtonsWrapper>
      );
    },
    enableGlobalFilter: false,
  },
];
