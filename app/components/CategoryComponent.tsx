import * as React from 'react';

type CategoryComponentProps = {
  category: string;
};
const CategoryComponent: React.FC<CategoryComponentProps> = ({category}) => {
  return (
    <div className="p-2">
      <h1 className="p-3 bg-yellow-300 border-b-4 border-b-amber-600 rounded-md">{category}</h1>
    </div>
  );
};

export default CategoryComponent;