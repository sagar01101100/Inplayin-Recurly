import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Text,
  RadioGroup,
  Stack,
  Radio,
  Input,
  Button,
  Image,
  Select,
  Flex,
} from '@chakra-ui/react';
import { useRecurly, CardElement } from '@recurly/react-recurly';

export default function PaymentCopy() {
  const [paymentMethod, setPaymentMethod] = useState('');
  const recurly = useRecurly();
  
  const formRef = React.useRef();

  const handleCreditSubmit = (event) => {
    event.preventDefault();

    recurly.token(formRef.current, (err, token) => {
      if (err) {
        // handle error
        console.error('Recurly tokenization error:', err);
      } else {
        // save the token.id, and submit it to the Recurly API from your server
        console.log('Recurly token ID:', token.id);
      }
    });
    
    // const elements = recurly.Elements();
    // const form = event.target;
    // console.log("Form before tokenization:", form);
    // console.log("Elements before tokenization:", elements);

    // try {

    //   function tokenHandler(err, token){
    //     if (err) {
    //       console.error('Recurly tokenization error:', err);
    //     } else {
    //       console.log('Recurly token ID:', token.id);
    //       // Here you would typically send the token to your server
    //       form.submit();
    //     }
    //   }

    //   recurly.token(elements, document.querySelector('payment-form'), tokenHandler);
    // } catch (error) {
    //   console.error("Error during tokenization:", error);
    // }
  };

  // useEffect(() => {
  //   if (paymentMethod === 'card') {
  //     const elements = recurly.Elements();
  //     const cardElement = elements.CardElement({
  //       inputType: 'mobileSelect',
  //       style: {
  //         fontSize: '1em',
  //         backgroundColor: 'gray.700',
  //         placeholder: {
  //           color: 'gray !important',
  //           fontWeight: 'bold',
  //           content: {
  //             number: 'Card number',
  //             cvv: 'CVC',
  //             month: 'MM',
  //             year: 'YYYY'
  //           }
  //         },
  //         invalid: {
  //           fontColor: 'red'
  //         }
  //       }
  //     });
  //     try {
  //       console.log("Card Element attached successfully!");
  //       cardElement.attach('#recurly-elements');
  //     } catch (error) {
  //       console.error('Error attaching CardElement:', error);
  //     }
  //   }
  // }, [paymentMethod, recurly]);

  return (
    <Box mx="144px" mt="20px" mb="100px" p="20px" color="white" borderRadius="8px" boxShadow="lg">
      <Text fontSize="2xl" mb={5} fontWeight="bold">
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
        <Flex align="center">
          <Image src="img/i-button.png" alt="Error" boxSize="24px" mr={2} />
          <Text>
            You will be charged ₹123 for a year of Premium. Your Premium membership auto-renews every year if purchased using any of these eligible credit, debit cards, or UPI ID.
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
                <Input 
                type="text"
                placeholder="First Name" mb={3} bg="gray.700" border="none" width="390px" data-recurly="first_name" />
                <Input 
                type="text"
                placeholder="Last Name" mb={3} bg="gray.700" border="none" width="390px" data-recurly="last_name" />
                {/* <Box id="recurly-elements" mb={3}></Box> */}
                {/* <Input type="hidden" name="recurly-token" data-recurly="token" /> */}
                <CardElement/>
                <Flex justifyContent="flex-end" mt={5}>
                  <Button bg="#C5B8EA" width="250px" size="lg" type='submit'>Proceed to Pay</Button>
                </Flex>
              </form>

              <Text mt={2} fontSize="sm">The CVV number is the last three digits at the back of your card.</Text>
            </Box>
          )}
          <Radio value="netbanking" size="lg">
            <Text fontSize="lg">NET BANKING</Text>
          </Radio>
          {paymentMethod === 'netbanking' && (
            <Box p={3} border="1px" borderColor="gray.700" borderRadius="md" bg="gray.900" width="390px">
              <Select placeholder="Select Bank" bg="gray.700" border="none">
                <option value="bank1" style={{ backgroundColor: 'black', color: 'white' }}>Bank 1</option>
                <option value="bank2" style={{ backgroundColor: 'black', color: 'white' }}>Bank 2</option>
                <option value="bank3" style={{ backgroundColor: 'black', color: 'white' }}>Bank 3</option>
              </Select>

              <Flex justifyContent="flex-end" mt={5}>
                <Button mt="30px" bg="#C5B8EA" width="250px" size="lg">Proceed to Pay</Button>
              </Flex>
            </Box>
          )}
          <Radio value="upi" size="lg">
            <Text fontSize="lg">OTHER UPI APPS</Text>
          </Radio>
          {paymentMethod === 'upi' && (
            <Box p={3} border="1px" borderColor="gray.700" borderRadius="md" bg="gray.900">
              <Flex>
                <Input placeholder="Enter UPI ID" mr={2} bg="gray.700" border="none" width="390px" />
                <Button colorScheme="blue">Verify</Button>
                <Flex justifyContent="flex-end" mt={5}>
                  <Button mt="30px" bg="#C5B8EA" width="250px" size="lg">Proceed to Pay</Button>
                </Flex>
              </Flex>
              <Text mt={2} fontSize="sm">You will receive a payment request on your UPI App</Text>
            </Box>
          )}
        </Stack>
      </RadioGroup>
      <Box mt={5}>
        <Input placeholder="Gift cards or promo codes" mb={3} border="none" width="250px" bg="gray.700" />
        <Button colorScheme="blue" mb={3} ml={5} mt={1}>Apply</Button>
      </Box>
    </Box>
  );
}
