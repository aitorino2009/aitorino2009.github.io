---
name: crear_sistema_archivos_virtual
description: Implementa un Virtual File System (vFS) navegable en Vanilla JS.
---

# Skill: Crear Sistema de Archivos Virtual (vFS) interactivo en Javascript Vanilla

Esta skill documenta el patrón para transformar un input de texto en una consola de comandos simulada con capacidad de navegación por directorios.

## 1. El Árbol (JSON)
El sistema de archivos se representa como un objeto anidado. Las claves son nombres de archivos o carpetas.
- Si el valor es un `string`, se considera un archivo (`cat`).
- Si el valor es un `Object`, se considera un directorio (`cd`, `ls`).

```javascript
const VFS = {
  "home": {
    "user": {
      "readme.txt": "Contenido del archivo",
      "proyectos": {}
    }
  }
};
```

## 2. El Estado
Necesitamos mantener un array de strings que represente la ruta absoluta actual, donde un array vacío representa la raíz o el home del usuario (ej. `~`).

```javascript
let currentPath = []; // Representa "~"
```

## 3. Resolución de Rutas
La pieza clave es una función que interpreta comandos como `cd ../../carpeta` o `cat /home/user/readme.txt`.

```javascript
function resolvePath(targetStr, currentPath, vfsRoot) {
  if (!targetStr) return { node: vfsRoot, isDir: true, error: null };
  
  let tempPath = [...currentPath];
  if (targetStr.startsWith('/')) tempPath = []; // Ruta absoluta
  if (targetStr.startsWith('~')) tempPath = []; // Home alias

  const parts = targetStr.split('/').filter(p => p !== '' && p !== '.');
  
  let currentNode = vfsRoot;
  for (let i = 0; i < tempPath.length; i++) {
    currentNode = currentNode[tempPath[i]];
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === '..') {
      if (tempPath.length > 0) {
        tempPath.pop();
        // Recalcular currentNode
        currentNode = vfsRoot;
        for (let p of tempPath) currentNode = currentNode[p];
      }
    } else {
      if (typeof currentNode === 'object' && currentNode !== null && part in currentNode) {
        currentNode = currentNode[part];
        tempPath.push(part);
      } else {
        return { error: `No such file or directory` };
      }
    }
  }

  return { 
    node: currentNode, 
    isDir: typeof currentNode === 'object', 
    resolvedPath: tempPath,
    error: null
  };
}
```

## 4. Comandos Básicos
* `ls`: Llama a `resolvePath`. Si `isDir`, imprime `Object.keys(node)`. Diferencia los colores si el valor del key es string u object.
* `cd`: Llama a `resolvePath`. Si `!error` y `isDir`, actualiza `currentPath = resolvedPath`.
* `cat`: Llama a `resolvePath`. Si `!error` y `!isDir`, imprime `node`. Si `isDir`, error "Is a directory".

## 5. Autocompletado Sensible al Contexto (Opcional)
Para autocompletar, si el argumento actual contiene una `/`, sepáralo en carpeta base y prefijo. Resuelve la carpeta base, obtén sus claves, e itera buscando prefijos. Imprime coincidencias.
