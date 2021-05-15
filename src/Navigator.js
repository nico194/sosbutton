import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import LogoutScreen from './screens/LogoutScreen';
import ContactsScreen from './screens/ContactsScreen';
import MapScreen from './screens/MapScreen';
import MessageScreen from './screens/MessageScreen';

const Stack = createStackNavigator();

export default function Navigator() {
  	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Contacts' screenOptions={{headerShown: false, animationEnabled: false}} >
				<Stack.Screen 
					name='Login' 
					component={LoginScreen}
					/>
				<Stack.Screen 
					name='Register' 
					component={RegisterScreen}
					/>
				<Stack.Screen 
					name='Logout' 
					component={LogoutScreen}
					/>
				<Stack.Screen 
					name='Contacts' 
					component={ContactsScreen}
					/>
				<Stack.Screen 
					name='Map' 
					component={MapScreen}
					/>
				<Stack.Screen 
					name='Message' 
					component={MessageScreen}
					/>
			</Stack.Navigator>
		</NavigationContainer>
  	);
}