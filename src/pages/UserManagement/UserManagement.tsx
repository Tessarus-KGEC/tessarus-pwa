import Alrert from '@/components/Alrert';
import SearchBar from '@/components/SearchBar';
import { PERMISSIONS } from '@/constants';
import useDebounceSearch from '@/hooks/useDebounce';
import useMediaQuery from '@/hooks/useMedia';
import { useAppSelector } from '@/redux';
import { useGetUAMUsersQuery } from '@/redux/api/userManagement.slice';
import { GetAllUAMUsersResponse } from '@/types/response.type';
import { Button, Chip, Pagination, ScrollShadow, Select, SelectItem, Switch, User } from '@nextui-org/react';
import {
  ColumnPinningState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  RowData,
  useReactTable,
} from '@tanstack/react-table';
import { FunctionComponent, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import ChangeConfirmModal from './components/ChangeConfirmModal';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

const UserManagement: FunctionComponent = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isUserAllowedToView = user?.permissions.includes(PERMISSIONS.ADMIN_READONLY);
  const isVisibleForScreen = useMediaQuery('(min-width: 768px)');
  const allowedPermissionsForSaveChanges = [
    PERMISSIONS.ASSIGN_ROLE,
    PERMISSIONS.REVOKE_ROLE,
    PERMISSIONS.ASSIGN_VOLUNTEER,
    PERMISSIONS.REVOKE_VOLUNTEER,
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  const debouncedSearch = useDebounceSearch({
    query: searchQuery,
    callback: () => searchQuery !== '' && setPage(1),
  });

  const { data: uamUsers } = useGetUAMUsersQuery(
    { page, limit, search: debouncedSearch, fromKGEC: true },
    {
      skip: !isUserAllowedToView || !isVisibleForScreen,
      refetchOnMountOrArgChange: true,
    },
  );
  const [expandedRowState, setExpandedRowState] = useState<{
    [key: string]: {
      content: React.ReactNode;
      columnIndex: number;
    };
  }>();
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });

  const [accessChanges, setAccessChanges] = useState<
    Record<
      string,
      {
        name: string;
        roles?: string[];
        isVolunteer?: boolean;
      }
    >
  >();
  const [actualPermissionsForChangedUsers, setActualPermissionsForChangedUsers] = useState<Record<string, string[]>>();

  const [isConfirmModalVisibel, setIsConfirmModalVisibel] = useState(false);

  const isRoleModificationAllowed = useMemo(() => {
    if (!user) return false;
    return user.permissions.includes(PERMISSIONS.ASSIGN_ROLE) || user.permissions.includes(PERMISSIONS.REVOKE_ROLE);
  }, [user]);

  const isVolunteerModificationAllowed = useMemo(() => {
    if (!user) return false;
    return user.permissions.includes(PERMISSIONS.ASSIGN_VOLUNTEER) || user.permissions.includes(PERMISSIONS.REVOKE_VOLUNTEER);
  }, [user]);

  const tableData = useMemo(() => {
    if (uamUsers?.status === 200) return uamUsers.data.users.filter((uamUser) => uamUser._id !== user?._id);
    return [];
  }, [uamUsers, user]);

  const columnHelper = createColumnHelper<GetAllUAMUsersResponse['users'][0]>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'expand',
        cell: ({ row }) =>
          row.original.isFromKGEC ? (
            <div
              className="flex items-center justify-center text-center hover:cursor-pointer"
              onClick={() => {
                if (!row.getIsExpanded() || (row.getIsExpanded() && expandedRowState?.[row.id].columnIndex === 0)) {
                  row.getToggleExpandedHandler()();
                }

                setExpandedRowState((prev) => ({
                  ...prev,
                  [row.id]: {
                    content: <div>Expanded content</div>,
                    columnIndex: 0,
                  },
                }));
              }}
            >
              <AiOutlinePlus />
            </div>
          ) : null,
        size: 10,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <User
            name={row.original.name}
            description={row.original.phone}
            avatarProps={{
              src: row.original.profileImageUrl,
              // classNames: {
              //   base: 'bg-gradient-to-br from-indigo-500 to-pink-500',
              // },
            }}
          />
        ),
      }),
      columnHelper.accessor('espektroId', {
        header: 'Espektro ID',
        cell: ({ row }) => <p className="text-sm text-default-500">{row.original.espektroId}</p>,
        meta: {
          className: 'text-center',
        },
      }),

      columnHelper.display({
        id: 'action',
        header: 'Role',
        cell: ({ row }) => {
          const allPermissions = Object.values(PERMISSIONS);
          return (
            <Select
              items={allPermissions
                .filter((perm) => perm !== 'user:readonly' && perm !== 'volunteer:readonly')
                .map((perm) => ({
                  key: perm,
                  permission: perm,
                }))}
              isDisabled={!row.original.isFromKGEC || !isRoleModificationAllowed}
              variant="bordered"
              isMultiline={true}
              selectionMode="multiple"
              placeholder="Select a role"
              defaultSelectedKeys={
                accessChanges && accessChanges[row.original._id] ? accessChanges[row.original._id].roles : row.original.permissions
              }
              classNames={{
                popoverContent: 'text-foreground dark border border-default-200',
                innerWrapper: 'py-2',
              }}
              renderValue={(items) => {
                return (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => {
                      return (
                        <Chip key={item.key} radius="sm">
                          {item.data?.permission}
                        </Chip>
                      );
                    })}
                  </div>
                );
              }}
              onSelectionChange={(keys) => {
                setAccessChanges((prev) => ({
                  ...prev,
                  [row.original._id]: {
                    name: row.original.name,
                    roles: Array.from(keys) as string[],
                    isVolunteer:
                      accessChanges && accessChanges[row.original._id] ? accessChanges[row.original._id].isVolunteer : row.original.isVolunteer,
                  },
                }));
              }}
            >
              {(data) => (
                <SelectItem key={data.key} textValue={data.permission}>
                  <div className="flex items-center gap-2">{data.permission}</div>
                </SelectItem>
              )}
            </Select>
          );
        },
        size: 200,
      }),
      columnHelper.display({
        id: 'action',
        header: 'Volunteer Status',
        cell: ({ row }) => (
          <div className="flex items-center justify-center hover:cursor-pointer">
            <Switch
              size="md"
              isDisabled={!row.original.isFromKGEC || !isVolunteerModificationAllowed}
              defaultSelected={
                accessChanges && accessChanges[row.original._id] ? accessChanges[row.original._id].isVolunteer : row.original.isVolunteer
              }
              onChange={(value) => {
                const userPermissions =
                  accessChanges && accessChanges[row.original._id]?.roles
                    ? (accessChanges[row.original._id].roles as string[])
                    : row.original.permissions;
                const modifiedPermissions = value.target.checked
                  ? [...userPermissions, PERMISSIONS.VOLUNTEER_READONLY]
                  : userPermissions.filter((perm) => perm !== PERMISSIONS.VOLUNTEER_READONLY);
                setAccessChanges((prev) => {
                  return {
                    ...prev,
                    [row.original._id]: {
                      name: row.original.name,
                      roles: modifiedPermissions,
                      isVolunteer: value.target.checked,
                    },
                  };
                });
              }}
            >
              <p className="w-16">
                {row.original.isVolunteer || (accessChanges && accessChanges[row.original._id]?.isVolunteer) ? 'active' : 'inactive'}
              </p>
            </Switch>
          </div>
        ),
        size: 50,
      }),
    ],
    [columnHelper, expandedRowState, accessChanges],
  );

  const table = useReactTable({
    data: tableData as never[],
    columns,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel<GetAllUAMUsersResponse>(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      columnPinning,
    },
    onColumnPinningChange: setColumnPinning,
    columnResizeMode: 'onChange',
  });
  if (uamUsers?.status !== 200) return null;

  if (!isUserAllowedToView) {
    return (
      <div className="px-4">
        <Alrert title="Permission Denied" message="You do not have permission to view this page." type="danger" />
      </div>
    );
  }

  return (
    <>
      <div className="px-4 md:hidden">
        <Alrert title="Not available" message="This feature is not available for this screen size (over 768px)" type="warning" />
      </div>
      <section className="hidden h-full flex-col space-y-4 px-4 pb-6 md:flex">
        <h1 className="text-2xl">User Management</h1>
        <div className="flex">
          <div className="flex flex-1 gap-4">
            <SearchBar placeholder={`Search your favorite event...`} className="max-w-[450px]" onChange={(e) => setSearchQuery(e.target.value)} />
            <Button
              color="primary"
              isDisabled={
                !user || !user.isFromKGEC || !allowedPermissionsForSaveChanges.some((perm) => user.permissions.includes(perm)) || !accessChanges
              }
              onClick={() => {
                console.log('Save changes');
                if (!accessChanges) return;
                const actualPermissions = Object.entries(accessChanges).reduce(
                  (acc, [key]) => {
                    const user = tableData.find((u) => u._id === key);
                    if (!user) return acc;
                    return {
                      ...acc,
                      [key]: user.permissions,
                    };
                  },
                  {} as Record<string, string[]>,
                );
                setActualPermissionsForChangedUsers(actualPermissions);
                setIsConfirmModalVisibel(true);
              }}
            >
              Save Changes
            </Button>
          </div>
          <Pagination
            isCompact
            showControls
            total={Math.ceil(uamUsers.data.total / limit)}
            initialPage={page}
            size="lg"
            className="ml-auto"
            onChange={(page) => setPage(page)}
          />
        </div>
        <ScrollShadow>
          <div className="flex-1 overflow-auto rounded-2xl bg-default-50">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-default-200">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className={`border-red-500 py-4`}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <>
                      <tr
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className={`${index === table.getRowModel().rows.length - 1 ? '' : 'border-b'} border-default-100`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className={`py-2 ${cell.column.columnDef.meta?.className ?? ''}`} width={cell.column.getSize()}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>

                      {row.getIsExpanded() && expandedRowState && (
                        <tr>
                          <td colSpan={row.getVisibleCells().length}>{expandedRowState[row.id].content}</td>
                        </tr>
                      )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ScrollShadow>

        <ChangeConfirmModal
          isOpen={isConfirmModalVisibel}
          onClose={(action) => {
            if (action === 'clear') setAccessChanges({});
            setIsConfirmModalVisibel(false);
          }}
          actualPermissions={actualPermissionsForChangedUsers ?? {}}
          accessChanges={accessChanges ?? {}}
        />
      </section>
    </>
  );
};
export default UserManagement;
