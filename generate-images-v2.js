const fs = require('fs');
const path = require('path');

// Create simple HTML files that can be converted to images
const createPetImage = (name, category, color, index) => {
  const html = `<!DOCTYPE html>
<html>
<head>
<style>
body { margin: 0; padding: 0; width: 400px; height: 400px; }
.container {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, ${color} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
}
.icon { font-size: 120px; margin-bottom: 20px; }
.name { color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 0 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
</style>
</head>
<body>
<div class="container">
  <div class="icon">${getEmoji(category)}</div>
  <div class="name">${name}</div>
</div>
</body>
</html>`;
  return html;
};

const createSellerLogo = (name, color, index) => {
  const initial = name.charAt(0);
  const html = `<!DOCTYPE html>
<html>
<head>
<style>
body { margin: 0; padding: 0; width: 200px; height: 200px; }
.container {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, ${color} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
}
.initial { color: white; font-size: 80px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
</style>
</head>
<body>
<div class="container">
  <div class="initial">${initial}</div>
</div>
</body>
</html>`;
  return html;
};

const createBanner = (name, color, index) => {
  const html = `<!DOCTYPE html>
<html>
<head>
<style>
body { margin: 0; padding: 0; width: 1200px; height: 300px; }
.container {
  width: 1200px;
  height: 300px;
  background: linear-gradient(135deg, ${color} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  position: relative;
  overflow: hidden;
}
.circle1 { position: absolute; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.1); top: -50px; left: 50px; }
.circle2 { position: absolute; width: 150px; height: 150px; border-radius: 50%; background: rgba(255,255,255,0.1); bottom: -30px; right: 100px; }
.name { color: white; font-size: 48px; font-weight: bold; text-shadow: 3px 3px 6px rgba(0,0,0,0.3); z-index: 10; }
</style>
</head>
<body>
<div class="container">
  <div class="circle1"></div>
  <div class="circle2"></div>
  <div class="name">${name}</div>
</div>
</body>
</html>`;
  return html;
};

function getEmoji(category) {
  const emojis = {
    dogs: '🐕',
    cats: '🐈',
    birds: '🦜',
    fish: '🐠',
    rabbits: '🐰',
    hamsters: '🐹',
    reptiles: '🦎',
    other: '🐾'
  };
  return emojis[category] || '🐾';
}

const petData = [
  { name: 'Golden Retriever', category: 'dogs', color: '#FFB347', file: 'dog1.html' },
  { name: 'Persian Cat', category: 'cats', color: '#FFD700', file: 'cat2.html' },
  { name: 'African Grey', category: 'birds', color: '#32CD32', file: 'bir3.html' },
  { name: 'German Shepherd', category: 'dogs', color: '#D2691E', file: 'dog4.html' },
  { name: 'Siamese Kitten', category: 'cats', color: '#FF8C00', file: 'cat5.html' },
  { name: 'Betta Fish', category: 'fish', color: '#00BFFF', file: 'fis6.html' },
];

const sellerData = [
  { name: 'Paws & Claws', color: '#22c55e', index: 1 },
  { name: 'Pet Paradise', color: '#f59e0b', index: 2 },
  { name: 'Exotic Birds', color: '#3b82f6', index: 3 },
  { name: 'Aqua World', color: '#ec4899', index: 4 },
];

console.log('Creating HTML templates...\n');

// Create pet images
petData.forEach((pet, index) => {
  const html = createPetImage(pet.name, pet.category, pet.color, index);
  fs.writeFileSync(path.join(__dirname, `public/pets/${pet.file}`), html);
  console.log(`✓ Created public/pets/${pet.file}`);
});

// Create seller logos
sellerData.forEach((seller) => {
  const html = createSellerLogo(seller.name, seller.color, seller.index);
  fs.writeFileSync(path.join(__dirname, `public/sellers/seller${seller.index}.html`), html);
  console.log(`✓ Created public/sellers/seller${seller.index}.html`);
});

// Create banners
sellerData.forEach((seller) => {
  const html = createBanner(seller.name, seller.color, seller.index);
  fs.writeFileSync(path.join(__dirname, `public/sellers/banner${seller.index}.html`), html);
  console.log(`✓ Created public/sellers/banner${seller.index}.html`);
});

console.log('\n✅ HTML templates created! Now using placeholder service for images...');
