import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/DealDetails.module.css';
import { DealDetailsType } from '../types';
import { ACCESS_TOKEN } from '../config'; // Все еще используем конфигурацию для токена

interface DealDetailsProps {
  dealId: number;
}

const DealDetails: React.FC<DealDetailsProps> = ({ dealId }) => {
  const [deal, setDeal] = useState<DealDetailsType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDealDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/api/v4/leads/${dealId}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить детали сделки');
      }

      const data = await response.json();
      setDeal(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchDealDetails();
  }, [fetchDealDetails]);

  const getTaskStatusColor = (taskDate: string): string => {
    const today = new Date();
    const task = new Date(taskDate);

    if (task < today) return 'red';
    if (task.toDateString() === today.toDateString()) return 'green';
    return 'yellow';
  };

  return (
    <div className={styles.dealDetails}>
      {loading ? (
        <p>Загрузка...</p>
      ) : deal ? (
        <>
          <p>ID: {deal.id}</p>
          <p>Название: {deal.name}</p>
          <p>Бюджет: {deal.price}</p>
          <p>Дата: {new Date(deal.created_at).toLocaleDateString('ru-RU')}</p>
          <svg
            width='20'
            height='20'
            className={styles.statusCircle}
          >
            <circle
              cx='10'
              cy='10'
              r='10'
              fill={getTaskStatusColor(deal.task_date)}
            />
          </svg>
        </>
      ) : (
        <p>Детали недоступны</p>
      )}
    </div>
  );
};

export default DealDetails;
