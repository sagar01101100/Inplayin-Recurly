import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Input, Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUpVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location.state || !location.state.reference_id || !location.state.email) {
      navigate('/sign-up');
    }
  }, [location, navigate]);

  const { reference_id, email } = location.state || {};

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify-otp`, {
        email,
        otp,
        reference_id
      });

      if (!response.data.error) {
        console.log(response.data);
        navigate('/sign-in');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      maxW={{ base: "90%", sm: "400px" }} 
      mx="auto" 
      mt="10px" 
      mb="100px" 
      p={{ base: "10px", sm: "20px" }} 
      bg="black" 
      color="white" 
      borderRadius="8px" 
      boxShadow="lg"
    >
      <Heading as="h1" fontSize={{ base: "xl", sm: "2xl" }} mb="4">
        Verify OTP
      </Heading>
      <Text fontSize={{ base: "md", sm: "lg" }} mb="4">
        Enter the OTP sent to your email
      </Text>

      <Box mt="4">
        <form onSubmit={handleVerifyOtp}>
          <Input
            type="text"
            placeholder="Enter OTP"
            color="white"
            mb="2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            size={{ base: "sm", sm: "md" }}
          />
          {error && <Text color="red.500" mb="4">{error}</Text>}
          <Flex justifyContent="flex-end">
            <Button 
              type="submit" 
              bg="#C1C1C1" 
              color="black" 
              isLoading={isLoading}
              size={{ base: "sm", sm: "md" }}
            >
              Verify
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
}
