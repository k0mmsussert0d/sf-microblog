import React, {ReactElement, useState} from 'react';
import {Generic, Tab as RbxTab, Content} from 'rbx';


export interface TabsProps {
  children: ReactElement<TabsTabComponent>[]
}

export interface TabsTabProps {
  name: string
  children: ReactElement | ReactElement[]
}

type TabsComponent = React.FC<TabsProps> & { Tab: TabsTabComponent };
type TabsTabComponent = React.FC<TabsTabProps>;

const Tabs: TabsComponent = ({children}: TabsProps): ReactElement => {

  const [activeTab, setActiveTab] = useState<ReactElement>(children[0]);

  return (
    <>
      <RbxTab.Group kind='boxed'>
        {children.map(child => {
          return (
            <RbxTab
              key={child.props.name}
              active={child === activeTab}
              size='medium'
              onClick={() => setActiveTab(child)}
            >
              {child.props.name}
            </RbxTab>
          );
        })}
      </RbxTab.Group>
      <Generic>
        {activeTab}
      </Generic>
    </>
  );
};

const Tab: TabsTabComponent = ({children}: TabsTabProps): ReactElement => {

  return (
    <Content>
      {children}
    </Content>
  );
};

Tabs.Tab = Tab;

export default Tabs;
