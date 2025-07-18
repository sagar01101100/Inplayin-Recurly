import React, { useContext } from 'react';
import { Box, Button, Flex, Spacer, Text, Image, Avatar } from "@chakra-ui/react";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (currentUser) {
      navigate(`/user-details/${currentUser.user_id}`);
    }
  };

  const handleSignInClick = () => {
    navigate('/sign-in');
  };

  return (
    <Flex 
      as="nav" 
      p={{ base: "8px", md: "10px" }} 
      alignItems="center" 
      wrap="wrap"
    >
      <Box ml={{ base: "8px", md: "54px" }} mt={{ base: "4px", md: "7px" }}>
        <Image 
          src="img/inplayin.png" 
          alt="Inplayin Logo" 
          height={{ base: "50px", md: "86px" }} 
        />
      </Box>

      <Spacer />

      <Box 
        mr={{ base: "8px", md: "158px" }} 
        mt={{ base: "8px", md: "20px" }}
      >
        {currentUser ? (
          <Flex alignItems="center" onClick={handleProfileClick} cursor="pointer">
            <Avatar 
              src="img/avatar2.avif" 
              width={{ base: "36px", md: "46px" }} 
            />
            <Text ml="2" color="white" fontSize={{ base: "16px", md: "20px" }}>
              {currentUser.user_name}
            </Text>
          </Flex>
        ) : (
          <Button
            borderRadius="14px"
            bg="#C5B8E9"
            onClick={handleSignInClick}
            fontSize={{ base: "14px", md: "16px" }}
            padding={{ base: "8px 12px", md: "10px 16px" }}
          >
            Sign In
          </Button>
        )}
      </Box>
    </Flex>
  );
}
