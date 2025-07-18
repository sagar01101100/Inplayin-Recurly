import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router-dom'
import { RecurlyProvider, Elements } from '@recurly/react-recurly';

// layouts and pages
import RootLayout from './layouts/RootLayout'
import Dashboard from './pages/Dashboard'
import Create from './pages/Create'
import SignIn from './component/SignIn'
import SignUp from './component/SignUp'
import SignUpVerify from './component/SignUpVerify'
import SubscriptionPage from './component/SubscriptionPage'
import Membership from './component/Membership'
import Payment from './component/Payment'
import Profile from './component/Profile'

import ForgotPassword from './component/ForgotPassword'
import UserDetails from './component/UserDetails'

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>

{/*       <Route index element={<Dashboard />} /> */}
      <Route index element={<SignIn />} />
      <Route path="create" element={<Create />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="otp-verify" element={<SignUpVerify />} />
      <Route path="forgot-password" element={<ForgotPassword />} />

      <Route path="select-subscription" element={<SubscriptionPage />} />
      <Route path="membership" element={<Membership />} />
      <Route path="payment" element={<Payment />} />
      <Route path="/:profileId" element={<Profile />} />
      <Route path="/user-details/:profileId" element={<UserDetails />} />
    </Route>
  )
)

function App() {
  return (
    <RecurlyProvider publicKey="ewr1-1y1Zz8hFfIopY5zArFyi80"> 
      <Elements>
        <RouterProvider router={router} />
      </Elements>
    </RecurlyProvider>
  )
}

export default App
