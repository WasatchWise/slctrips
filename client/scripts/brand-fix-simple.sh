#!/bin/bash
# Simple brand fixer using sed and find (no dependencies required)

OK_TAGLINE="From Salt Lake, to Everywhere"
OK_COUNT="1 Airport * 1000+ Destinations"

echo "Running brand fixer..."

# Fix tagline variations (missing comma)
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.html" \) -exec sed -i '' 's/From Salt Lake to Everywhere/From Salt Lake, to Everywhere/g' {} \;

# Fix destination count variations
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/700+ destinations/1 Airport * 1000+ Destinations/g' {} \;
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/700 destinations/1 Airport * 1000+ Destinations/g' {} \;
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/739+ destinations/1 Airport * 1000+ Destinations/g' {} \;
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/1,057+ destinations/1 Airport * 1000+ Destinations/g' {} \;
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/995+ destinations/1 Airport * 1000+ Destinations/g' {} \;
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/+1000 Places/1 Airport * 1000+ Destinations/g' {} \;
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/+1000 Destinations/1 Airport * 1000+ Destinations/g' {} \;

# Fix index.html
sed -i '' 's/1,057 destinations/1 Airport * 1000+ Destinations/g' index.html 2>/dev/null

echo "Brand fixer complete!"
