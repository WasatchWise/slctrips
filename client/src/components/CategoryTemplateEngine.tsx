import React from 'react';
import { DestinationTemplateType, getTemplateColors, getTemplateStrategicRole } from '../utils/destination-template-detector';
import { detectDestinationTemplate } from '../utils/destination-template-detector';
import { Destination } from '../types/destination-types';

// Import all template components
import OutdoorAdventureTemplate from './category-templates/OutdoorAdventureTemplate';
import CulturalHeritageTemplate from './category-templates/CulturalHeritageTemplate';
import FoodDrinkTemplate from './category-templates/FoodDrinkTemplate';
import ArtsEntertainmentTemplate from './category-templates/ArtsEntertainmentTemplate';
import MovieMediaTemplate from './category-templates/MovieMediaTemplate';
import HiddenGemsTemplate from './category-templates/HiddenGemsTemplate';
import SeasonalEventsTemplate from './category-templates/SeasonalEventsTemplate';
import QuickEscapesTemplate from './category-templates/QuickEscapesTemplate';
import YouthFamilyTemplate from './category-templates/YouthFamilyTemplate';

interface CategoryTemplateEngineProps {
  destination: Destination;
}

// Helper function to get category details
const getCategoryDetails = (destination: Destination) => {
  const templateType = detectDestinationTemplate(destination);
  
  return {
    primaryCategory: templateType,
    subcategory: destination.subcategory || ''
  };
};

// Helper function to get strategic role
const getStrategicRole = (primaryCategory: DestinationTemplateType, _subcategory: string) => {
  return getTemplateStrategicRole(primaryCategory);
};

// Helper function to get category colors
const getCategoryColors = (primaryCategory: DestinationTemplateType) => {
  return getTemplateColors(primaryCategory);
};

// Generic fallback template
const GenericDestinationTemplate: React.FC<{ destination: Destination }> = ({ destination }) => (
  <div className="generic-template">
    <h1>{destination.name}</h1>
    <p>{destination.description}</p>
    <p>Drive time: {destination.driveTime} minutes from SLC</p>
  </div>
);

export const CategoryTemplateEngine: React.FC<CategoryTemplateEngineProps> = ({ destination }) => {
  const { primaryCategory, subcategory } = getCategoryDetails(destination);
  const strategicRole = getStrategicRole(primaryCategory, subcategory);
  const themeColors = getCategoryColors(primaryCategory);
  
  // Enhanced props for all templates
  const templateProps = {
    destination,
    subcategory,
    strategicRole,
    primaryColor: themeColors.primary,
    secondaryColor: themeColors.secondary,
    accentColor: themeColors.accent
  };
  
  // Select template based on primary category
  switch (primaryCategory) {
    case 'outdoor-adventure':
      return (
        <OutdoorAdventureTemplate 
          {...templateProps}
        />
      );
      
    case 'cultural-heritage':
      return (
        <CulturalHeritageTemplate 
          {...templateProps}
        />
      );
      
    case 'food-drink':
      return (
        <FoodDrinkTemplate 
          {...templateProps}
        />
      );
      
    case 'arts-entertainment':
      return (
        <ArtsEntertainmentTemplate 
          {...templateProps}
        />
      );
      
    case 'movie-media':
      return (
        <MovieMediaTemplate 
          {...templateProps}
        />
      );
      
    case 'hidden-gems':
      return (
        <HiddenGemsTemplate 
          {...templateProps}
        />
      );
      
    case 'seasonal-events':
      return (
        <SeasonalEventsTemplate 
          {...templateProps}
        />
      );
      
    case 'quick-escapes':
      return (
        <QuickEscapesTemplate 
          {...templateProps}
        />
      );
      
    case 'youth-family':
      return (
        <YouthFamilyTemplate 
          {...templateProps}
        />
      );
      
    default:
      return <GenericDestinationTemplate destination={destination} />;
  }
};

export default CategoryTemplateEngine; 