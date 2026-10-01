'use client';

import {ConfigProvider} from 'antd';

export function DesignProvider({children}: {children: React.ReactNode}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2D5A8D',
          colorInfo: '#2D5A8D',
          colorText: '#0E1B28',
          colorBorder: '#A4B3C6',
          borderRadius: 14,
          fontFamily: 'var(--font-noto-sans-thai), sans-serif'
        },
        components: {
          Tabs: {inkBarColor: '#2D5A8D', itemSelectedColor: '#2D5A8D'},
          Table: {headerBg: '#0A274D', headerColor: '#ffffff', rowHoverBg: '#F3F5F6'}
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
}
