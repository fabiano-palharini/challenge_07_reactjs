import React, { useState, useEffect } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: string;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [currentColumn, setCurrentColumn] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  function handleOrdering(
    columnToBeOrdered: 'title' | 'value' | 'category' | 'created_at',
  ): void {
    if (columnToBeOrdered === currentColumn) {
      const newTransactions = transactions.reverse();
      setCurrentColumn('');
      setTransactions(newTransactions);
      return;
    }

    const newTransactions = transactions.sort((x, y) => {
      let sort = 0;
      if (columnToBeOrdered === 'value') sort = x.value - y.value;
      if (columnToBeOrdered === 'category')
        sort =
          x.category.title.toLowerCase() < y.category.title.toLowerCase()
            ? -1
            : 1;
      if (
        x[columnToBeOrdered].toString().toLowerCase() <
        y[columnToBeOrdered].toString().toLowerCase()
      )
        sort = -1;
      if (
        x[columnToBeOrdered].toString().toLowerCase() >
        y[columnToBeOrdered].toString().toLowerCase()
      )
        sort = 1;
      return sort;
    });

    setCurrentColumn(columnToBeOrdered);
    setTransactions(newTransactions);
  }

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get('/transactions');
      setTransactions(data.transactions);
      setBalance(data.balance);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {formatValue(Number(balance.income))}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(Number(balance.outcome))}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {formatValue(Number(balance.total))}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleOrdering('title')}>
                  Título
                  {currentColumn === 'title' ? (
                    <FiChevronUp color="#FF872C" size={20} />
                  ) : (
                    <FiChevronDown color="#FF872C" size={20} />
                  )}
                </th>
                <th onClick={() => handleOrdering('value')}>
                  Preço
                  {currentColumn === 'value' ? (
                    <FiChevronUp color="#FF872C" size={20} />
                  ) : (
                    <FiChevronDown color="#FF872C" size={20} />
                  )}
                </th>
                <th onClick={() => handleOrdering('category')}>
                  Categoria
                  {currentColumn === 'category' ? (
                    <FiChevronUp color="#FF872C" size={20} />
                  ) : (
                    <FiChevronDown color="#FF872C" size={20} />
                  )}
                </th>
                <th onClick={() => handleOrdering('created_at')}>
                  Data
                  {currentColumn === 'created_at' ? (
                    <FiChevronUp color="#FF872C" size={20} />
                  ) : (
                    <FiChevronDown color="#FF872C" size={20} />
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(
                ({
                  id,
                  title,
                  value,
                  type,
                  category,
                  created_at: formattedDate,
                }) => (
                  <tr key={id}>
                    <td className="title">{title}</td>
                    <td className={type}>
                      {type === 'outcome'
                        ? `- ${formatValue(value)}`
                        : formatValue(value)}
                    </td>
                    <td>{category.title}</td>
                    <td>{formatDate(formattedDate)}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
