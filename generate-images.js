const fs = require('fs');
const path = require('path');

// Using a simple SVG-based approach for placeholder images
const generatePetImage = (petName, category, index) => {
  const colors = {
    dogs: ['#FFB347', '#8B4513', '#D2691E', '#CD853F'],
    cats: ['#FFD700', '#FF8C00', '#FF6347', '#FFA500'],
    birds: ['#32CD32', '#00CED1', '#FF1493', '#FFD700'],
    fish: ['#00BFFF', '#1E90FF', '#00CED1', '#20B2AA'],
    rabbits: ['#FFB6C1', '#FFC0CB', '#FFDAB9', '#F0E68C'],
    hamsters: ['#D2B48C', '#CD853F', '#DEB887', '#F4A460'],
    reptiles: ['#228B22', '#32CD32', '#00AA00', '#6B8E23'],
    other: ['#9370DB', '#8A2BE2', '#BA55D3', '#DA70D6'],
  };

  const categoryColors = colors[category] || colors.other;
  const bgColor = categoryColors[index % categoryColors.length];

  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${Math.floor(Math.random()*16777215).toString(16)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad${index})"/>
      <circle cx="200" cy="150" r="80" fill="rgba(255,255,255,0.3)"/>
      <circle cx="200" cy="200" r="60" fill="rgba(255,255,255,0.2)"/>
      <text x="200" y="350" font-size="24" font-weight="bold" text-anchor="middle" fill="white" opacity="0.8">${petName}</text>
    </svg>
  `;

  return svg;
};

const generateSellerImage = (storeName, index) => {
  const colors = ['#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4'];
  const bgColor = colors[index % colors.length];

  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="seller${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${Math.floor(Math.random()*16777215).toString(16)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#seller${index})"/>
      <circle cx="100" cy="80" r="35" fill="rgba(255,255,255,0.3)"/>
      <rect x="60" y="120" width="80" height="60" fill="rgba(255,255,255,0.2)" rx="5"/>
      <text x="100" y="180" font-size="14" font-weight="bold" text-anchor="middle" fill="white" opacity="0.9">${storeName.charAt(0)}</text>
    </svg>
  `;

  return svg;
};

const generateBannerImage = (storeName, index) => {
  const colors = ['#22c55e', '#f59e0b', '#3b82f6', '#ec4899'];
  const bgColor = colors[index % colors.length];

  const svg = `
    <svg width="1200" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="banner${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${Math.floor(Math.random()*16777215).toString(16)};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <rect width="1200" height="300" fill="url(#banner${index})"/>
      <circle cx="100" cy="50" r="40" fill="rgba(255,255,255,0.2)"/>
      <circle cx="1100" cy="250" r="60" fill="rgba(255,255,255,0.15)"/>
      <rect x="50" y="120" width="300" height="80" fill="rgba(255,255,255,0.1)" rx="10"/>
      <text x="600" y="160" font-size="48" font-weight="bold" text-anchor="middle" fill="white" opacity="0.9">${storeName}</text>
    </svg>
  `;

  return svg;
};

// Generate pet images
const petData = [
  { name: 'Golden Retriever Puppy', category: 'dogs' },
  { name: 'Persian Cat', category: 'cats' },
  { name: 'African Grey Parrot', category: 'birds' },
  { name: 'German Shepherd', category: 'dogs' },
  { name: 'Siamese Kitten', category: 'cats' },
  { name: 'Betta Fish', category: 'fish' },
];

petData.forEach((pet, index) => {
  const svg = generatePetImage(pet.name, pet.category, index);
  const filename = `dog${index + 1}.jpg`.replace(/dog/, pet.category.slice(0, 3));
  fs.writeFileSync(path.join(__dirname, `public/pets/${filename}`), svg);
  console.log(`✓ Created public/pets/${filename}`);
});

// Generate seller images
const sellerData = [
  'Paws & Claws Store',
  'Pet Paradise',
  'Exotic Birds Hub',
  'Aqua World',
];

sellerData.forEach((seller, index) => {
  const svg = generateSellerImage(seller, index);
  fs.writeFileSync(path.join(__dirname, `public/sellers/seller${index + 1}.jpg`), svg);
  console.log(`✓ Created public/sellers/seller${index + 1}.jpg`);
});

// Generate banner images
sellerData.forEach((seller, index) => {
  const svg = generateBannerImage(seller, index);
  fs.writeFileSync(path.join(__dirname, `public/sellers/banner${index + 1}.jpg`), svg);
  console.log(`✓ Created public/sellers/banner${index + 1}.jpg`);
});

console.log('\n✅ All images generated successfully!');
