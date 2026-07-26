const fs = require('fs');

const apiRoutes = [
  'src/app/api/admin/orders/route.ts',
  'src/app/api/admin/kyc/route.ts',
  'src/app/api/sellers/me/route.ts',
  'src/app/api/admin/stats/route.ts'
];

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    let content = fs.readFileSync(route, 'utf8');
    if (!content.includes('force-dynamic')) {
      content = `export const dynamic = 'force-dynamic';\n` + content;
      fs.writeFileSync(route, content);
    }
  }
});

let chatContent = fs.readFileSync('src/app/chat/page.tsx', 'utf8');
if (!chatContent.includes('ChatPageContent')) {
  chatContent = chatContent.replace(`import { useState, useEffect, useRef } from 'react';`, `import { useState, useEffect, useRef, Suspense } from 'react';`);
  chatContent = chatContent.replace(`export default function ChatPage() {`, `function ChatPageContent() {`);
  chatContent += `\n\nexport default function ChatPage() {\n  return (\n    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>\n      <ChatPageContent />\n    </Suspense>\n  );\n}\n`;
  fs.writeFileSync('src/app/chat/page.tsx', chatContent);
}

let cartContent = fs.readFileSync('src/app/cart/page.tsx', 'utf8');
if (!cartContent.includes('CartPageContent')) {
  cartContent = cartContent.replace(`import { useState, useEffect } from 'react';`, `import { useState, useEffect, Suspense } from 'react';`);
  cartContent = cartContent.replace(`export default function CartPage() {`, `function CartPageContent() {`);
  cartContent += `\n\nexport default function CartPage() {\n  return (\n    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>\n      <CartPageContent />\n    </Suspense>\n  );\n}\n`;
  fs.writeFileSync('src/app/cart/page.tsx', cartContent);
}

console.log("Fixes applied successfully.");
