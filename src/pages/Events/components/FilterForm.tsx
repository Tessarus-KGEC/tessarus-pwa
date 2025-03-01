import { parseDate } from '@internationalized/date';
import { Button } from '@nextui-org/button';
import { DateRangePicker } from '@nextui-org/date-picker';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { Checkbox, CheckboxGroup, Divider } from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/select';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import Sheet from '../../../components/Sheet';
import { ORGANISING_CLUB_MAP } from '../../../constants';

const eventPricing = [
  { label: 'All', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Paid', value: 'paid' },
];

const eventOptions = [
  { label: 'All', value: 'all' },
  { label: 'Past Events', value: 'past' },
  { label: 'Ongoing Events', value: 'ongoing' },
  { label: 'Upcoming Events', value: 'upcoming' },
];

const FilterForm: React.FC<{
  isFilterOpened: boolean;
  setIsFilterOpened: (value: boolean) => void;
}> = ({ isFilterOpened, setIsFilterOpened }) => {
  const [searchParams, setURLSearchParams] = useSearchParams();

  const { control, register, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      eventDate: searchParams.get('startDate') ? [new Date(searchParams.get('startDate') as string)] : [],
      organisingClub: searchParams.get('organisingClub') || 'ALL',
      eventPricing: searchParams.get('eventPricing') || 'all',
      eventTypes: searchParams.get('status') || 'all',
    },
  });

  return (
    <Sheet open={isFilterOpened}>
      <form
        className="flex h-full flex-col gap-4 py-6"
        onSubmit={handleSubmit((data) => {
          console.log(data);
          setURLSearchParams(
            Object.fromEntries(
              Object.entries({
                status: data.eventTypes,
                eventPricing: data.eventPricing,
                organisingClub: data.organisingClub,
                eventDate: data.eventDate.map((d) => (d as Date)?.toISOString()).join(','),
              }).filter(([key, v]) => {
                if (key === 'organisingClub') return v !== 'ALL';
                if (key === 'eventPricing') return v !== 'all';
                if (key === 'status') return v !== 'all';
                if (key === 'eventDate') return v.length;
                return v !== undefined || v;
              }),
            ),
          );

          setIsFilterOpened(false);
        })}
      >
        <h2 className="px-6 text-xl">Filters</h2>
        <Divider />
        <div className="flex flex-1 flex-col gap-y-8 overflow-y-auto px-6">
          <RadioGroup label="Select event pricing" defaultValue={getValues().eventPricing}>
            {eventPricing.map((option) => (
              <Controller
                name="eventPricing"
                control={control}
                render={({ field }) => (
                  <Radio key={option.value} value={option.value} onChange={(e) => field.onChange(e.target.value)}>
                    {option.label}
                  </Radio>
                )}
              />
            ))}
          </RadioGroup>

          <RadioGroup label="Select event type" defaultValue={getValues().eventTypes} orientation="vertical">
            {eventOptions.map((option) => (
              <Controller
                name="eventTypes"
                control={control}
                render={({ field }) => (
                  <Radio key={option.value} value={option.value} onChange={(e) => field.onChange(e.target.value)}>
                    {option.label}
                  </Radio>
                )}
              />
            ))}
          </RadioGroup>

          {/* <CheckboxGroup label="Select event type" defaultValue={getValues().eventTypes}>
            {eventOptions.map((option) => (
              <Controller
                name="eventTypes"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    key={option.value}
                    value={option.value}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...field.value, option.value]);
                      } else {
                        field.onChange(field.value.filter((v) => v !== option.value));
                      }
                    }}
                  >
                    {option.label}
                  </Checkbox>
                )}
              />
            ))}
          </CheckboxGroup> */}

          <Select
            label="Select organising club"
            className="max-w-xs"
            labelPlacement="outside"
            defaultSelectedKeys={[getValues().organisingClub]}
            description="For filtering events based on organising club"
            classNames={{
              label: ['text-medium', '!text-default-500'],
              popoverContent: ['text-foreground dark'],
            }}
            {...register('organisingClub')}
          >
            {Object.entries(ORGANISING_CLUB_MAP).map(([key, value]) => (
              <SelectItem key={key}>{value}</SelectItem>
            ))}
          </Select>

          {/* <Controller
            key={'eventDate'}
            name="eventDate"
            control={control}
            render={({ field }) => (
              <DateRangePicker
                label="Select event date"
                labelPlacement={'outside'}
                description={'For filtering events based on range of dates'}
                classNames={{
                  label: ['text-medium', '!text-default-500'],
                }}
                defaultValue={
                  field.value?.length === 2
                    ? {
                        start: parseDate(field.value[0]?.toISOString().split('T')[0]),
                        end: parseDate(field.value[1]?.toISOString().split('T')[0]),
                      }
                    : undefined
                }
                onChange={(date) => field.onChange([date.start.toDate('+05:30'), date.end.toDate('+05:30')])}
              />
            )}
          /> */}
        </div>
        {/* <Divider /> */}
        <div className="flex gap-2 px-6">
          <Button
            className="flex-1"
            color="danger"
            onClick={() => {
              setURLSearchParams(new URLSearchParams());
              reset({
                eventDate: [],
                organisingClub: 'ALL',
                eventPricing: 'all',
                eventTypes: 'all',
              });
              setIsFilterOpened(false);
            }}
          >
            Clear filters
          </Button>
          <Button className="flex-1" color="primary" type="submit">
            Apply filters
          </Button>
        </div>
      </form>
    </Sheet>
  );
};

export default FilterForm;
