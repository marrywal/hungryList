const tintColorLight = '#00b3b3';
const tintColorDark = '#006D75';

export const Colors = {
  light: {
    text: '#000',
    textOnTint: '#fff',
    secondaryText: '#666',
    background: '#fff',
    input: '#ededed',
    placeholder: '#bbb',
    border: '#ccc',
    tint: tintColorLight,
    tintBackground: tintColorLight + '30',
    tabIconDefault: '#18191a',
    tabIconSelected: tintColorLight,
    error: '#dd2c00'
  },
  dark: {
    text: '#e4e6eb',
    textOnTint: '#e4e6eb',
    secondaryText: '#b0b3b8',
    background: '#18191a',
    input: '#333',
    placeholder: '#666',
    border: '#333',
    tint: tintColorDark,
    tintBackground: tintColorDark + '50',
    tabIconDefault: '#b0b3b8',
    tabIconSelected: tintColorDark,
    error: '#7d1a01'
  }
};

export const NavigationColors = {
  light: {
    dark: false,
    colors: {
        primary: tintColorLight,
        background: '#f1f1f1',
        card: '#fff',
        text: '#000',
        border: '#ccc',
        notification: tintColorLight,
    },
  },
  dark: {
    dark: true,
    colors: {
        primary: tintColorDark,
        background: '#111',
        card: '#242526',
        text: '#e4e6eb',
        border: '#333',
        notification: tintColorDark,
    }
  }
}
