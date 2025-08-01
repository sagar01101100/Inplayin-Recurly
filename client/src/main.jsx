import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthContextProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
