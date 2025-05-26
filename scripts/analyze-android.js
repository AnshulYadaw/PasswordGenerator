// Android Analysis Script
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { fileURLToPath } = require('url');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running Android Analysis Tools...');

try {
  console.log('\n📋 Step 1: Running ESLint on JavaScript/TypeScript files...');
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ ESLint analysis complete');
} catch (error) {
  console.error('❌ ESLint analysis failed:', error.message);
}

try {
  console.log('\n📋 Step 2: Running Android Lint...');
  console.log('This might take a few minutes for the first run...');
  execSync('cd android && ./gradlew lint', { stdio: 'inherit' });
  
  // Path to the Android lint report HTML file
  const lintReportPath = path.join(
    __dirname, 
    '../android/app/build/reports/lint-results.html'
  );
  
  if (fs.existsSync(lintReportPath)) {
    console.log(`✅ Android Lint analysis complete. Report available at: ${lintReportPath}`);
  } else {
    console.log('✅ Android Lint analysis complete. Report not found at the expected location.');
  }
} catch (error) {
  console.error('❌ Android Lint analysis failed:', error.message);
}

console.log('\n📊 Android Analysis Complete!');
console.log('\nFor more advanced analysis:');
console.log('1. Open project in Android Studio and use "Analyze > Inspect Code..."');
console.log('2. Use Android Profiler in Android Studio for performance analysis');
console.log('3. Consider integrating tools like Detekt (Kotlin), SonarQube, or JaCoCo');
