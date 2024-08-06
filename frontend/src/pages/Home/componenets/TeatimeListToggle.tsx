import TabButton from '../../../components/Button/TabButton';

interface TeatimeListToggle {
  currentTab: string;
  setCurrentTab: (data: string) => void;
}

const TeatimeListToggle = ({
  currentTab,
  setCurrentTab,
}: TeatimeListToggle) => (
  <>
    <TabButton
      className="h-8"
      onClick={() => setCurrentTab('latest')}
      value="latest"
      currentTab={currentTab}
    >
      최신 순
    </TabButton>
    <TabButton
      className="h-8"
      onClick={() => setCurrentTab('urgent')}
      value="urgent"
      currentTab={currentTab}
    >
      마감 순
    </TabButton>
  </>
);

export default TeatimeListToggle;
