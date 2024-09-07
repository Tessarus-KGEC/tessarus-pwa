import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';

const ChangeConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: (action?: 'clear') => void;
  accessChanges: Record<
    string,
    {
      name: string;
      roles?: string[];
      isVolunteer?: boolean;
    }
  >;
}> = ({ isOpen, onClose, accessChanges }) => {
  return (
    <Modal size={'lg'} isOpen={isOpen} onClose={onClose} className="max-h-[700px] bg-default-50 text-default-foreground dark" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Confirm changes</ModalHeader>
        <ModalBody>
          <ul className="space-y-6">
            {Object.entries(accessChanges).map(([key, value]) => (
              <div key={key} className="space-y-2 rounded-lg border-red-500">
                <p className="text-lg font-bold">{value.name}</p>
                <div className="pl-2">
                  <p className="text-default-500">
                    Volunteer{' : '}
                    <span className={`${value.isVolunteer ? 'text-success-400' : 'text-danger-400'} text-sm`}>
                      {value.isVolunteer ? 'active' : 'inactive'}
                    </span>
                  </p>
                  <div className="space-y-2">
                    <p className="text-default-500">Permissions</p>
                    <div className="flex flex-wrap gap-2 pl-4">
                      {value.roles?.map((role, i) => (
                        <Chip key={i} radius="sm">
                          {role}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={() => onClose?.('clear')}>
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
