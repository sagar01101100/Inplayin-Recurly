import React, { useContext, useEffect, useState } from 'react';
import { Box, Heading, Text, Avatar, Spinner, Center } from "@chakra-ui/react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function UserDetails() {
  const { currentUser } = useContext(AuthContext);
  
  const { profileId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/get-user-profile?profile_id=${profileId}`, {
            auth_token: currentUser.auth_token
        });

        if (!res.data.error) {
          setUserDetails(res.data.data.profile);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong, please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [profileId]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Box p="20px" color="red.500">
        <Text>{error}</Text>
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto" mt="50px" p="20px" bg="white" borderRadius="8px" boxShadow="lg">
      <Flex alignItems="center" mb="4">
        <Avatar src={userDetails.profile_image || "img/avatar2.avif"} size="xl" />
        <Box ml="4">
          <Heading as="h2" fontSize="2xl">{userDetails.profile_name || "User"}</Heading>
          <Text fontSize="lg" color="gray.600">{userDetails.email}</Text>
        </Box>
      </Flex>
      <Text fontSize="lg" color="gray.800" mb="2"><strong>Mobile:</strong> {userDetails.mobile}</Text>
      <Text fontSize="lg" color="gray.800" mb="2"><strong>Country:</strong> {userDetails.country_name || "N/A"}</Text>
      <Text fontSize="lg" color="gray.800" mb="2"><strong>Gender:</strong> {userDetails.gender === "1" ? "Male" : "Female"}</Text>
      <Text fontSize="lg" color="gray.800" mb="2"><strong>Height:</strong> {userDetails.height ? `${userDetails.height} cm` : "N/A"}</Text>
      <Text fontSize="lg" color="gray.800"><strong>Weight:</strong> {userDetails.weight ? `${userDetails.weight} kg` : "N/A"}</Text>
    </Box>
  );
}
