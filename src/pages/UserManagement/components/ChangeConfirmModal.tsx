import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow } from '@nextui-org/react';
import React, { useCallback } from 'react';

const ChangeConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: (action?: 'clear') => void;
  actualPermissions: Record<string, string[]>;
  accessChanges: Record<
    string,
    {
      name: string;
      roles?: string[];
      isVolunteer?: boolean;
    }
  >;
}> = ({ isOpen, onClose, accessChanges, actualPermissions }) => {
  const getAllPermissions = useCallback(
    (key: string) => {
      if (!isOpen) return [];
      if (!accessChanges[key]?.roles) return [];
      const permissionsSet = new Set([...accessChanges[key].roles, ...actualPermissions[key]]);
      return Array.from(permissionsSet);
    },
    [accessChanges, actualPermissions, isOpen],
  );

  const getPermissionsDiff = useCallback(
    (key: string) => {
      if (!isOpen) return {};
      if (!accessChanges[key]?.roles) return {};
      const permissionDiff = getAllPermissions(key).reduce(
        (acc, permission) => {
          const isPresentInChanges = accessChanges[key].roles?.includes(permission);
          const isPresentInAcutal = actualPermissions[key].includes(permission);
          // 0: no change, 1: added, -1: removed
          // if permission is in both arrays, it means no change
          if (isPresentInChanges && isPresentInAcutal) {
            return { ...acc, [permission]: 0 };
          }
          // if permission is in accessChanges but not in actualPermissions, it means added
          if (isPresentInChanges && !isPresentInAcutal) {
            return { ...acc, [permission]: 1 };
          }
          // if permission is in actualPermissions but not in accessChanges, it means removed
          if (!isPresentInChanges && isPresentInAcutal) {
            return { ...acc, [permission]: -1 };
          }
          return acc;
        },
        {} as Record<string, number>,
      );
      return permissionDiff;
    },
    [getAllPermissions, accessChanges, actualPermissions, isOpen],
  );
  return (
    <Modal
      size={'lg'}
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[700px] bg-default-50 text-default-foreground dark"
      scrollBehavior="inside"
      classNames={
        {
          // header: 'border-b-[1px] border-default-200',
          // footer: 'border-t-[1px] border-default-200',
        }
      }
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Confirm changes</ModalHeader>
        <ModalBody>
          <ScrollShadow>
            <ul className="space-y-6">
              {Object.entries(accessChanges).map(([key, value]) => {
                const allPermissions = getAllPermissions(key);
                const permissionDiff = getPermissionsDiff(key);
                return (
                  <div key={key} className="space-y-2 rounded-lg border-red-500">
                    <p className="text-medium">{value.name}</p>
                    <div className="ml-4 pl-4">
                      <p className="text-sm text-default-500">
                        Volunteer{' : '}
                        <span className={`${value.isVolunteer ? 'text-success-400' : 'text-danger-400'} text-sm`}>
                          {value.isVolunteer ? 'active' : 'inactive'}
                        </span>
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-default-500">Permissions</p>
                        <div className="flex flex-wrap gap-2 pl-4">
                          {allPermissions.map((role, i) => (
                            <Chip
                              key={i}
                              radius="sm"
                              size="sm"
                              color={permissionDiff[role] === 1 ? 'success' : permissionDiff[role] === -1 ? 'danger' : 'default'}
                              variant="flat"
                              classNames={{
                                content: 'flex items-center gap-1',
                              }}
                            >
                              {/* {permissionDiff[role] !== 0 ? (
                                <span>
                                  {permissionDiff[role] === 1 && <IoMdAdd />}
                                  {permissionDiff[role] === -1 && <IoIosRemove />}
                                </span>
                              ) : null} */}

                              {role}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ul>
          </ScrollShadow>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={() => onClose?.('clear')}>
            Clear changes
          </Button>
          <Button color="primary" onPress={() => onClose?.()}>
            Save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeConfirmModal;
