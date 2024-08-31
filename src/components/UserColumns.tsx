"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { ActionButtonsWrapper } from "./ActionButtonsWrapper";
import { EditActionButton, ViewActionButton } from "./Buttons";
import { User } from "@/lib/definitions";

export const columns: ColumnDef<User>[] = [
  {
    id: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
    enableColumnFilter: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      return (
        <ActionButtonsWrapper>
          <ViewActionButton href={`/dashboard/user/${row.original.id}`} />
          <EditActionButton href={`/dashboard/user/${row.original.id}/edit`} />
          {/* <RemoveActionButton onRemove={() => deleteAgenda(row.original.id)} /> */}
        </ActionButtonsWrapper>
      );
    },
    enableColumnFilter: false,
  },
];
