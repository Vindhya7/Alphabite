import { createSwitchNavigator } from 'react-navigation';
import LoadingScreen from './LoadingScreen.js';
import SignUpScreen from './SignUpScreen.js';
import SignInScreen from './SignInScreen.js';
import CreateUserProfileScreen from './CreateUserProfileScreen.js';

const AuthNavigator = createSwitchNavigator({
    Loading: { screen: LoadingScreen },
    SignUp: { screen: SignUpScreen },
    SignIn: { screen: SignInScreen },
    CreateProfile: { screen: CreateUserProfileScreen }
  },
  { initialRouteName: 'Loading' }
);

export default AuthNavigator;