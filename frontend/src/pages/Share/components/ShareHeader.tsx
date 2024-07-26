import ShareHeaderSearch from './ShareHeaderSearch';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction } from 'react';

interface Prop {
  sortOption: string;
  setSortOption: Dispatch<SetStateAction<string>>;
}

const ShareHeader = ({ sortOption, setSortOption }: Prop) => {
  return (
    <>
      <Disclosure as="div" className="justify-between w-full">
        <div className="flex justify-between">
          <DisclosureButton className="group relative inline-flex items-center justify-center btn md:hidden">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="h-6 w-6 group-data-[open]:hidden"
            />
            <XMarkIcon
              aria-hidden="true"
              className="hidden h-6 w-6 group-data-[open]:block"
            />
          </DisclosureButton>

          {/* md 이상인 경우 검색창 노출 */}
          <div className="hidden md:block">
            <ShareHeaderSearch className="join" />
          </div>
          <div className="flex justify-around">
            <button
              className={
                'hover:bg-tea rounded-full px-2 ' +
                (sortOption === 'latest' ? 'bg-tea' : '')
              }
              onClick={() => setSortOption('latest')}
            >
              최신 순
            </button>
            <button
              className={
                'hover:bg-tea rounded-full px-2 ' +
                (sortOption === 'deadline' ? 'bg-tea' : '')
              }
              onClick={() => setSortOption('deadline')}
            >
              마감일 순
            </button>
          </div>
        </div>

        {/* md 이하인 경우 검색창 collapse 패널 노출 */}
        <DisclosurePanel className="md:hidden">
          <ShareHeaderSearch className="join w-full mt-3" />
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};

export default ShareHeader;
