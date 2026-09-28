'use client';

import {Button, Table, Tabs, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {FiArrowRight} from 'react-icons/fi';
import {LuBusFront, LuCar} from 'react-icons/lu';
import {formatPrice} from '@/data/pricing';
import {
  vehicleGroups,
  type VehicleCategory,
  type VehiclePrices
} from '@/data/vehicle-pricing';

export type VehiclePriceTableRow = {
  key: string;
  label: string;
  detail?: string;
  prices: VehiclePrices;
  bookingUrl?: string;
};

type Labels = Record<VehicleCategory, string> & Record<(typeof vehicleGroups)[number]['key'], string>;

const groupIcons = {
  van: <LuBusFront aria-hidden="true" />,
  passengerCar: <LuCar aria-hidden="true" />
};

export function VehiclePriceTabs({
  rows,
  locale,
  labels,
  primaryLabel,
  secondaryLabel,
  quoteLabel,
  actionLabel
}: {
  rows: VehiclePriceTableRow[];
  locale: 'th' | 'en';
  labels: Labels;
  primaryLabel: string;
  secondaryLabel?: string;
  quoteLabel: string;
  actionLabel?: string;
}) {
  const baseColumns: ColumnsType<VehiclePriceTableRow> = [
    {
      title: primaryLabel,
      dataIndex: 'label',
      key: 'label',
      fixed: 'left',
      width: 190,
      render: (value: string) => <strong>{value}</strong>
    }
  ];

  if (secondaryLabel) {
    baseColumns.push({title: secondaryLabel, dataIndex: 'detail', key: 'detail', width: 110});
  }

  return (
    <Tabs
      className="vehicle-price-tabs"
      defaultActiveKey="van"
      items={vehicleGroups.map((group) => {
        const columns: ColumnsType<VehiclePriceTableRow> = [
          ...baseColumns,
          ...group.categories.map((category) => ({
            title: labels[category],
            key: category,
            width: 145,
            align: 'right' as const,
            render: (_: unknown, row: VehiclePriceTableRow) => {
              const price = row.prices[category];
              return price === null ? <Tag>{quoteLabel}</Tag> : <span className="antd-price">{formatPrice(price, locale)}</span>;
            }
          })),
          ...(actionLabel ? [{
            title: '', key: 'action', fixed: 'right' as const, width: 74,
            render: (_: unknown, row: VehiclePriceTableRow) => row.bookingUrl ? <Button type="primary" shape="circle" href={row.bookingUrl} aria-label={`${actionLabel} ${row.label}`} icon={<FiArrowRight />} /> : null
          }] : [])
        ];

        return {
          key: group.key,
          label: <span className="vehicle-tab-label">{groupIcons[group.key]}{labels[group.key]}</span>,
          children: <Table columns={columns} dataSource={rows} pagination={false} scroll={{x: 'max-content'}} size="middle" />
        };
      })}
    />
  );
}
