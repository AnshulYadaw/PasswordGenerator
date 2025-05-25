/**
 * Password Generator App
 * Works on macOS, Windows and Web
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Switch,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Slider from '@react-native-community/slider';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [buttonScale] = useState(new Animated.Value(1));

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const generatePassword = () => {
    let charset = '';
    let newPassword = '';

    if (includeUppercase) {
      charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (includeLowercase) {
      charset += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (includeNumbers) {
      charset += '0123456789';
    }
    if (includeSymbols) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    if (charset === '') {
      Alert.alert('Error', 'Please select at least one character type');
      return;
    }

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
    // Automatically copy to clipboard
    Clipboard.setString(newPassword);
    animateButton();
    Alert.alert('Generated & Copied!', 'New password has been generated and copied to clipboard');
  };

  const copyToClipboard = () => {
    if (password) {
      Clipboard.setString(password);
      animateButton();
      Alert.alert('Copied!', 'Password has been copied to clipboard');
    }
  };

  const getPasswordStrength = () => {
    if (!password) {
      return { text: '', color: '' };
    }
    
    let strength = 0;
    if (password.length >= 12) {
      strength++;
    }
    if (/[A-Z]/.test(password)) {
      strength++;
    }
    if (/[a-z]/.test(password)) {
      strength++;
    }
    if (/[0-9]/.test(password)) {
      strength++;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      strength++;
    }

    switch (strength) {
      case 5: return { text: 'Very Strong', color: '#4CAF50' };
      case 4: return { text: 'Strong', color: '#8BC34A' };
      case 3: return { text: 'Medium', color: '#FFC107' };
      case 2: return { text: 'Weak', color: '#FF9800' };
      default: return { text: 'Very Weak', color: '#F44336' };
    }
  };

  const strength = getPasswordStrength();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 30,
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    passwordContainer: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: isDarkMode ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    password: {
      fontSize: 24,
      color: isDarkMode ? '#ffffff' : '#000000',
      textAlign: 'center',
      fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', web: 'monospace' }),
      letterSpacing: 1,
      paddingVertical: 10,
    },
    strengthText: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 8,
      color: strength.color,
      fontWeight: '600',
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 16,
      borderRadius: 12,
      marginVertical: 12,
      shadowColor: '#007AFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    generateButton: {
      marginTop: 24,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    settingsContainer: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
      padding: 20,
      borderRadius: 16,
      marginTop: 24,
      shadowColor: isDarkMode ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 16,
    },
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 12,
    },
    optionText: {
      fontSize: 16,
      color: isDarkMode ? '#ffffff' : '#000000',
      fontWeight: '500',
    },
    lengthText: {
      fontSize: 16,
      color: isDarkMode ? '#ffffff' : '#000000',
      textAlign: 'center',
      marginVertical: 12,
      fontWeight: '500',
    },
    sliderContainer: {
      marginVertical: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#121212' : '#f5f5f5'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Password Generator</Text>
        
        <View style={styles.passwordContainer}>
          <Text style={styles.password}>{password || 'Generate a password'}</Text>
          {password && <Text style={styles.strengthText}>{strength.text}</Text>}
          {password && (
            <TouchableOpacity
              onPress={copyToClipboard}
              style={[styles.button, {transform: [{scale: buttonScale}]}]}>
              <Text style={styles.buttonText}>Copy to Clipboard</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Text style={styles.lengthText}>Length: {passwordLength} characters</Text>
          <View style={styles.sliderContainer}>
            <Slider
              value={passwordLength}
              onValueChange={setPasswordLength}
              minimumValue={8}
              maximumValue={32}
              step={1}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor={isDarkMode ? '#4a4a4a' : '#d0d0d0'}
              thumbTintColor="#007AFF"
            />
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Uppercase (A-Z)</Text>
            <Switch
              value={includeUppercase}
              onValueChange={setIncludeUppercase}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={includeUppercase ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Lowercase (a-z)</Text>
            <Switch
              value={includeLowercase}
              onValueChange={setIncludeLowercase}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={includeLowercase ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Numbers (0-9)</Text>
            <Switch
              value={includeNumbers}
              onValueChange={setIncludeNumbers}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={includeNumbers ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Special Characters (!@#$)</Text>
            <Switch
              value={includeSymbols}
              onValueChange={setIncludeSymbols}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={includeSymbols ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            animateButton();
            generatePassword();
          }}
          style={[styles.button, styles.generateButton]}>
          <Text style={styles.buttonText}>Generate Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
