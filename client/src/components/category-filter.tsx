import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CategoryFilterProps {
  categories: Array<{
    key: string;
    label: string;
    count?: number;
  }>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.key}
          onClick={() => onCategoryChange(category.key)}
          variant={activeCategory === category.key ? "default" : "outline"}
          className={
            activeCategory === category.key
              ? "bg-teal-600 hover:bg-teal-700 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-300"
          }
        >
          {category.label}
          {category.count !== undefined && (
            <Badge 
              variant="secondary" 
              className="ml-2 text-xs"
            >
              {category.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}
