import React from 'react';
import Index from './src';
import {
  PaperProvider,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';


export default function App() {
 
  return (
    <SafeAreaProvider>
        <PaperProvider >
          <Index />
        </PaperProvider>
    </SafeAreaProvider>
  );
}
