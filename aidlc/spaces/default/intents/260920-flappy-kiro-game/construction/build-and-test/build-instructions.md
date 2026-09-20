# Build Instructions — Flappy Kiro Game

## Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (typically bundled with Node.js)
- **Git**: For version control and repository operations (optional but recommended)

### Supported Platforms
- macOS (x86_64, Apple Silicon)
- Linux (Ubuntu 20.04+, Debian 12+, CentOS/RHEL 8+)
- Windows (WSL2 or native with Node.js for Windows)

### Browser Support (Target Deployment)
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14.1+
- Edge 90+

---

## Dependency Installation

### Step 1: Verify Node.js and npm

```bash
node --version    # Expected: v18.0.0 or higher
npm --version     # Expected: v9.0.0 or higher
```

If Node.js is not installed, download from https://nodejs.org/en/ and install the LTS version.

### Step 2: Install Project Dependencies

From the project root directory:

```bash
npm install
```

This will:
- Install all dependencies listed in `package.json`
- Generate a `node_modules/` directory with all packages
- Update `package-lock.json` to lock dependency versions

**Expected output:**
```
added X packages in Ys
```

**Key dependencies:**
- **vitest**: Test runner and framework (coverage-enabled)
- **jsdom**: Simulated DOM environment for test execution
- **@vitest/coverage-v8**: Code coverage analysis
- **vite**: Build bundler and development server
- **terser**: JavaScript minification for production builds

---

## Environment Setup

### Local Configuration

No environment variables are required for local development. The game is completely self-contained.

### Optional: Development Configuration

For development builds with debugging, the `vite.config.js` already includes:
- Source maps for browser debugging
- Development server on `http://localhost:5173` (default)
- Hot module reloading (HMR) during development

---

## Build Commands

### Development Build

```bash
npm run build
```

**What it does:**
1. Bundles all source files (`src/`) into a single JavaScript file
2. Outputs unminified code with source maps for debugging
3. Generates `dist/index.html` (static entry point) and `dist/game.js` (bundled code)
4. Preserves class and function names for easier debugging

**Output:**
```
dist/
  ├── index.html
  └── game.js
```

**File sizes (expected):**
- `game.js`: ~500 KB (unminified)

**Use case:** Local testing, debugging, development iterations

---

### Production Build

```bash
npm run build
```

**Note:** The same `npm run build` command in the current `package.json` generates the production bundle (Vite optimizes by default). For explicit minification:

```bash
npx terser dist/game.js -o dist/game.min.js -c -m
```

**What it does:**
1. Minifies JavaScript (removes whitespace, shortens variable names)
2. Removes dead code
3. Optimizes bundled dependencies
4. Produces a `.min.js` file suitable for deployment

**Output:**
```
dist/
  ├── index.html
  └── game.min.js          # Minified production build
```

**File sizes (expected):**
- `game.min.js`: ~120–150 KB (minified, before gzip)
- `game.min.js.gz`: ~35–45 KB (gzipped for deployment)

**Use case:** Production deployment, CDN distribution, performance optimization

---

## Build Verification Steps

### Step 1: Check Build Output

```bash
ls -lh dist/
```

**Expected output:**
```
-rw-r--r--  1 user  group   520K  Sep 20 12:34 game.js
-rw-r--r--  1 user  group    1.5K Sep 20 12:34 index.html
```

- `game.js` exists and is > 100 KB
- `index.html` exists and contains minimal HTML stub

### Step 2: Verify Entry Point

```bash
cat dist/index.html | head -20
```

**Expected content:**
- `<!DOCTYPE html>` declaration
- `<script src="./game.js"></script>` or equivalent module load
- Canvas element or game container div

### Step 3: Syntax Check (Optional)

```bash
node --check dist/game.js
```

**Expected output:**
```
(No output = syntax valid)
```

If syntax errors are present, the output will show the error location.

---

## Common Build Issues & Troubleshooting

### Issue: `npm install` fails with permission errors

**Cause:** `node_modules/` permissions are restricted or npm cache is corrupted

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# On macOS/Linux, if still failing:
sudo npm install
```

---

### Issue: `npm run build` fails with "ENOENT: no such file or directory"

**Cause:** Source files are missing or renamed

**Solution:**
```bash
# Verify source files exist
ls -la src/

