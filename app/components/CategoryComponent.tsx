import * as React from 'react';

type CategoryComponentProps = {
  category: string;
};
const CategoryComponent: React.FC<CategoryComponentProps> = ({category}) => {
  return (
    <div className="p-2">
      <h1 className="text-lg font-bold bg-yellow-300 px-2 rounded-md">{category}</h1>
    </div>
  );
};

export default CategoryComponent;