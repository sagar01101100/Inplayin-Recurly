import React, { useState, useRef, useContext } from 'react';
import axios from "axios";
import {
  Box,
  Text,
  RadioGroup,
  Stack,
  Radio,
  Input,
  Button,
  Image,
  Flex,
  Select
} from '@chakra-ui/react';
import { useRecurly, CardElement } from '@recurly/react-recurly';
import { AuthContext } from '../context/AuthContext';
import plans from '../plan.js';
import {loadStripe} from '@stripe/stripe-js';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Payment() {
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponValid, setCouponValid] = useState('');
  const [validCouponCode, setValidCouponCode] = useState('');

  const [amount, setAmount] = useState(0);

  const formRef = useRef();
  const recurly = useRecurly();
  const {currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const planName = localStorage.getItem('selectedPlan');
  console.log(planName);

  const plan = plans.find(plan => plan.name === planName);
  console.log("plan:", plan);

  const handleCouponApply = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVER_URL}/coupon/validate-coupon`, { couponCode });

      console.log(response.data);
      if (response.data.valid) {
        setCouponError('');
        setCouponValid('Coupon Code is valid');
        setValidCouponCode(couponCode);
        setTimeout(() => setCouponValid(''), 3000);
        console.log("Coupon Code is valid");
      } else {
        setCouponValid('');
        setCouponError('Invalid coupon code');
        setTimeout(() => setCouponError(''), 3000);
      }

      // const res = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URL}/coupon/`)

      // console.log(res.data);
    } catch (error) {
      console.error('Error validating coupon:', error);
      setCouponError('Error validating coupon code');
    }
  };


  const handleUpiSubmit = async (event) => {
    try {
      const stripe = await loadStripe("pk_test_51PIEGOSGl25Slk3Ko2VkWRTMRQKw1ga2e3og3FpPnO8vDg15k2RZqoT2YfW17sD27txfdbx8LlTkozwlb2tmeZxB00UByJ50nP");
  
      const body = {
        price: plan.price,
        plan: plan.name,
        description: plan.text,
        payment_method_types: ['upi'] // Add this to specify UPI payment method
      };
  
      const headers = {
        "Content-Type": "application/json"
      };
  
      const response = await fetch("http://localhost:3000/payment/create-checkout-session", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch checkout session');
      }
  
      const session = await response.json();
  
      // Redirect to Stripe Checkout page with UPI payment method
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
        // cancelUrl: 'https://example.com/cancel', // Add cancel URL
        // successUrl: 'https://example.com/success' // Add success URL
      });
  
      if (result.error) {
        console.log(result.error.message);
      }
    } catch (error) {
      console.error('Error during payment:', error);
    }
  };

  const handleCreditSubmit = (event) => {
    event.preventDefault();

    recurly.token(formRef.current, async (err, token) => {
      if (err) {
        console.error('Recurly tokenization error:', err);
      } else {
        const tokenId = token.id;
        console.log('Recurly token ID:', token.id);
        
        // for checking
        // currentUser.account_code="";
        // currentUser.account_id="";

        console.log("user_id: ",currentUser.user_id);

        try {

          const accountRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_SERVER_URL}/account/code/${currentUser.user_id}`
          );
    
          const account = accountRes.data;
          console.log('Fetched account:', account);

          if (account.id) {
            // Account exists
            currentUser.account_id = account.id;
            updateUser(currentUser);
            console.log("account_id: ", currentUser.account_id);
            console.log('Account found');
    
            const res = await axios.put(
              `${import.meta.env.VITE_BACKEND_SERVER_URL}/account/${currentUser.account_id}`,
              {
                  tokenId
              }
            );

            console.log(res.data);
          } else {
            // Account does not exist, proceed with URL2
            console.log('Account not found, creating an account');
            
            const res = await axios.post(
              `${import.meta.env.VITE_BACKEND_SERVER_URL}/account`,
              {
                code: currentUser.user_id,
                billing_info: {
                  token_id: tokenId
                }
              }
            );
  
            console.log("Response result of account creation: ",res.data);
            const account_id = res.data.id;

            currentUser.account_id=account_id;
            // console.log("Account created: ",res.data.account_code, res.data.account_id);
            updateUser(currentUser);
            console.log(currentUser.account_id);
          }
        
        } catch (error) {
            console.log(error.message);
        }

        // further actions

        console.log("Valid Coupon Code: ",validCouponCode);
        let purchaseReq = {
          currency: 'INR',
          account: {
            code: currentUser.user_id,
            billingInfo: {
              tokenId
            }
          },
          planCode: plan.code,
          ...(validCouponCode && { couponCodes: [validCouponCode] })
        }

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_SERVER_URL}/subscription`,
            purchaseReq
          );

          console.log("Subscription added successfully!");
          console.log(res.data);
          toast.success('Subscription added successfully!');
          setTimeout(() => {
            navigate('/membership');
          }, 2000);

        } catch (error) {
          console.log("Error while subscribing: ", error);
          toast.error('Error while subscribing.');
        }
      
        // let invoiceCollection =  client.createPurchase(purchaseReq)
      }
    });
  };

  return (
    <Box 
      mx={{ base: '16px', md: '144px' }} 
      mt={{ base: '10px', md: '20px' }} 
      mb={{ base: '50px', md: '100px' }} 
      p={{ base: '10px', md: '20px' }} 
      color="white" 
      borderRadius="8px" 
      boxShadow="lg"
    >
      {plan ? (
        <>
          <Text fontSize={{ base: 'xl', md: '2xl' }} mb={5} fontWeight="bold">
            Make Payment
          </Text>
          <Box
            border="1px"
            borderColor="gray.700"
            borderRadius="34px"
            p={5}
            mb={5}
            bg="gray.800"
          >
            <Flex align="center" direction={{ base: 'column', md: 'row' }}>
              <Image src="img/i-button.png" alt="Info" boxSize="24px" mr={2} mb={{ base: 2, md: 0 }} />
              <Text>
                You will be charged ₹{plan.price} for a year of {plan.name} plan. Your {plan.name} membership auto-renews every year if purchased using any of these eligible credit, debit cards, or UPI ID.
              </Text>
            </Flex>
          </Box>
          <Text mb={2} fontWeight="bold">Select the payment method</Text>
          <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
            <Stack direction="column" spacing={4}>
              <Radio value="card" size="lg">
                <Text fontSize="lg">CREDIT & DEBIT CARDS</Text>
              </Radio>
              {paymentMethod === 'card' && (
                <Box p={3} border="1px" borderColor="gray.700" borderRadius="md" bg="gray.900">
                  <form id="payment-form" onSubmit={handleCreditSubmit} ref={formRef}>
                    <Flex direction={{ base: 'column', md: 'row' }} mb={3} width="100%" alignItems="center">
                      <Input
                        type="text"
                        placeholder="First Name"
                        bg="gray.700"
                        border="none"
                        width={{ base: '100%', md: '48%' }}
                        mb={{ base: 2, md: 0 }}
                        mr={{ base: 0, md: '2%' }}
                        data-recurly="first_name"
                      />
                      <Input
                        type="text"
                        placeholder="Last Name"
                        bg="gray.700"
                        border="none"
                        width={{ base: '100%', md: '48%' }}
                        data-recurly="last_name"
                      />
                    </Flex>
                    <CardElement />
                    <Flex justifyContent="flex-end" mt={5}>
                      <Button bg="#C5B8EA" width={{ base: '100%', md: '250px' }} size="lg" type="submit">
                        Proceed to Pay Rs.{plan.price}
                      </Button>
                    </Flex>
                  </form>
                  <Text mt={2} fontSize="sm">
                    The CVV number is the last three digits at the back of your card.
                  </Text>
                </Box>
              )}
              <Radio value="netbanking" size="lg">
                <Text fontSize="lg">NET BANKING</Text>
              </Radio>
              {paymentMethod === 'netbanking' && (
                <Box p={3} border="1px" borderColor="gray.700" borderRadius="md" bg="gray.900">
                  <Select placeholder="Select Bank" bg="gray.700" border="none">
                    <option value="bank1">Bank 1</option>
                    <option value="bank2">Bank 2</option>
                    <option value="bank3">Bank 3</option>
                  </Select>
                  <Flex justifyContent="flex-end" mt={5}>
                    <Button mt="30px" bg="#C5B8EA" width={{ base: '100%', md: '250px' }} size="lg">
                      Proceed to Pay
                    </Button>
                  </Flex>
                </Box>
              )}
              <Radio value="upi" size="lg">
                <Text fontSize="lg">OTHER UPI APPS</Text>
              </Radio>
              {paymentMethod === 'upi' && (
                <Box p={3} border="1px" borderColor="gray.700" borderRadius="md" bg="gray.900">
                  <Flex direction={{ base: 'column', md: 'row' }} align="center">
                    <Input placeholder="Enter UPI ID" mr={{ base: 0, md: 2 }} bg="gray.700" border="none" width={{ base: '100%', md: '390px' }} />
                    <Button colorScheme="blue" mt={{ base: 2, md: 0 }}>Verify</Button>
                  </Flex>
                  <Flex justifyContent="flex-end" mt={5}>
                    <Button mt="30px" bg="#C5B8EA" width={{ base: '100%', md: '250px' }} size="lg" onClick={handleUpiSubmit}>
                      Proceed to Pay
                    </Button>
                  </Flex>
                  <Text mt={2} fontSize="sm">
                    You will receive a payment request on your UPI App
                  </Text>
                </Box>
              )}
            </Stack>
          </RadioGroup>
          <Box mt={5}>
            <Input 
              placeholder="Gift cards or promo codes" 
              mb={3} 
              border="none" 
              width={{ base: '100%', md: '250px' }} 
              bg="gray.700" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button colorScheme="blue" mb={3} ml={{ base: 0, md: 5 }} mt={1} onClick={handleCouponApply}>
              Apply
            </Button>
          </Box>
          {couponError && (
            <Text color="red.300" mt={2}>
              {couponError}
            </Text>
          )}
          {couponValid && (
            <Text color="green.300" mt={2}>
              {couponValid}
            </Text>
          )}
          <ToastContainer />
        </>
      ) : (
        <>
          <Text fontSize={{ base: 'xl', md: '2xl' }} mb={5} fontWeight="bold" textAlign="center">
            Please select a Plan to proceed with the payment.
          </Text>
          <Flex justifyContent="center">
            <Button
              mt={4}
              bg="#C5B8EA"
              as={RouterLink}
              to="/select-subscription"
              width={{ base: '100%', md: 'auto' }}
            >
              Select a Plan
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
  
}
