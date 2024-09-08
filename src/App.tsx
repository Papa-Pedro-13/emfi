import React, { useState, useEffect } from 'react';
import DealTable from './components/DealTable';
import { Deal } from './types';
import { ACCESS_TOKEN } from './config'; // Все еще используем конфигурацию для токена
import styles from './App.module.css';

const App: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      let page = 1;
      let allDeals: Deal[] = [];
      setLoading(true);

      while (true) {
        const response = await fetch(`/api/v4/leads?page=${page}&limit=3`, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error('Не удалось загрузить сделки');
        }

        const data = await response.json();
        if (data._embedded.leads.length === 0) break;
        allDeals = [...allDeals, ...data._embedded.leads];
        page++;
        await new Promise((r) => setTimeout(r, 1000)); // Ограничение в 3 запроса в секунду
      }

      setDeals(allDeals);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDealClick = (dealId: number) => {
    setSelectedDealId(selectedDealId === dealId ? null : dealId);
  };

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.title}>Таблица сделок</h1>
      {loading && <p className={styles.loading}>Загрузка...</p>}
      {!loading && (
        <DealTable
          deals={deals}
          onDealClick={handleDealClick}
          selectedDealId={selectedDealId}
        />
      )}
    </div>
  );
};

export default App;
