/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const black: string = '#0E0E0E';
const blackLight: string = '#1B1B1B';
const blackDark: string = '#010101';
const blackTransparent: string = '#0101014D';

const white: string = '#F2F2F2';
const whiteLight: string = '#FFFFFF';
const whiteDark: string = '#E5E5E5';
const whiteTransparent: string = '#E5E5E54D';

const grey: string = '#a3a3a3';
const greyLight: string = '#515151';
const greyDark: string = '#383838';
const greyTransparent: string = '#3838384D';

const red: string = '#DD4B39';
const redLight: string = '#E98A7E';
const redDark: string = '#D33724';
const redTransparent: string = '#D337244D';

const green: string = '#00A65A';
const greenLight: string = '#59C594';
const greenDark: string = '#008D4C';
const greenTransparent: string = '#008D4C4D';

const blue: string = '#3C8DBC';
const blueLight: string = '#80B5D3';
const blueDark: string = '#357CA5';
const blueTransparent: string = '#357CA54D';

const skyBlue: string = '#00C0EF';
const skyBlueLight: string = '#59D6F4';
const skyBlueDark: string = '#00A7D0';
const skyBlueTransparent: string = '#00A7D04D';

const tosca: string = '#39CCCC';
const toscaLight: string = '#7EDEDE';
const toscaDark: string = '#30BBBB';
const toscaTransparent: string = '#30BBBB4D';

const yellow: string = '#F39C12';
const yellowLight: string = '#F7BE65';
const yellowDark: string = '#DB8B0B';
const yellowTransparent: string = '#DB8B0B4D';

const orange: string = '#D16224';
const orangeLight: string = '#de8549';
const orangeDark: string = '#ab4715';
const orangeTransparent: string = '#ab47154D';

const purple: string = '#605CA8';
const purpleLight: string = '#9795C6';
const purpleDark: string = '#555299';
const purpleTransparent: string = '#5552994D';

const aqua: string = '#00FFFF';
const aquaLight: string = '#E0FFFF';
const aquaDark: string = '#00CED1';

const teal: string = '#008080';
const tealLight: string = '#20B2AA';
const tealDark: string = '#006666';

/**         danger/warning/success/info/primary               */

const danger: string = red;
const dangerActive: string = redDark;
const dangerDisabled: string = redLight;
const dangerTransparent: string = redTransparent;

const warning: string = yellow;
const warningActive: string = yellowDark;
const warningDisabled: string = yellowLight;
const warningTransparent: string = yellowTransparent;

const success: string = green;
const successActive: string = greenDark;
const successDisabled: string = greenLight;
const successTransparent: string = greenTransparent;

const info: string = skyBlue;
const infoActive: string = skyBlueDark;
const infoDisabled: string = skyBlueLight;
const infoTransparent: string = skyBlueTransparent;

const primary: string = blue;
const primaryActive: string = blueDark;
const primaryDisabled: string = blueLight;
const primaryTransparent: string = blueTransparent;


export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },

  black: black,
  blackLight: blackLight,
  blackDark: blackDark,

  white: white,
  whiteLight: whiteLight,
  whiteDark: whiteDark,

  grey: grey,
  greyLight: greyLight,
  greyDark: greyDark,

  red: red,
  redLight: redLight,
  redDark: redDark,

  green: green,
  greenLight: greenLight,
  greenDark: greenDark,

  blue: blue,
  blueLight: blueLight,
  blueDark: blueDark,

  yellow: yellow,
  yellowLight: yellowLight,
  yellowDark: yellowDark,

  orange: orange,
  orangeLight: orangeLight,
  orangeDark: orangeDark,

  purple: purple,
  purpleLight: purpleLight,
  purpleDark: purpleDark,
 
  danger: danger,
  dangerActive: dangerActive,
  dangerDisabled: dangerDisabled,
  
  warning: warning,
  warningActive: warningActive,
  warningDisabled: warningDisabled,
  
  success: success,
  successActive: successActive,
  successDisabled: successDisabled,
  
  info: info,
  infoActive: infoActive,
  infoDisabled: infoDisabled,
  
  primary: primary,
  primaryActive: primaryActive,
  primaryDisabled: primaryDisabled,


  bgBlack: black,
  bgBlackLight: blackLight,
  bgBlackDark: blackDark,
  bgBlackTransparent: blackTransparent,

  bgWhite: white,
  bgWhiteLight: whiteLight,
  bgWhiteDark: whiteDark,
  bgWhiteTransparent: whiteTransparent,

  bgGrey: grey,
  bgGreyLight: greyLight,
  bgGreyDark: greyDark,
  bgGreyTransparent: greyTransparent,

  bgRed: red,
  bgRedLight: redLight,
  bgRedDark: redDark,
  bgRedTransparent: redTransparent,

  bgGreen: green,
  bgGreenLight: greenLight,
  bgGreenDark: greenDark,
  bgGreenTransparent: greenTransparent,

  bgBlue: blue,
  bgBlueLight: blueLight,
  bgBlueDark: blueDark,
  bgBlueTransparent: blueTransparent,

  bgYellow: yellow,
  bgYellowLight: yellowLight,
  bgYellowDark: yellowDark,
  bgYellowTransparent: yellowTransparent,

  bgOrange: orange,
  bgOrangeLight: orangeLight,
  bgOrangeDark: orangeDark,
  bgOrangeTransparent: orangeTransparent,

  bgPurple: purple,
  bgPurpleLight: purpleLight,
  bgPurpleDark: purpleDark,
  bgPurpleTransparent: purpleTransparent,

  bgDanger: danger,
  bgDangerActive: dangerActive,
  bgDangerDisabled: dangerDisabled,
  bgDangerTransparent: dangerTransparent,

  bgWarning: warning,
  bgWarningActive: warningActive,
  bgWarningDisabled: warningDisabled,
  bgWarningTransparent: warningTransparent,

  bgSuccess: success,
  bgSuccessActive: successActive,
  bgSuccessDisabled: successDisabled,
  bgSuccessTransparent: successTransparent,

  bgInfo: info,
  bgInfoActive: infoActive,
  bgInfoDisabled: infoDisabled,
  bgInfoTransparent: infoTransparent,

  bgPrimary: primary,
  bgPrimaryActive: primaryActive,
  bgPrimaryDisabled: primaryDisabled,
  bgPrimaryTransparent: primaryTransparent,

  aqua: aqua,
  aquaLight: aquaLight,
  aquaDark: aquaDark,
  bgAqua: aqua,
  bgAquaLight: aquaLight,
  bgAquaDark: aquaDark,

  teal: teal,
  tealLight: tealLight,
  tealDark: tealDark,
  bgTeal: teal,
  bgTealLight: tealLight,
  bgTealDark: tealDark,
};
