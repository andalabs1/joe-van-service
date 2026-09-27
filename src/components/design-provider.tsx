'use client';

import {ConfigProvider} from 'antd';

export function DesignProvider({children}: {children: React.ReactNode}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#AF0C33',
          colorInfo: '#AF0C33',
          colorText: '#1a1a1a',
          colorBorder: '#dedede',
          borderRadius: 14,
          fontFamily: 'var(--font-prompt), sans-serif'
        },
        components: {
          Tabs: {inkBarColor: '#AF0C33', itemSelectedColor: '#AF0C33'},
          Table: {headerBg: '#1a1a1a', headerColor: '#ffffff', rowHoverBg: '#F5F5F5'}
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
}
