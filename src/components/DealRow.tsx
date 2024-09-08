import React from 'react';
import styles from '../styles/DealRow.module.css';
import { Deal } from '../types';
import DealDetails from './DealDetails';

interface DealRowProps {
  deal: Deal;
  isSelected: boolean;
  onClick: () => void;
}

const DealRow: React.FC<DealRowProps> = ({ deal, isSelected, onClick }) => {
  return (
    <>
      <tr
        className={styles.dealRow}
        onClick={onClick}
      >
        <td>{deal.id}</td>
        <td>{deal.name}</td>
        <td>{deal.price}</td>
      </tr>
      {isSelected && (
        <tr>
          <td colSpan={3}>
            <DealDetails dealId={deal.id} />
          </td>
        </tr>
      )}
    </>
  );
};

export default DealRow;
