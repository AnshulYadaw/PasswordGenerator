/**
 * @format
 */

import 'react-native';
import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../App';

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));

jest.mock('@react-native-community/slider', () => 'MockSlider');

describe('Password Generator', () => {
  it('renders without crashing', () => {
    const component = render(<App />);
    expect(component).toBeTruthy();
  });
});
