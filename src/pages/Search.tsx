import React from 'react';
import { MOCK_FIELDS } from '../services/api';

import { FieldCard } from '../components/fields/FieldCard';
import { FieldFilter } from '../components/fields/FieldFilter';
import { FieldSearch } from '../components/fields/FieldSearch';

const SearchPage: React.FC = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <FieldFilter />

        {/* Results Area */}
        <div className="flex-1 space-y-8">
          <FieldSearch count={MOCK_FIELDS.length} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {MOCK_FIELDS.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
