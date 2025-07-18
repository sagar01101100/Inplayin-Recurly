import React, { useContext, useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Link as ChakraLink, Input, Button } from "@chakra-ui/react";
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

export default function SignIn() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/select-subscription");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const user_name = formData.get("user_name");
    const password = formData.get("password");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          user_name,
          password,
          device_token: ""
        }
      );

      console.log(res.message);

      if (!res.data.error) {
        updateUser({...res.data.data, user_name, account_code: "", account_id: ""});
        navigate("/select-subscription");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      maxW={{ base: "100%", sm: "400px" }} 
      mx={{ base: "16px", sm: "auto" }} 
      mt="10px" 
      mb="100px" 
      p="20px" 
      bg="black" 
      color="white" 
      borderRadius="8px" 
      boxShadow="lg"
    >
      <Heading as="h1" fontSize={{ base: "xl", sm: "2xl" }} mb="4">
        Sign In
      </Heading>
      <Text fontSize={{ base: "md", sm: "lg" }} mb="4">
        Sign in to manage your subscriptions
      </Text>

      <Flex 
        direction={{ base: "column", sm: "row" }} 
        justifyContent={{ base: "flex-start", sm: "space-between" }} 
        alignItems="center" 
        mt="4"
      >
        <Text fontSize={{ base: "sm", sm: "md" }}>
          Don’t have an account? 
          <ChakraLink as={RouterLink} to="/sign-up" color="#FF0D17" fontWeight="bold">
            Sign Up
          </ChakraLink>
        </Text>
      </Flex>

      <Box mt="4">
        <form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="User Name" 
            name="user_name" 
            color="white" 
            mb="2" 
            size={{ base: "sm", sm: "md" }}
          />
          <Input 
            type="password" 
            placeholder="Password" 
            name="password" 
            color="white" 
            mb="2" 
            size={{ base: "sm", sm: "md" }}
          />

          {error && <Text color="red.500" mb="4">{error}</Text>}

          <Box mb="2">
            <ChakraLink as={RouterLink} to="/forgot-password" color="#FF0D17">Forgot Password?</ChakraLink>
          </Box>

          <Flex justifyContent="flex-end">
            <Button 
              type="submit" 
              bg="#C1C1C1" 
              color="black" 
              isLoading={isLoading}
              size={{ base: "sm", sm: "md" }}
            >
              Continue
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
}
