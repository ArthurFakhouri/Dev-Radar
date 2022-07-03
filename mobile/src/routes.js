import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './pages/Main';
import Profile from './pages/Profile';

const Stack = createNativeStackNavigator();

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTitleAlign: 'center', headerStyle: {backgroundColor: '#7d40e7'}, headerTintColor: '#fff', headerBackTitleVisible: 'false'}}>
        <Stack.Screen name="Main" component={Main} options={{title: 'DevRadar'}} />
        <Stack.Screen name="Profile" component={Profile} options={{title: 'Perfil no Github'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;