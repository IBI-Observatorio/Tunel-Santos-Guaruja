#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const scriptsDir = path.join(projectRoot, 'scripts');
const docsDir = path.join(projectRoot, 'docs');
const testsDir = path.join(projectRoot, 'tests');

// Criar pastas se não existirem
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
  console.log('✅ Criada pasta: docs/');
}

if (!fs.existsSync(testsDir)) {
  fs.mkdirSync(testsDir, { recursive: true });
  console.log('✅ Criada pasta: tests/');
}

// Padrões de arquivos para mover
const patterns = {
  scripts: {
    extensions: ['.py', '.js', '.sh'],
    excludePatterns: ['organize_files.js', 'server.js', 'vite.config.js', 'tailwind.config.js', 'postcss.config.js'],
    targetDir: scriptsDir
  },
  docs: {
    extensions: ['.md'],
    excludePatterns: ['README.md', 'README_DEPLOY.md'],
    targetDir: docsDir
  },
  tests: {
    patterns: ['.openai_config.json', '.openai_test_config.json', 'conversion_progress.json'],
    prefixes: ['test_'],
    extensions: [],
    targetDir: testsDir
  }
};

// Função para mover arquivo
function moveFile(oldPath, newPath) {
  try {
    // Verificar se o arquivo de destino já existe
    if (fs.existsSync(newPath)) {
      console.log(`⚠️  Arquivo já existe em destino: ${path.basename(newPath)}`);
      return false;
    }
    
    fs.renameSync(oldPath, newPath);
    console.log(`📦 Movido: ${path.basename(oldPath)} → ${path.relative(projectRoot, newPath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao mover ${path.basename(oldPath)}: ${error.message}`);
    return false;
  }
}

// Função principal
function organizeFiles() {
  console.log('🔍 Organizando arquivos na raiz do projeto...\n');
  
  let movedCount = 0;
  const rootFiles = fs.readdirSync(projectRoot);
  
  rootFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    
    // Ignorar diretórios
    if (fs.statSync(filePath).isDirectory()) {
      return;
    }
    
    // Verificar cada padrão
    for (const [category, config] of Object.entries(patterns)) {
      const fileExt = path.extname(file);
      const fileName = path.basename(file);
      
      // Verificar por padrões específicos de arquivo
      if (config.patterns && config.patterns.includes(fileName)) {
        const targetPath = path.join(config.targetDir, fileName);
        if (moveFile(filePath, targetPath)) {
          movedCount++;
        }
        break;
      }
      
      // Verificar por prefixos
      if (config.prefixes && config.prefixes.some(prefix => fileName.startsWith(prefix))) {
        const targetPath = path.join(config.targetDir, fileName);
        if (moveFile(filePath, targetPath)) {
          movedCount++;
        }
        break;
      }
      
      // Verificar por extensões
      if (config.extensions && config.extensions.includes(fileExt) && 
          (!config.excludePatterns || !config.excludePatterns.includes(fileName))) {
        const targetPath = path.join(config.targetDir, fileName);
        
        // Não mover arquivos que já estão na pasta scripts
        if (filePath.startsWith(scriptsDir)) {
          continue;
        }
        
        if (moveFile(filePath, targetPath)) {
          movedCount++;
        }
        break; // Arquivo processado, passar para o próximo
      }
    }
  });
  
  console.log(`\n✨ Organização concluída! ${movedCount} arquivo(s) movido(s).`);
}

// Executar
organizeFiles();