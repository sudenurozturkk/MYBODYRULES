import React from 'react';

interface RecipeCardProps {
  title: string;
  image?: string;
  description?: string;
  category?: string;
  onClick?: () => void;
}

const defaultImage =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  image,
  description,
  category,
  onClick,
}) => {
  return (
    <div
      className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer group"
      onClick={onClick}
    >
      <div className="h-40 w-full overflow-hidden">
        <img
          src={image || defaultImage}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">{title}</h3>
          {category && (
            <span className="px-2 py-1 bg-fitness-blue/10 text-fitness-blue dark:bg-fitness-green/10 dark:text-fitness-green rounded-full text-xs font-semibold">
              {category}
            </span>
          )}
        </div>
        {description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
