import {
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
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ORGANISING_CLUB_MAP } from '../../../constants';

const eventTypes = [
  { label: 'Solo', value: 'solo' },
  { label: 'Group', value: 'group' },
];

const CreateEventForm: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { register, handleSubmit, control } = useForm<{
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
  }>({
    defaultValues: {
      title: '',
      description: '',
      rules: '**No rules**',
      venue: '',
      prize: '',
      tagLine: '',
      eventType: 'solo',
      participants: [1, 5],
      eventPriceForKGEC: 0,
      eventPriceForOthers: 0,
      otherPlatformUrl: '',
      eventOrganiserClub: '',
    },
  });
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
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
              {...register('title', { required: true })}
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
            />

            <Textarea
              {...register('description', { required: true })}
              isRequired
              label="Description"
              placeholder="Enter your description"
              labelPlacement="outside"
              size="lg"
              required
              description="Enter valid description not more that 250 words"
              maxRows={15}
              classNames={{
                mainWrapper: 'my-4',
              }}
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
                    className="!rounded-2xl !bg-default-100 !shadow-none dark"
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
              {...register('venue', { required: true })}
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
            />

            <div className="mb-10 mt-2 max-w-sm space-y-4">
              <DateRangePicker labelPlacement="outside" label="Event Date" isRequired />
              <div className="flex gap-2">
                <TimeInput isRequired labelPlacement="outside" label="Start Time" />
                <TimeInput isRequired labelPlacement="outside" label="End Time" />
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

            <div className="mb-4 mt-6 space-y-1">
              <Controller
                key={'participants'}
                name="participants"
                control={control}
                render={({ field }) => (
                  <Slider
                    size="md"
                    step={1}
                    color="foreground"
                    label="No of participants allowed"
                    showSteps={true}
                    maxValue={6}
                    minValue={1}
                    defaultValue={[2, 5]}
                    classNames={{
                      label: 'text-default-500 text-medium',
                    }}
                    onChange={(e) => field.onChange(e)}
                  />
                )}
              />

              <p className="text-sm text-default-500">Selected participants: 2 (min) to 5 (max)</p>
            </div>

            <Controller
              key={'eventOrganiserClub'}
              name="eventOrganiserClub"
              control={control}
              render={({ field }) => (
                <Select
                  isRequired
                  labelPlacement="outside"
                  size="lg"
                  placeholder="Select organising club"
                  classNames={{
                    mainWrapper: 'my-4 max-w-2xl',
                    popoverContent: 'text-foreground dark',
                  }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {Object.entries(ORGANISING_CLUB_MAP)
                    .filter(([key]) => key !== 'ALL')
                    .map(([key, value]) => {
                      return <SelectItem key={key}>{value}</SelectItem>;
                    })}
                </Select>
              )}
            />

            <Input
              {...register('eventPriceForKGEC')}
              type="number"
              label="Price for KGEC students"
              labelPlacement="outside"
              placeholder="Enter event price (KGEC)"
              required
              size="lg"
              defaultValue={'0'}
              classNames={{
                mainWrapper: 'my-4 max-w-xs',
              }}
            />

            <Input
              {...register('eventPriceForOthers', { required: true })}
              isRequired
              type="number"
              label="Price for other students"
              labelPlacement="outside"
              placeholder="Enter event price (non-KGEC)"
              required
              size="lg"
              defaultValue={'0'}
              classNames={{
                mainWrapper: 'my-4 max-w-xs',
              }}
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
