#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Directory paths
const rootDir = path.resolve(__dirname, '..');
const macosDir = path.join(rootDir, 'macos');

console.log('🖥️ Starting macOS build process...');

try {
  // Check if macos directory exists
  if (!fs.existsSync(macosDir)) {
    console.log('🏗️ Creating macOS project...');
    execSync('npx react-native-macos-init', { stdio: 'inherit', cwd: rootDir });
  } else {
    console.log('✅ macOS project directory already exists');
  }

  // Fix Podfile for macOS
  const podfilePath = path.join(macosDir, 'Podfile');
  if (fs.existsSync(podfilePath)) {
    console.log('🔎 Checking Podfile configuration...');
    let podfileContent = fs.readFileSync(podfilePath, 'utf8');
    
    // Completely rewrite the Podfile with a simplified version that works with Expo
    podfileContent = `
require_relative '../node_modules/react-native-macos/scripts/react_native_pods'

# Custom implementation for native modules since we're using Expo
def use_native_modules!(config = nil)
  puts "Using custom native_modules implementation for macOS"
end

def prepare_react_native_project!
  puts "Preparing React Native project for macOS"
end

prepare_react_native_project!

target 'passwordgenerator-macOS' do
  platform :macos, '10.15'
  # Custom native modules function is called instead
  
  # Flags change depending on the env values.
  flags = get_default_flags()

  use_react_native!(
    :path => '../node_modules/react-native-macos',
    :hermes_enabled => false,
    :fabric_enabled => ENV['RCT_NEW_ARCH_ENABLED'] == '1',
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  post_install do |installer|
    react_native_post_install(installer)
  end
end
`;
    
    fs.writeFileSync(podfilePath, podfileContent);
    console.log('✅ Podfile updated completely');
  }

  // Ensure App.js is compatible with macOS
  const appJsPath = path.join(rootDir, 'App.js');
  if (fs.existsSync(appJsPath)) {
    console.log('🔎 Checking App.js compatibility...');
    let appJsContent = fs.readFileSync(appJsPath, 'utf8');
    
    // Make backup of App.js if not already done
    const backupPath = path.join(rootDir, 'App.js.backup');
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, appJsContent);
      console.log('📝 Created App.js backup at App.js.backup');
    }
  }
  
  // Install pods with better error handling
  console.log('📦 Installing CocoaPods dependencies...');
  try {
    // First, make sure CocoaPods is up to date
    console.log('🔄 Updating CocoaPods...');
    execSync('gem update cocoapods', { stdio: 'inherit' });
    
    // Clean Pods directory and install
    console.log('🧹 Cleaning Pods directory...');
    execSync('rm -rf Pods Podfile.lock', { stdio: 'inherit', cwd: macosDir });
    
    console.log('📥 Installing pods...');
    execSync('pod install', { stdio: 'inherit', cwd: macosDir });
    console.log('✅ CocoaPods dependencies installed');
  } catch (error) {
    console.log('⚠️ Pod install encountered issues, but we will try to continue: ' + error.message);
    
    // Try a more explicit approach
    try {
      console.log('🔄 Trying alternative pod installation approach...');
      execSync('cd "' + macosDir + '" && pod install', { stdio: 'inherit', shell: '/bin/zsh' });
      console.log('✅ Alternative pod installation succeeded');
    } catch (podError) {
      console.log('⚠️ Alternative pod installation also failed. Opening Xcode project anyway.');
    }
  }

  // Start Metro bundler in a new Terminal window for better visibility
  console.log('🚀 Starting Metro bundler in a new Terminal...');
  try {
    execSync('osascript -e \'tell app "Terminal" to do script "cd ' + rootDir + ' && npm run start"\' ', {
      stdio: 'inherit'
    });
    console.log('✅ Metro bundler started in new Terminal window');
  } catch (error) {
    console.log('⚠️ Could not start Metro in a new Terminal. Starting inline...');
    const metroProcess = spawn('npm', ['run', 'start'], { 
      stdio: 'inherit', 
      cwd: rootDir,
      detached: true 
    });
    metroProcess.unref();
  }

  // Let Metro start up
  console.log('⏳ Waiting for Metro bundler to start...');
  setTimeout(() => {
    // Open Xcode project
    console.log('🖥️ Opening Xcode project...');
    try {
      execSync('open ' + macosDir + '/passwordgenerator.xcworkspace 2>/dev/null || open ' + macosDir + '/passwordgenerator.xcodeproj', { 
        stdio: 'inherit', 
        shell: '/bin/zsh'
      });
      console.log('✅ Xcode project opened. Please click the Run button in Xcode to build and run the app.');
      console.log('\n📝 IMPORTANT: In Xcode, you might need to:');
      console.log('1. Select your development team in Signing & Capabilities');
      console.log('2. Update the Bundle Identifier if needed');
      console.log('3. Click the Run button (▶️) to build and run');
    } catch (error) {
      console.log('⚠️ Could not open Xcode project. Try opening it manually from ' + macosDir);
    }
  }, 3000);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
