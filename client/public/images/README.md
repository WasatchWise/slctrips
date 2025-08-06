# SLCTrips Brand Images

This directory contains the official SLCTrips brand assets.

## Required Images

### 1. SLCTrips Logo (`slctrips-logo-wordmark.png`)
- **Description**: SLCTrips wordmark with map pin "i" design
- **Colors**: 
  - SLC: Sky Blue (#0082c9)
  - Trips: White (#ffffff)
  - Pin dot: Sunset Orange (#f8a023)
  - Pin gradient: Orange to Red (#f8a023 to #db3d0e)
- **Usage**: Website header, navigation, branding

### 2. Dan the Sasquatch (`dan-sasquatch-character.png`)
- **Description**: Dan the Wasatch Sasquatch - Official brand mascot
- **Character**: 7'2" friendly Sasquatch with navy blue fur, Pioneer Gold beard, Canyon Red beanie
- **Clothing**: Ranger Olive vest with SLCTrips badges
- **Accessories**: Binoculars, leather satchel, vintage camera, wooden walking stick
- **Usage**: Hero sections, brand storytelling, welcome messages

### 3. SLC Airport Logo (`slc-airport-logo.png`)
- **Description**: The New Salt Lake City Airport logo
- **Design**: Circular badge with light blue outer ring and deep purple inner circle
- **Graphics**: Orange mountain, light blue water line, white airplane silhouette
- **Text**: "THE NEW SALT LAKE CITY AIRPORT", "SLC", "FLY HEALTHY"
- **Usage**: Airport partnerships, travel information

## Image Specifications

- **Format**: PNG with transparency
- **Resolution**: High resolution (at least 2x for retina displays)
- **Background**: Transparent for logos, appropriate background for character
- **File Size**: Optimized for web (under 500KB each)

## Fallback Behavior

The site includes fallback mechanisms:
- Text-based logo if image fails to load
- Placeholder images for character
- Graceful degradation for missing assets

## Brand Colors

### Primary Colors
- Sky Blue: #0082c9
- Sunset Orange: #f8a023
- Gradient Orange: #db3d0e
- White: #ffffff

### Secondary Colors
- Canyon Red: #b33c1a
- Pioneer Gold: #f4b441
- Navy: #1a2b3b
- Ranger Olive: #78814A

## Implementation Notes

These images are referenced in:
- `client/src/components/clean-navigation.tsx` - Navigation logo
- `client/src/pages/landing.tsx` - Dan character on landing page
- `client/src/assets/images/logo-specification.json` - Brand specifications

The images should be placed in this directory and will be served from `/images/` path. 