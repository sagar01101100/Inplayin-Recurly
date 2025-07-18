import React, { useState } from 'react';
import { Box, Flex, Heading, Text, Link as ChakraLink, Input, Button, HStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function SignUp() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);

    const user_name = formData.get("user_name");
    const email = formData.get("email");
    const country_code = formData.get("country_code");
    const mobile = formData.get("mobile");
    const password = formData.get("password");
    const re_password = formData.get("re_password");

    if (password !== re_password) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        {
          user_name,
          email,
          country_code,
          mobile,
          password,
        }
      );

      console.log(res.data);

      if (!res.data.error) {
        console.log(res.data.message);
        const reference_id = res.data.data.otp_reference_id;
        const user_id = res.data.data.user_id;

        console.log(user_id);

        navigate('/otp-verify', { state: { reference_id, user_id, email } });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
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
      p={{ base: "10px", sm: "20px" }} 
      bg="black" 
      color="white" 
      borderRadius="8px" 
      boxShadow="lg"
    >
      <Heading as="h1" fontSize={{ base: "xl", sm: "2xl" }} mb="4">
        Sign Up
      </Heading>
      <Text fontSize={{ base: "md", sm: "lg" }} mb="4">
        Sign up to manage your subscriptions
      </Text>

      <Flex 
        direction={{ base: "column", sm: "row" }} 
        justifyContent="flex-start" 
        alignItems="center" 
        mt="4"
      >
        <Text fontSize={{ base: "sm", sm: "md" }}>
          Already have an account?{" "}
          <ChakraLink as={Link} to="/sign-in" color="#FF0D17" fontWeight="bold">
            Sign In
          </ChakraLink>
        </Text>
      </Flex>

      <Box mt="4">
        <form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Name" 
            name="user_name" 
            color="white" 
            mb="2" 
            size={{ base: "sm", sm: "md" }}
          />
          <Input 
            type="email" 
            placeholder="E-mail" 
            name="email" 
            color="white" 
            mb="2" 
            size={{ base: "sm", sm: "md" }}
          />

          <Input 
            type="text" 
            placeholder="Country Code" 
            name="country_code" 
            color="white" 
            mb="2" 
            size={{ base: "sm", sm: "md" }}
          />

          <Input 
            type="text" 
            placeholder="Mobile Number" 
            name="mobile" 
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
          <Input 
            type="password" 
            placeholder="Re-enter Password" 
            name="re_password" 
            color="white" 
            mb="2" 
            size={{ base: "sm", sm: "md" }}
          />

          {error && (
            <Text color="red.500" mb="2">{error}</Text>
          )}

          <Flex justifyContent="flex-end">
            <Button 
              type="submit" 
              bg="#C1C1C1" 
              color="black" 
              isLoading={isLoading}
              size={{ base: "sm", sm: "md" }}
            >
              Create Account
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
}
