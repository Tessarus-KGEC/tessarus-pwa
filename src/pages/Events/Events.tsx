import { Button } from '@nextui-org/button';
import { FunctionComponent, useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import SearchBar from '../../components/SearchBar';
import Sheet from '../../components/Sheet';

const Events: FunctionComponent = () => {
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl">Ongoing Events</h1>
      <div className="flex gap-4">
        <SearchBar />

        <Button isIconOnly color="primary" aria-label="Like" onClick={() => setIsFilterOpened(!isFilterOpened)}>
          <IoFilter size={24} />
        </Button>
      </div>

      <Sheet open={isFilterOpened} onClose={() => setIsFilterOpened(false)}>
        <h1>Filter</h1>
      </Sheet>
    </section>
  );
};

export default Events;
