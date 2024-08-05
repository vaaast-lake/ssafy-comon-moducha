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
      onClick={() => setCurrentTab('total')}
      value="total"
      currentTab={currentTab}
    >
      전체
    </TabButton>
    <TabButton
      className="h-8"
      onClick={() => setCurrentTab('progress')}
      value="progress"
      currentTab={currentTab}
    >
      모집
    </TabButton>
    <TabButton
      className="h-8"
      onClick={() => setCurrentTab('end')}
      value="end"
      currentTab={currentTab}
    >
      종료
    </TabButton>
  </>
);

export default TeatimeListToggle;
