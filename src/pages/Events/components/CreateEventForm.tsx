import {
  Avatar,
  Button,
  DateRangePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Slider,
  Textarea,
  TimeInput,
} from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/select';
import MDEditor, { commands } from '@uiw/react-md-editor';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import FileUploader from '../../../components/ImageUploader';
import { ORGANISING_CLUB_MAP } from '../../../constants';
import { useGetAllEventCoordinatorsQuery } from '../../../redux/api/user.slice';

const eventTypes = [
  { label: 'Solo', value: 'solo' },
  { label: 'Group', value: 'group' },
];

const CreateEventForm: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [eventCoverImage, setEventCoverImage] = useState<File | null>(null);

  const { data: eventCoordinatorsResp } = useGetAllEventCoordinatorsQuery(undefined, {
    skip: !open,
  });

  const { register, handleSubmit, control, formState, reset, watch } = useForm<{
    title: string;
    description: string;
    rules: string;
    venue: string;
    tagLine: string;
    prize: string;
    eventType: string;
    participants: number[];
    eventPriceForKGEC: number;
    eventPriceForOthers: number;
    otherPlatformUrl: string;
    eventOrganiserClub: string;
    eventDateRange: [Date, Date];
    eventStartTime: Date;
    eventEndTime: Date;
    eventCoordinators: string[];
  }>({
    defaultValues: {
      title: '',
      description: '',
      rules: '**No rules**',
      venue: '',
      prize: '',
      tagLine: '',
      eventType: 'solo',
      participants: [1, 2],
      eventPriceForKGEC: 0,
      eventPriceForOthers: 10,
      otherPlatformUrl: '',
      eventOrganiserClub: '',
      eventCoordinators: [],
    },
  });

  const watchValues = watch();
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        reset();
        onClose();
      }}
      size="full"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeInOut',
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeInOut',
            },
          },
        },
      }}
      className="bg-default-50 text-default-foreground dark"
    >
      <ModalContent>
        <ModalHeader>
          <h1 className="text-2xl font-normal">Create Event</h1>
        </ModalHeader>
        <ModalBody className="overflow-auto border-red-500">
          <form>
            <Input
              {...register('title', { required: 'Title is required for event' })}
              isRequired
              type="text"
              label="Event Title"
              labelPlacement="outside"
              placeholder="Enter your event title"
              required
              size="lg"
              description="Title should be unique and descriptive"
              className="max-w-2xl"
              classNames={{
                mainWrapper: 'my-4',
              }}
              isInvalid={!!formState.errors.title}
              errorMessage={formState.errors.title?.message}
            />

            <Textarea
              {...register('description', { required: 'Description is required for event' })}
              isRequired
              label="Description"
              placeholder="Enter your description"
              labelPlacement="outside"
              size="lg"
              required
              description="Enter valid description not more that 250 words"
              maxRows={15}
              className="max-w-4xl"
              classNames={{
                mainWrapper: 'my-4',
              }}
              isInvalid={!!formState.errors.description}
              errorMessage={formState.errors.description?.message}
            />

            <div className="mb-10 mt-4 space-y-2">
              <label className="text-medium">Event Rules</label>
              <Controller
                key={'rules'}
                name="rules"
                control={control}
                render={({ field }) => (
                  // applying styles from global css
                  <MDEditor
                    className="max-w-4xl !rounded-2xl !bg-default-100 !shadow-none dark"
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                    preview="edit"
                    height={400}
                    commands={[
                      commands.bold,
                      commands.link,
                      commands.title1,
                      commands.title2,
                      commands.title3,
                      commands.orderedListCommand,
                      commands.unorderedListCommand,
                    ]}
                  />
                )}
              />
            </div>

            <Input
              {...register('venue', { required: 'Event venue is required' })}
              isRequired
              type="text"
              label="Event venue"
              labelPlacement="outside"
              placeholder="Enter your event venue"
              required
              size="lg"
              description="Enter valid venue"
              classNames={{
                mainWrapper: 'my-4 max-w-2xl',
              }}
              isInvalid={!!formState.errors.venue}
              errorMessage={formState.errors.venue?.message}
            />

            <div className="mb-10 mt-2 max-w-sm space-y-4">
              <Controller
                key={'eventDateRange'}
                name="eventDateRange"
                control={control}
                rules={{
                  required: 'Event date range is required',
                }}
                render={({ field }) => (
                  <DateRangePicker
                    labelPlacement="outside"
                    label="Event Date"
                    isRequired
                    onChange={(e) => {
                      field.onChange([e.start.toDate('+0530'), e.end.toDate('+0530')]);
                    }}
                    isInvalid={!!formState.errors.eventDateRange}
                    errorMessage={formState.errors.eventDateRange?.message}
                  />
                )}
              />
              <div className="flex gap-2">
                <Controller
                  key={'eventStartTime'}
                  name="eventStartTime"
                  control={control}
                  rules={{
                    required: 'Event start time is required',
                  }}
                  render={({ field }) => (
                    <TimeInput
                      isRequired
                      labelPlacement="outside"
                      label="Start Time"
                      onChange={(e) => field.onChange(e)}
                      isInvalid={!!formState.errors.eventStartTime}
                      errorMessage={formState.errors.eventStartTime?.message}
                    />
                  )}
                />
                <Controller
                  key={'eventEndTime'}
                  name="eventEndTime"
                  control={control}
                  rules={{
                    required: 'Event end time is required',
                  }}
                  render={({ field }) => (
                    <TimeInput
                      isRequired
                      labelPlacement="outside"
                      label="End Time"
                      onChange={(e) => field.onChange(e)}
                      isInvalid={!!formState.errors.eventEndTime}
                      errorMessage={formState.errors.eventEndTime?.message}
                    />
                  )}
                />
              </div>
            </div>

            <Input
              {...register('tagLine')}
              type="text"
              label="Event tagline"
              labelPlacement="outside"
              placeholder="Enter event tagline"
              size="lg"
              classNames={{
                mainWrapper: 'my-4 max-w-2xl',
              }}
            />

            <Input
              {...register('prize')}
              type="text"
              label="Event prizes"
              labelPlacement="outside"
              placeholder="Enter event prizes"
              size="lg"
              classNames={{
                mainWrapper: 'my-4 max-w-2xl',
              }}
            />

            <RadioGroup isRequired label="Select event type" orientation="horizontal" defaultValue={'solo'} classNames={{}}>
              {eventTypes.map((option) => (
                <Controller
                  key={'eventType'}
                  name="eventType"
                  control={control}
                  render={({ field }) => (
                    <Radio value={option.value} onChange={(e) => field.onChange(e.target.value)}>
                      {option.label}
                    </Radio>
                  )}
                />
              ))}
            </RadioGroup>

            <div className="mb-4 mt-6 max-w-2xl space-y-1">
              <Controller
                key={'participants'}
                name="participants"
                control={control}
                render={({ field }) => (
                  <Slider
                    size="md"
                    step={1}
                    color="foreground"
                    label={`Participants: ${watchValues.participants[0]} (min) to ${watchValues.participants[1]} (max)`}
                    showSteps={true}
                    maxValue={6}
                    minValue={1}
                    defaultValue={[1, 2]}
                    classNames={{
                      label: 'text-default-500 text-medium',
                    }}
                    onChange={(e) => field.onChange(e)}
                  />
                )}
              />
            </div>

            <Controller
              key={'eventOrganiserClub'}
              name="eventOrganiserClub"
              control={control}
              rules={{
                required: 'Organising club is required',
              }}
              render={({ field }) => (
                <div className="mb-10 mt-6 max-w-2xl space-y-2">
                  <p>
                    Select organising club <span className="text-red-500">*</span>
                  </p>
                  <Select
                    isRequired
                    labelPlacement="outside"
                    size="lg"
                    placeholder="Select organising club"
                    classNames={{
                      popoverContent: 'text-foreground dark',
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    isInvalid={!!formState.errors.eventOrganiserClub}
                    errorMessage={formState.errors.eventOrganiserClub?.message}
                  >
                    {Object.entries(ORGANISING_CLUB_MAP)
                      .filter(([key]) => key !== 'ALL')
                      .map(([key, value]) => {
                        return <SelectItem key={key}>{value}</SelectItem>;
                      })}
                  </Select>
                </div>
              )}
            />

            <Input
              {...register('eventPriceForKGEC', { valueAsNumber: true })}
              type="number"
              label="Price for KGEC students ( ₹ )"
              labelPlacement="outside"
              placeholder="Enter event price (KGEC)"
              required
              size="lg"
              classNames={{
                mainWrapper: 'my-4 max-w-xs',
              }}
            />

            <Input
              {...register('eventPriceForOthers', { required: 'Event price for non KGECians is required', valueAsNumber: true })}
              isRequired
              type="number"
              label="Price for other students ( ₹ )"
              labelPlacement="outside"
              placeholder="Enter event price (non-KGEC)"
              required
              size="lg"
              classNames={{
                mainWrapper: 'my-4 max-w-xs',
              }}
              isInvalid={!!formState.errors.eventPriceForOthers}
              errorMessage={formState.errors.eventPriceForOthers?.message}
            />
            <Input
              {...register('otherPlatformUrl')}
              type="text"
              label="Other platform url"
              labelPlacement="outside"
              placeholder="Enter other platform url"
              required
              size="lg"
              description="Enter valid platform url"
              classNames={{
                mainWrapper: 'my-4 max-w-2xl',
              }}
            />

            {eventCoordinatorsResp?.status === 200 ? (
              <Controller
                key={'eventCoordinators'}
                name="eventCoordinators"
                control={control}
                render={({ field }) => (
                  <div className="mb-8 mt-2 max-w-2xl space-y-2">
                    <p>Select event coordinators</p>
                    <Select
                      isRequired
                      labelPlacement="outside"
                      size="lg"
                      selectionMode="multiple"
                      placeholder="Select event coordinators"
                      classNames={{
                        popoverContent: 'text-foreground dark',
                      }}
                      onSelectionChange={(val) => {
                        field.onChange(Array.from(val));
                      }}
                      isInvalid={!!formState.errors.eventOrganiserClub}
                      errorMessage={formState.errors.eventOrganiserClub?.message}
                    >
                      {eventCoordinatorsResp.data.length > 0 ? (
                        eventCoordinatorsResp.data.map((user) => {
                          return (
                            <SelectItem key={user._id} textValue={user.name}>
                              <div className="flex items-center gap-2">
                                <Avatar alt={user.name} className="flex-shrink-0" size="sm" src={user.profileImageUrl} />
                                <div className="flex flex-col">
                                  <span className="text-small">{user.name}</span>
                                  <span className="text-tiny text-default-400">{user.email}</span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })
                      ) : (
                        <SelectItem key={'not-found'}>No coordinators found</SelectItem>
                      )}
                    </Select>
                  </div>
                )}
              />
            ) : null}

            <div className="my-4 space-y-2">
              <p>Event Cover Image</p>
              {eventCoverImage ? (
                <div className="group relative w-fit">
                  <div
                    className="absolute right-4 top-4 z-10 w-fit"
                    onClick={() => {
                      setEventCoverImage(null);
                    }}
                  >
                    <IoClose size={25} className="cursor-pointer" />
                  </div>
                  <img
                    src={URL.createObjectURL(eventCoverImage)}
                    alt="event cover image"
                    className="max-w-2xl transition-all group-hover:opacity-60"
                  />
                </div>
              ) : (
                <FileUploader
                  acceptedFileTypes={['Image']}
                  onFileDrop={(files) => {
                    setEventCoverImage(files[0]);
                  }}
                />
              )}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onClick={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit((data) => {
              console.log(data);
            })}
          >
            Create Event
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateEventForm;
