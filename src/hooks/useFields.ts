import { useState, useEffect } from 'react';
import { Field } from '../types';
import { MOCK_FIELDS } from '../services/api';

export const useFields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchFields = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setFields(MOCK_FIELDS);
      setLoading(false);
    };
    fetchFields();
  }, []);

  return { fields, loading };
};
