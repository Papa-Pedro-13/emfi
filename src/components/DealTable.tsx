import React from 'react';
import DealRow from './DealRow';
import { Deal } from '../types';
import styles from '../styles/DealTable.module.css';

interface DealTableProps {
  deals: Deal[];
  onDealClick: (dealId: number) => void;
  selectedDealId: number | null;
}

const DealTable: React.FC<DealTableProps> = ({
  deals,
  onDealClick,
  selectedDealId,
}) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Бюджет</th>
        </tr>
      </thead>
      <tbody>
        {deals.map((deal) => (
          <DealRow
            key={deal.id}
            deal={deal}
            onClick={() => onDealClick(deal.id)}
            isSelected={selectedDealId === deal.id}
          />
        ))}
      </tbody>
    </table>
  );
};

export default DealTable;
