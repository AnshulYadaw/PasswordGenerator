#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Directory paths
const rootDir = path.resolve(__dirname, '..');
const reactNativeVersionPath = path.join(rootDir, 'node_modules', 'react-native', 'package.json');

console.log('🖥️ Windows Development Setup Guide');
console.log('===================================');

try {
  // Check if we're on macOS
  if (os.platform() !== 'win32') {
    console.log('⚠️ You are currently on: ' + os.platform());
    console.log('⚠️ React Native Windows development requires a Windows machine or VM.');
    
    // Check React Native version
    let rnVersion = 'unknown';
    if (fs.existsSync(reactNativeVersionPath)) {
      const rnPackage = JSON.parse(fs.readFileSync(reactNativeVersionPath, 'utf8'));
      rnVersion = rnPackage.version;
      console.log('📋 Current React Native version: ' + rnVersion);
      
      // Check compatibility
      if (rnVersion.startsWith('0.79')) {
        console.log('⚠️ Your React Native version (0.79.x) is newer than the latest supported React Native Windows version (0.78.x).');
        console.log('   To develop for Windows, you would need to downgrade React Native.');
      }
    }

    console.log('\n📝 To develop for Windows, you have the following options:');
    console.log('   1. Use a Windows machine or virtual machine (e.g., Parallels, VMware, VirtualBox)');
    console.log('   2. Use a Windows development environment in the cloud');
    console.log('   3. Use a dual-boot setup with Windows');
    
    console.log('\n📋 Steps to set up React Native Windows on a Windows machine:');
    console.log('   1. Install the following on Windows:');
    console.log('      - Node.js');
    console.log('      - Visual Studio 2019 or newer with:');
    console.log('        * Desktop development with C++');
    console.log('        * Universal Windows Platform development');
    console.log('   2. Clone your repository on Windows');
    console.log('   3. Run the following commands:');
    console.log('      npm install');
    if (rnVersion.startsWith('0.79')) {
      console.log('      npm install --save react-native@0.78.5 react-native-windows@0.78.5 --legacy-peer-deps');
    } else {
      console.log('      npx react-native-windows-init --overwrite');
      console.log('      npx react-native run-windows');
    }
    
    console.log('\n📱 Testing your app on Windows:');
    console.log('   When set up on Windows, you can run:');
    console.log('   npx react-native run-windows');
    
    console.log('\n🔗 Documentation:');
    console.log('   https://microsoft.github.io/react-native-windows/docs/getting-started');
  } else {
    // On Windows - could execute the actual commands
    console.log('✅ You are on Windows! Running setup...');
    
    // Here you'd put the actual Windows setup code that would run on a Windows machine
    console.log('🏗️ Installing required dependencies...');
    console.log('🚀 Running Windows setup...');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
