import ShareSearchForm from './ShareSearchForm';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ShareSearch = () => {
  return (
    <>
      <Disclosure as="div" className="justify-between w-full">
        <div className="flex justify-between">
          <DisclosureButton className="group relative inline-flex items-center justify-center btn xl:hidden">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="h-6 w-6 group-data-[open]:hidden"
            />
            <XMarkIcon
              aria-hidden="true"
              className="hidden h-6 w-6 group-data-[open]:block"
            />
          </DisclosureButton>
          <div className="hidden xl:block">
            <ShareSearchForm />
          </div>
          <div className="flex justify-around">
            <button className="hover:bg-tea rounded-full px-2">최신 순</button>
            <button className="hover:bg-tea rounded-full px-2">
              마감일 순
            </button>
          </div>
        </div>
        <div className="hidden xl:block"></div>
        <DisclosurePanel className="xl:hidden">
          <ShareSearchForm />
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};

export default ShareSearch;
