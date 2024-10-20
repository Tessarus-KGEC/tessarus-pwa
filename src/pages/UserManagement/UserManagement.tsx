import { FunctionComponent, useMemo, useState } from 'react';

import Alrert from '@/components/Alrert';
import SearchBar from '@/components/SearchBar';
import { PERMISSIONS } from '@/constants';
import useDebounceSearch from '@/hooks/useDebounce';
import useMediaQuery from '@/hooks/useMedia';
import { useAppSelector } from '@/redux';
import { useGetUAMUsersQuery } from '@/redux/api/userManagement.slice';
import {
  Button,
  Chip,
  Pagination,
  ScrollShadow,
  Select,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from '@nextui-org/react';

import ChangeConfirmModal from './components/ChangeConfirmModal';

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

  if (!isUserAllowedToView) {
    return (
      <div className="px-4">
        <Alrert title="Permission Denied" message="You do not have permission to view this page." type="danger" />
      </div>
    );
  }

  if (!isVisibleForScreen) {
    return (
      <div className="px-4">
        <Alrert
          title="Not available"
          message="Please open in desktop, this feature is not available for this screen size (over 768px)"
          type="warning"
        />
      </div>
    );
  }
  if (uamUsers?.status !== 200) return null;

  return (
    <>
      <section className="hidden h-full flex-col space-y-4 px-4 pb-6 md:flex">
        <h1 className="text-2xl">User Management</h1>
        <div className="flex">
          <div className="flex flex-1 gap-4">
            <SearchBar placeholder={`Search user name...`} className="max-w-[450px]" onChange={(e) => setSearchQuery(e.target.value)} />
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
          <div className="flex-1 overflow-auto rounded-2xl">
            <Table>
              <TableHeader>
                <TableColumn className="text-sm">User</TableColumn>
                <TableColumn className="text-center text-sm">Espektro ID</TableColumn>
                <TableColumn className="text-center text-sm">Roles</TableColumn>
                <TableColumn className="text-center text-sm">Volunteer Status</TableColumn>
              </TableHeader>
              <TableBody emptyContent={'No user data available'}>
                {tableData.map((user) => {
                  const allPermissions = Object.values(PERMISSIONS);
                  return (
                    <TableRow key={user._id}>
                      <TableCell className="max-w-[300px]">
                        <User
                          name={user.name}
                          description={user.phone}
                          avatarProps={{
                            src: user.profileImageUrl,
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="text-sm text-default-500">{user.espektroId}</p>
                      </TableCell>
                      <TableCell className="max-w-[300px] text-center">
                        <Select
                          items={allPermissions
                            .filter((perm) => perm !== 'user:readonly' && perm !== 'volunteer:readonly')
                            .map((perm) => ({
                              key: perm,
                              permission: perm,
                            }))}
                          isDisabled={!user.isFromKGEC || !isRoleModificationAllowed}
                          variant="bordered"
                          isMultiline={true}
                          selectionMode="multiple"
                          placeholder="Select a role"
                          defaultSelectedKeys={accessChanges && accessChanges[user._id] ? accessChanges[user._id].roles : user.permissions}
                          classNames={{
                            popoverContent: 'text-foreground dark border border-default-200',
                            innerWrapper: 'py-2',
                          }}
                          renderValue={(items) => {
                            return (
                              <div className="flex flex-wrap gap-2">
                                {items.sort().map((item) => {
                                  return (
                                    <Chip
                                      key={item.key}
                                      radius="sm"
                                      // color={item.data?.permission.includes(PERMISSIONS.ADMIN_READONLY) ? 'danger' : 'default'}
                                      // variant={item.data?.permission.includes(PERMISSIONS.ADMIN_READONLY) ? 'bordered' : 'solid'}
                                    >
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
                              [user._id]: {
                                name: user.name,
                                roles: Array.from(keys) as string[],
                                isVolunteer: accessChanges && accessChanges[user._id] ? accessChanges[user._id].isVolunteer : user.isVolunteer,
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
                      </TableCell>
                      <TableCell className="max-w-[200px] text-center">
                        <div className="flex items-center justify-center hover:cursor-pointer">
                          <Switch
                            size="md"
                            isDisabled={!user.isFromKGEC || !isVolunteerModificationAllowed}
                            defaultSelected={accessChanges && accessChanges[user._id] ? accessChanges[user._id].isVolunteer : user.isVolunteer}
                            onChange={(value) => {
                              // const userPermissions =
                              //   accessChanges && accessChanges[user._id]?.roles ? (accessChanges[user._id].roles as string[]) : user.permissions;
                              // const modifiedPermissions = value.target.checked
                              //   ? [...userPermissions, PERMISSIONS.VOLUNTEER_READONLY]
                              //   : userPermissions.filter((perm) => perm !== PERMISSIONS.VOLUNTEER_READONLY);
                              setAccessChanges((prev) => {
                                return {
                                  ...prev,
                                  [user._id]: {
                                    name: user.name,
                                    roles: accessChanges && accessChanges[user._id] ? accessChanges[user._id].roles : user.permissions,
                                    isVolunteer: value.target.checked,
                                  },
                                };
                              });
                            }}
                          >
                            <p className="w-16">
                              {user.isVolunteer || (accessChanges && accessChanges[user._id]?.isVolunteer) ? 'active' : 'inactive'}
                            </p>
                          </Switch>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
