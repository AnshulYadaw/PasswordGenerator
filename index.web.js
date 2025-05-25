/**
 * Web entry point for Password Generator
 */

import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('PasswordGenerator', () => App);

AppRegistry.runApplication('PasswordGenerator', {
  initialProps: {},
  rootTag: document.getElementById('root')
});
