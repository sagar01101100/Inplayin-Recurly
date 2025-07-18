import React, { useEffect, useState } from 'react';
import { Box, Heading, Text } from "@chakra-ui/react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { profileId } = useParams();
  console.log("profile: ",profileId);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-user-profile?profile_id=${profileId}`);

        if (!response.data.error) {
          setProfileData(response.data.data.profile);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('Failed to fetch user profile. Please try again later.');
      }
    };

    fetchUserProfile();
  }, [profileId]);

  if (error) {
    return (
      <Box bg="black" color="white" p="20px" borderRadius="8px" boxShadow="lg">
        <Heading as="h1" mb="4">Error</Heading>
        <Text>{error}</Text>
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box bg="black" color="white" p="20px" borderRadius="8px" boxShadow="lg">
        <Heading as="h1" mb="4">Loading...</Heading>
        <Text>Please wait while we fetch your profile.</Text>
      </Box>
    );
  }

  return (
    <Box bg="black" color="white" p="20px" borderRadius="8px" boxShadow="lg">
      <Heading as="h1" mb="4">User Profile</Heading>
      <Text mb="2"><strong>Name:</strong> {profileData.profile_name}</Text>
      <Text mb="2"><strong>Email:</strong> {profileData.email}</Text>
      <Text mb="2"><strong>Mobile:</strong> {profileData.country_code} {profileData.mobile}</Text>
      <Text mb="2"><strong>Country:</strong> {profileData.country_name || profileData.country}</Text>
      <Text mb="2"><strong>Gender:</strong> {profileData.gender === '0' ? 'Male' : 'Female'}</Text>
    </Box>
  );
};

export default Profile;
