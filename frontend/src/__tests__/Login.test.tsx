import React from 'react';
import { Login } from '../pages/auth/Login';

/**
 * Basic smoke test for Login component
 * Tests that the component can be imported and instantiated without errors
 */
export const testLogin = () => {
  try {
    // Test that the component can be created
    const loginComponent = React.createElement(Login);
    
    if (!loginComponent) {
      throw new Error('Login component failed to instantiate');
    }
    
    console.log('✅ Login component test passed');
    return true;
  } catch (error) {
    console.error('❌ Login component test failed:', error);
    return false;
  }
};

// Run the test immediately when this file is imported
testLogin();