import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');

let violationsCount = 0;

function reportViolation(file, message) {
  console.error(`\x1b[31m[ARCH-VIOLATION] in ${path.relative(SRC_DIR, file)}:\x1b[0m ${message}`);
  violationsCount++;
}

// Recursively traverse src directory
function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    } else {
      filelist.push(filePath);
    }
  });
  return filelist;
}

const allFiles = walkSync(SRC_DIR).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(SRC_DIR, file);

  // Rule 1: Mobile Isolation Zone (no importing Desktop components inside /mobile/)
  if (relPath.startsWith('mobile/')) {
    const desktopImportRegex = /import\s+.*\s+from\s+['"].*components\/desktop\/.*['"]/g;
    if (desktopImportRegex.test(content)) {
      reportViolation(file, 'Forbidden import of Desktop module inside Mobile division. Mobile components must remain fully isolated.');
    }

    // Rule 2: No multi-column raw grids (grid-cols-2+) in mobile components
    const gridColsRegex = /grid-cols-([2-9]|\d{2,})/g;
    if (gridColsRegex.test(content)) {
      reportViolation(file, 'Forbidden multi-column grid-cols-* found in mobile file. All mobile files must use single-column layouts.');
    }

    // Rule 3: No dual layout imports inside mobile
    if (content.includes('DesktopLayout')) {
      reportViolation(file, 'DesktopLayout import detected in mobile division. Layout bifurcation is prohibited in the mobile isolated zone.');
    }
  }

  // Rule 4: Prevent md:hidden as a primary mobile hidden switch
  if (content.includes('md:hidden') && !relPath.includes('AppLayoutController') && !relPath.includes('App.tsx')) {
    // Basic warning for nested files trying to mask desktop elements via tailwind classes instead of structural unmounting
    if (content.includes('data-desktop-only') || content.includes('data-desktop-sidebar')) {
      reportViolation(file, 'Forbidden usage of md:hidden paired with desktop flags. Unrequested components must be unmounted at layout level, not styled hidden.');
    }
  }

  // Rule 5: No importing /mobile/ components inside /components/desktop/
  if (relPath.startsWith('components/desktop/')) {
    const mobileImportRegex = /import\s+.*\s+from\s+['"].*mobile\/.*['"]/g;
    if (mobileImportRegex.test(content)) {
      reportViolation(file, 'Forbidden import of Mobile module inside Desktop layout tree.');
    }
  }
});

if (violationsCount > 0) {
  console.error(`\x1b[31mArchitecture verification failed with ${violationsCount} violations.\x1b[0m`);
  process.exit(1);
} else {
  console.log('\x1b[32m✔ Architecture validation passed successfully! No boundary leaks detected.\x1b[0m');
  process.exit(0);
}