# Verify vite.config.js exists
cat vite.config.js | head -5

# Rebuild with verbose output
npm run build -- --debug
```

---

### Issue: `dist/game.js` is too large (> 1 MB)

**Cause:** Dependencies not minified or duplicate code bundled

**Solution:**
```bash
# Analyze bundle size
npx vite build --analyze

# Use production minification
npx terser dist/game.js -o dist/game.min.js -c -m

# Check for duplicate requires
npm ls --all | grep 'DUPLICATE'
```

---

### Issue: Build succeeds but tests fail during execution

**Cause:** Runtime errors in bundled code not caught at build time

**Solution:**
- See "Test Execution" section below
- Run unit tests first to catch errors before bundling: `npm test`

---

## Build Artifacts

### Files Generated

After a successful build:

```
dist/
  ├── index.html              # HTML entry point (1–2 KB)
  │   └── Imports game.js as module
  │
  └── game.js                 # Bundled JavaScript (500 KB unminified)
      └── Contains all game logic, components, and embedded assets
```

### Asset Embedding

All assets (sprites, audio) are embedded as base64 data URIs within `game.js` to create a single-file deployment:

- **Ghosty sprite** (game character)
- **Wall sprites** (obstacles)
- **Background sprite**
- **Sound effects** (flap, point, collision, game-over)
- **Background music** (gameplay loop)

**No separate asset delivery required** — `dist/` can be deployed as-is.

---

## Deployment Preparation

### Pre-Deployment Checklist

Before deploying to production, verify:

- [ ] Build succeeds: `npm run build`
- [ ] All tests pass: `npm test`
- [ ] Coverage ≥80%: `npm run test:coverage`
- [ ] No console errors when running locally
- [ ] Game works in all target browsers (Chrome, Firefox, Safari, Edge)

### Static File Server Setup

Deploy `dist/` directory to any static file server:

**Option 1: GitHub Pages**
```bash
npm run build
git add dist/
git commit -m "Production build"
git push origin main
```

**Option 2: AWS S3 + CloudFront**
```bash
aws s3 sync dist/ s3://my-bucket/flappy-kiro/
```

**Option 3: Netlify**
```bash
netlify deploy --prod --dir=dist/
```

**Option 4: Local HTTP Server (testing)**
```bash
cd dist/
python3 -m http.server 8000
# Visit http://localhost:8000
```

---

## Development Workflow

### Local Development Server

```bash
npm run dev
```

**What it does:**
- Starts Vite dev server on `http://localhost:5173`
- Enables hot module reloading (changes refresh in browser instantly)
- Generates source maps for debugging
- Watches for file changes in `src/`

**Stop the server:** Press `Ctrl+C`

### Watch Mode (Testing During Development)

```bash
npm run test:unit:watch
```

**What it does:**
- Runs tests in watch mode
- Re-runs tests when any source or test file changes
- Useful for TDD workflow

---

## Build Performance Notes

### Build Times (Typical)
- **Development build:** 1–2 seconds
- **Production build:** 2–4 seconds
- **Minification (terser):** < 1 second

### File Size Targets
- **Unminified:** < 600 KB
- **Minified + gzipped:** < 50 KB (typical)

### Caching Strategy
- Set `Cache-Control: max-age=31536000` for versioned bundles (`dist/game.abc123.js`)
- Set `Cache-Control: no-cache` for `index.html` to ensure fresh loads

---

## Continuous Integration / CI Setup

### GitHub Actions Example

```yaml
# .github/workflows/build-test.yml
name: Build & Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm run test:coverage
      - name: Build
        run: npm run build
      - name: Verify bundle
        run: test -f dist/game.js && echo "Build successful"
```

### Local CI Simulation

```bash
npm install && npm run test:coverage && npm run build
```

---

## Summary

**Build Command:** `npm run build`

**Output Location:** `dist/` directory

**Key Files:**
- `dist/index.html` — Entry point
- `dist/game.js` — Bundled game code (500 KB unminified, ~40 KB gzipped)

**Test Command:** `npm test`

**Coverage Verification:** `npm run test:coverage`

**Next Steps:** [See integration-test-instructions.md and test-results.md for test execution]
