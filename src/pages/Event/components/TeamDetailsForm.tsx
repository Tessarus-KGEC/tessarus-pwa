import useMeilisearch from '@/hooks/useMeilisearch';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, User } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoAdd, IoTrash } from 'react-icons/io5';
import { useAppSelector } from '../../../redux';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  minTeamSize: number;
  maxTeamSize: number;
  teamName: string;
  teamMembers: IUser[];
  setTeam: ([teamName, members]: [string, IUser[]]) => void;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  isFromKGEC: boolean;
  isVolunteer: boolean;
  profileImageUrl: string;
  espektroId: string;
}

const TeamDetailsForm: React.FC<IProps> = ({ isOpen, onClose, minTeamSize, maxTeamSize, teamName = '', teamMembers = [], setTeam }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [name, setName] = useState(teamName);
  const [members, setMembers] = useState<IUser[]>(teamMembers);
  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  //   const [bookTicket, { isLoading }] = useBookTicketMutation();

  const meiliClient = useMeilisearch();

  const searchMembers = async (query: string) => {
    const results = await meiliClient.index('users').search(query, {
      limit: 5,
    });
    setSearchResults(results.hits as IUser[]);
  };

  useEffect(() => {
    setName(teamName);
    setMembers(teamMembers);
  }, [teamName, teamMembers, isOpen]);

  useEffect(() => {
    if (isOpen && user && teamMembers.length === 0) {
      setMembers([
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          college: user.college,
          isFromKGEC: user.isFromKGEC,
          isVolunteer: user.isVolunteer,
          profileImageUrl: user.profileImageUrl,
          espektroId: user.espektroId,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    searchMembers(searchQuery);
  }, [searchQuery]);

  const handleClose = () => {
    setSearchQuery('');
    setName('');
    setMembers([]);
    onClose();
  };

  return (
    <Modal size="sm" isOpen={isOpen} onClose={handleClose} className="bg-default-50 text-default-foreground dark">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Team Details</ModalHeader>
        <ModalBody>
          <form>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
              type="text"
              label="Team Name"
              labelPlacement="outside"
              placeholder="Enter your team name"
              required
              description="Enter unique team name for your team"
              className="max-w-2xl"
              classNames={{
                mainWrapper: 'my-4',
              }}
            />
            <Tabs fullWidth>
              <Tab key={'1'} title="Members" className="">
                <ul className="h-[300px] space-y-3">
                  {members.length > 0 ? (
                    members.map((member) => (
                      <li className="flex items-center">
                        <User
                          name={member.name}
                          description={member.espektroId}
                          avatarProps={{
                            src: member.profileImageUrl,
                          }}
                        />
                        <Button
                          isIconOnly
                          color="danger"
                          variant="solid"
                          size="sm"
                          className="ml-auto"
                          onClick={() => {
                            setMembers((prev) => prev.filter((mem) => mem._id !== member._id));
                            toast.success(`Removed ${member.name} from the team`);
                          }}
                        >
                          <IoTrash size={20} />
                        </Button>
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-sm text-default-500">No members added</p>
                  )}
                </ul>
              </Tab>
              <Tab key={'2'} title="Add" className="w-full">
                <div className="h-[300px] space-y-4">
                  <Input type="text" placeholder="Search for users" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <ul className="space-y-3">
                    {searchResults.length > 0 ? (
                      searchResults
                        .filter((res) => !members.some((member) => member._id === res._id))
                        .map((user) => {
                          return (
                            <li className="flex items-center">
                              <User
                                name={user.name}
                                description={user.espektroId}
                                avatarProps={{
                                  src: user.profileImageUrl,
                                }}
                              />
                              <Button
                                isIconOnly
                                color="primary"
                                variant="solid"
                                size="sm"
                                className="ml-auto"
                                onClick={() => {
                                  if (members.length >= maxTeamSize) {
                                    toast.error(`Maximum team size is ${maxTeamSize}`);
                                    return;
                                  }
                                  setMembers([...members, user]);
                                  toast.success(`Added ${user.name} to the team`);
                                }}
                              >
                                <IoAdd size={23} />
                              </Button>
                            </li>
                          );
                        })
                    ) : (
                      <p className="text-center text-sm text-default-500">No user found</p>
                    )}
                  </ul>
                </div>
              </Tab>
            </Tabs>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={handleClose}>
            Clear Changes
          </Button>
          <Button
            color="primary"
            onClick={() => {
              if (name.trim() === '') {
                toast.error('Team name is required');
                return;
              }
              if (members.length < minTeamSize) {
                toast.error(`Minimum team size is ${minTeamSize}`);
                return;
              }
              setTeam([name, members]);
              handleClose();
            }}
          >
            {teamName ? 'Update Team' : 'Create Team'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TeamDetailsForm;
