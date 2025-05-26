import Slider from '@react-native-community/slider';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const calculatePasswordStrength = (password) => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length contribution
  strength += Math.min(password.length * 4, 40);
  
  // Character type contribution
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 15;
  
  // Variety contribution
  const uniqueChars = new Set(password).size;
  strength += Math.min(uniqueChars * 2, 20);
  
  return Math.min(strength, 100);
};

const getStrengthColor = (strength) => {
  if (strength < 40) return '#FF3B30';
  if (strength < 70) return '#FF9500';
  return '#34C759';
};

const getStrengthLabel = (strength) => {
  if (strength < 40) return 'Weak';
  if (strength < 70) return 'Medium';
  return 'Strong';
};

const CHARACTER_TYPES = {
  uppercase: { label: 'Uppercase (A-Z)', icon: '🔠', resistance: 2 },
  lowercase: { label: 'Lowercase (a-z)', icon: '🔡', resistance: 1 },
  numbers: { label: 'Numbers (0-9)', icon: '🔢', resistance: 1.5 },
  special: { label: 'Special Characters (!@#$)', icon: '🔣', resistance: 1.2 },
};

// WebSlider for web platform
const WebSlider = (props) => (
  <input
    type="range"
    min={props.minimumValue}
    max={props.maximumValue}
    value={props.value}
    onChange={e => props.onValueChange(Number(e.target.value))}
    style={{ width: '100%', marginLeft: 10, height: 40 }}
    aria-label="Slider"
    title="Slider"
  />
);

