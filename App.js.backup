import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

export default function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState('12');
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });

  const generatePassword = () => {
    let charset = '';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) charset += '0123456789';
    if (options.special) charset += '!@#$%^&*()_+';

    if (charset === '') {
      Alert.alert('Error', 'Please select at least one character type');
      return;
    }

    let newPassword = '';
    const passwordLength = parseInt(length) || 12;

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
  };

  const copyToClipboard = async () => {
    if (password) {
      await Clipboard.setStringAsync(password);
      Alert.alert('Success', 'Password copied to clipboard!');
    }
  };

  const toggleOption = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Password Generator</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password Length:</Text>
          <TextInput
            style={styles.input}
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Uppercase (A-Z)</Text>
            <Switch
              value={options.uppercase}
              onValueChange={() => toggleOption('uppercase')}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={options.uppercase ? '#007AFF' : '#f4f3f4'}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Lowercase (a-z)</Text>
            <Switch
              value={options.lowercase}
              onValueChange={() => toggleOption('lowercase')}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={options.lowercase ? '#007AFF' : '#f4f3f4'}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Numbers (0-9)</Text>
            <Switch
              value={options.numbers}
              onValueChange={() => toggleOption('numbers')}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={options.numbers ? '#007AFF' : '#f4f3f4'}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Special Characters (!@#$)</Text>
            <Switch
              value={options.special}
              onValueChange={() => toggleOption('special')}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={options.special ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
          <Text style={styles.buttonText}>Generate Password</Text>
        </TouchableOpacity>

        {password ? (
          <View style={styles.passwordContainer}>
            <Text style={styles.passwordText}>{password}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'web' ? 20 : 0,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    width: 60,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  optionsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  passwordContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passwordText: {
    fontSize: 20,
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 