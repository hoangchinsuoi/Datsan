import { MOCK_FIELDS } from './api';

export const fieldService = {
  getFields: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_FIELDS;
  },
  getFieldById: async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_FIELDS.find(f => f.id === id);
  },
  searchFields: async (query: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_FIELDS.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
  }
};
