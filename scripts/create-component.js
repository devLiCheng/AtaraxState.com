const fs = require('fs');
const path = require('path');

// Get component path from arguments
const componentPathArg = process.argv[2];

if (!componentPathArg) {
  console.error('Please specify the component path. E.g. node scripts/create-component.js web/src/components/Header');
  process.exit(1);
}

const targetDir = path.resolve(process.cwd(), componentPathArg);
const componentName = path.basename(targetDir);

// Subfolders required by SKILL.MD
const subfolders = [
  'components',
  'utils',
  'store',
  'hooks',
  'api',
  'images'
];

// Ensure parent directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Create subfolders
subfolders.forEach(folder => {
  const folderPath = path.join(targetDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    // Write an empty placeholder .gitkeep to keep empty directories tracked if needed
    fs.writeFileSync(path.join(folderPath, '.gitkeep'), '');
  }
});

// Create index.less
const lessPath = path.join(targetDir, 'index.less');
if (!fs.existsSync(lessPath)) {
  fs.writeFileSync(lessPath, `/* Style for ${componentName} */\n`);
  console.log(`Created: ${lessPath}`);
}

// Create index.tsx
const tsxPath = path.join(targetDir, 'index.tsx');
if (!fs.existsSync(tsxPath)) {
  const template = `import React from 'react';
import './index.less';

export interface ${componentName}Props {
  className?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ className }) => {
  return (
    <div className={\`atarax-${componentName.toLowerCase()} \${className || ''}\`}>
      <h3>${componentName} Component</h3>
    </div>
  );
};

export default ${componentName};
`;
  fs.writeFileSync(tsxPath, template);
  console.log(`Created: ${tsxPath}`);
}

console.log(`Successfully created component ${componentName} structure at: ${targetDir}`);
