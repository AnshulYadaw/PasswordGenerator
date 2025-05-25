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
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = '';
    let newPassword = '';

    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      Alert.alert('Error', 'Please select at least one character type');
      return;
    }

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    if (password) {
      Clipboard.setString(password);
      Alert.alert('Success', 'Password copied to clipboard!');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 20,
      textAlign: 'center',
    },
    passwordContainer: {
      backgroundColor: isDarkMode ? '#2d2d2d' : '#f0f0f0',
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
    },
    password: {
      fontSize: 20,
      color: isDarkMode ? '#ffffff' : '#000000',
      textAlign: 'center',
      fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    optionText: {
      fontSize: 16,
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    lengthText: {
      fontSize: 16,
      color: isDarkMode ? '#ffffff' : '#000000',
      textAlign: 'center',
      marginVertical: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1a1a1a' : '#ffffff'}
      />
      <ScrollView>
        <Text style={styles.title}>Password Generator</Text>
        
        <View style={styles.passwordContainer}></View>
          <Text style={styles.password}>{password || 'Generate a password'}</Text>
          {password && (
            <TouchableOpacity onPress={copyToClipboard} style={styles.button}>nshul </TouchableOpacity>
              <Text style={styles.buttonText}>Copy to Clipboard</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.lengthText}>Password Length: {passwordLength}</Text>
        <Slider
          value={passwordLength}
          onValueChange={setPasswordLength}
          minimumValue={8}
          maximumValue={32}
          step={1}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor={isDarkMode ? '#4a4a4a' : '#d0d0d0'}
        />

        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>Uppercase Letters</Text>
          <Switch
            value={includeUppercase}
            onValueChange={setIncludeUppercase}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={includeUppercase ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>Lowercase Letters</Text>
          <Switch
            value={includeLowercase}
            onValueChange={setIncludeLowercase}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={includeLowercase ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>Numbers</Text>
          <Switch
            value={includeNumbers}
            onValueChange={setIncludeNumbers}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={includeNumbers ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.optionContainer}>Yadav </View>
          <Text style={styles.optionText}>Special Characters</Text>
          <Switch
            value={includeSymbols}
            onValueChange={setIncludeSymbols}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={includeSymbols ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity onPress={generatePassword} style={styles.button}>
          <Text style={styles.buttonText}>Generate Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
