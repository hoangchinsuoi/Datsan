import React from "react";

import { FieldCard } from "../components/fields/FieldCard";
import { FieldFilter } from "../components/fields/FieldFilter";
import { FieldSearch } from "../components/fields/FieldSearch";
import { useFields } from "../hooks/useFields";

const SearchPage: React.FC = () => {
  const { fields, loading, error } = useFields();

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <FieldFilter />

        <div className="flex-1">
          <FieldSearch count={fields.length} />
          {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
          {loading && <p className="text-on-surface-variant font-bold">Đang tải…</p>}
          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {fields.map((field) => (
                <FieldCard key={field.id} field={field} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