export default function PasswordGeneratorScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState('12');
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });
  const [characterCounts, setCharacterCounts] = useState({
    uppercase: 3,
    lowercase: 3,
    numbers: 3,
    special: 3,
  });
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [autoAdjust, setAutoAdjust] = useState(false);
  const [strength, setStrength] = useState(0);
  const strengthAnim = new Animated.Value(0);
  const [lastChangedType, setLastChangedType] = useState(null);

  // Auto-generate password when settings change
  useEffect(() => {
    if (autoGenerate) {
      generatePassword();
    }
  }, [length, options, characterCounts]);

  // Update strength when password changes
  useEffect(() => {
    const newStrength = calculatePasswordStrength(password);
    setStrength(newStrength);
    Animated.timing(strengthAnim, {
      toValue: newStrength,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [password]);

  // Auto-adjust character counts when length changes
  useEffect(() => {
    if (autoAdjust) {
      const newLength = parseInt(length) || 12;
      const totalTypes = Object.values(options).filter(Boolean).length;
      if (totalTypes > 0) {
        const baseCount = Math.floor(newLength / totalTypes);
        const remainder = newLength % totalTypes;
        
        const newCounts = {
          uppercase: options.uppercase ? baseCount + (remainder > 0 ? 1 : 0) : 0,
          lowercase: options.lowercase ? baseCount + (remainder > 1 ? 1 : 0) : 0,
          numbers: options.numbers ? baseCount + (remainder > 2 ? 1 : 0) : 0,
          special: options.special ? baseCount + (remainder > 3 ? 1 : 0) : 0,
        };
        
        setCharacterCounts(newCounts);
      }
    }
  }, [length, options, autoAdjust]);

  const generatePassword = () => {
    let charset = '';
    let requiredChars = '';
    
    // Add required characters based on counts
    if (options.uppercase) {
      requiredChars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(characterCounts.uppercase);
      charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (options.lowercase) {
      requiredChars += 'abcdefghijklmnopqrstuvwxyz'.repeat(characterCounts.lowercase);
      charset += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (options.numbers) {
      requiredChars += '0123456789'.repeat(characterCounts.numbers);
      charset += '0123456789';
    }
    if (options.special) {
      requiredChars += '!@#$%^&*()_+'.repeat(characterCounts.special);
      charset += '!@#$%^&*()_+';
    }

    if (charset === '') {
      Alert.alert('Error', 'Please select at least one character type');
      return;
    }

    const totalRequired = Object.values(characterCounts).reduce((a, b) => a + b, 0);
    const passwordLength = parseInt(length) || 12;

    if (totalRequired > passwordLength) {
      Alert.alert('Error', 'Total required characters exceed password length');
      return;
    }

    // Generate password with required characters
    let newPassword = '';
    
    // First, add one character from each required type
    if (options.uppercase) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      newPassword += chars[Math.floor(Math.random() * chars.length)];
    }
    if (options.lowercase) {
      const chars = 'abcdefghijklmnopqrstuvwxyz';
      newPassword += chars[Math.floor(Math.random() * chars.length)];
    }
    if (options.numbers) {
      const chars = '0123456789';
      newPassword += chars[Math.floor(Math.random() * chars.length)];
    }
    if (options.special) {
      const chars = '!@#$%^&*()_+';
      newPassword += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Fill the rest with random characters
    while (newPassword.length < passwordLength) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    // Shuffle the password
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    
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

  const balanceCharacterCounts = (changedType, newValue) => {
    const totalLength = parseInt(length) || 12;
    const enabledTypes = Object.entries(options)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => type);

    if (enabledTypes.length <= 1) return;

    const oldValue = characterCounts[changedType];
    const difference = newValue - oldValue;
    
    // Calculate total resistance of other types
    const otherTypes = enabledTypes.filter(type => type !== changedType);
    const totalResistance = otherTypes.reduce(
      (sum, type) => sum + CHARACTER_TYPES[type].resistance,
      0
    );

    // Distribute the difference among other types based on their resistance
    const newCounts = { ...characterCounts };
    newCounts[changedType] = newValue;

    let remainingDifference = difference;
    otherTypes.forEach(type => {
      const resistance = CHARACTER_TYPES[type].resistance;
      const adjustment = Math.round((difference * resistance) / totalResistance);
      newCounts[type] = Math.max(0, Math.min(10, characterCounts[type] - adjustment));
      remainingDifference -= adjustment;
    });

    // Handle any remaining difference
    if (remainingDifference !== 0) {
      const typeToAdjust = otherTypes[0];
      newCounts[typeToAdjust] = Math.max(0, Math.min(10, newCounts[typeToAdjust] - remainingDifference));
    }

    // Ensure total doesn't exceed password length
    const total = Object.values(newCounts).reduce((sum, count) => sum + count, 0);
    if (total > totalLength) {
      const excess = total - totalLength;
      const typeToReduce = otherTypes[0];
      newCounts[typeToReduce] = Math.max(0, newCounts[typeToReduce] - excess);
    }

    setCharacterCounts(newCounts);
    setLastChangedType(changedType);
    
    // Generate new password after updating counts
    if (autoGenerate) {
      generatePassword();
    }
  };

  const updateCharacterCount = (type, value) => {
    const newValue = Math.round(value);
    if (autoAdjust) {
      balanceCharacterCounts(type, newValue);
    } else {
      setCharacterCounts(prev => ({
        ...prev,
        [type]: newValue
      }));
      // Generate new password when counts change without auto-adjust
      if (autoGenerate) {
        generatePassword();
      }
    }
  };

  const handleLengthChange = (text) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      setLength(text);
    }
  };

  const renderOptionRow = (type, key) => {
    const { label, icon, resistance } = CHARACTER_TYPES[type];
    const isLastChanged = lastChangedType === type;

    return (
      <View style={[
        styles.optionRow,
        isLastChanged && styles.lastChangedRow
      ]} key={key}>
        <View style={styles.optionContent}>
          <View style={styles.optionLabelContainer}>
            <Text style={styles.optionIcon}>{icon}</Text>
            <Text style={styles.optionLabel}>{label}</Text>
            {autoAdjust && (
              <Text style={styles.resistanceLabel}>
                Resistance: {resistance}x
              </Text>
            )}
          </View>
          <Text style={[
            styles.countLabel,
            isLastChanged && styles.lastChangedCount
          ]}>
            {characterCounts[type]}
          </Text>
        </View>
        <View style={styles.controlsContainer}>
          <Switch
            value={options[type]}
            onValueChange={() => toggleOption(type)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={options[type] ? '#007AFF' : '#f4f3f4'}
          />
          {options[type] && (
            Platform.OS === 'web' ? (
              <WebSlider
                minimumValue={0}
                maximumValue={10}
                value={characterCounts[type]}
                onValueChange={(value) => updateCharacterCount(type, value)}
              />
            ) : (
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                value={characterCounts[type]}
                onValueChange={(value) => updateCharacterCount(type, value)}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#000000"
              />
            )
          )}
        </View>
      </View>
    );
  };

  const renderStrengthIndicator = () => {
    const width = strengthAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.strengthContainer}>
        <View style={styles.strengthBar}>
          <Animated.View
            style={[
              styles.strengthFill,
              {
                width,
                backgroundColor: getStrengthColor(strength),
              },
            ]}
          />
        </View>
        <Text style={[styles.strengthLabel, { color: getStrengthColor(strength) }]}>
          {getStrengthLabel(strength)}
        </Text>
      </View>
    );
  };

  // Add useEffect to handle character count changes
  useEffect(() => {
    if (autoGenerate) {
      generatePassword();
    }
  }, [characterCounts]);

  // Responsive styles
  const isMobile = screenWidth < 500;
  const dynamicStyles = StyleSheet.create({
    content: {
      flex: 1,
      padding: isMobile ? 10 : 20,
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 600,
      width: '100%',
      alignSelf: 'center',
      paddingTop: Platform.OS === 'web' ? (isMobile ? 10 : 20) : 0,
    },
    title: {
      fontSize: isMobile ? 24 : 32,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: isMobile ? 14 : 16,
      color: '#666',
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      marginBottom: 20,
      backgroundColor: '#fff',
      padding: isMobile ? 10 : 15,
      borderRadius: 10,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    label: {
      fontSize: isMobile ? 14 : 16,
      marginRight: isMobile ? 0 : 10,
      marginBottom: isMobile ? 8 : 0,
      color: '#333',
      fontWeight: '600',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: isMobile ? 8 : 10,
      width: isMobile ? '100%' : 60,
      textAlign: 'center',
      backgroundColor: '#fff',
      fontSize: isMobile ? 14 : 16,
    },
    generateButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: isMobile ? 20 : 30,
      paddingVertical: isMobile ? 12 : 15,
      borderRadius: 10,
      marginBottom: 20,
      width: '100%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: isMobile ? 16 : 18,
      fontWeight: '600',
    },
    passwordText: {
      fontSize: isMobile ? 16 : 20,
      marginBottom: 15,
      color: '#333',
      textAlign: 'center',
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    // ...add more overrides as needed...
  });

  return (
    <ScrollView style={styles.container}>
      <View style={dynamicStyles.content}>
        <View style={styles.header}>
          <Text style={dynamicStyles.title}>Password Generator</Text>
          <Text style={dynamicStyles.subtitle}>Create strong, secure passwords</Text>
        </View>
        
        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.label}>Password Length:</Text>
          <TextInput
            style={dynamicStyles.input}
            value={length}
            onChangeText={handleLengthChange}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>

        <View style={styles.optionsContainer}>
          {Object.keys(CHARACTER_TYPES).map(type => renderOptionRow(type, type))}

          <View style={styles.autoOptionsContainer}>
            <View style={styles.autoOption}>
              <Text style={styles.autoOptionLabel}>Auto-generate on change</Text>
              <Switch
                value={autoGenerate}
                onValueChange={setAutoGenerate}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={autoGenerate ? '#007AFF' : '#f4f3f4'}
              />
            </View>
            <View style={styles.autoOption}>
              <Text style={styles.autoOptionLabel}>Auto-adjust counts</Text>
              <Switch
                value={autoAdjust}
                onValueChange={setAutoAdjust}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={autoAdjust ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={dynamicStyles.generateButton} onPress={generatePassword}>
          <Text style={dynamicStyles.buttonText}>Generate Password</Text>
        </TouchableOpacity>

        {password ? (
          <View style={styles.passwordContainer}>
            <Text style={dynamicStyles.passwordText}>{password}</Text>
            {renderStrengthIndicator()}
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  countLabel: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  slider: {
    flex: 1,
    marginLeft: 10,
    height: 40,
  },
  autoOptionsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  autoOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  autoOptionLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  copyButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  strengthContainer: {
    width: '100%',
    marginBottom: 15,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  lastChangedRow: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  lastChangedCount: {
    color: '#007AFF',
    fontWeight: '700',
  },
  resistanceLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});
