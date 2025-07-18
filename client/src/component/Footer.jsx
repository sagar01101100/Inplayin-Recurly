import React from 'react';
import { Box, Flex, Link, Image, Stack } from '@chakra-ui/react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // This enables smooth scrolling
    });
  };

  return (
    <Box mx={['20px', '50px', '100px']} py={4} color="white">
      <Flex
        as="footer"
        p={['5px', '10px']}
        alignItems="center"
        direction={['column', 'row']}
        justifyContent="space-between"
      >
        <Stack direction={['column', 'row']} spacing={['10px', '20px', '30px']} textAlign={['center', 'left']}>
          <Link href="https://www.inplayin.com/#about-us" color="#0088FF" _hover={{ textDecoration: 'none' }}>About us</Link>
          <Link href="https://www.inplayin.com/#technology" color="#0088FF" _hover={{ textDecoration: 'none' }}>Technology</Link>
          {/* <Link href="#games">Games</Link> */}
        </Stack>

        <Stack
          direction={['column', 'row']}
          spacing={['10px', '20px', '30px']}
          mt={['10px', '0']}
          textAlign={['center', 'right']}
        >
          <Link href="https://instagram.com" color="#0088FF" _hover={{ textDecoration: 'none' }} isExternal>
            Instagram
          </Link>
          <Link href="https://facebook.com" color="#0088FF" _hover={{ textDecoration: 'none' }} isExternal>
            Facebook
          </Link>
          <Link href="https://linkedin.com" color="#0088FF" _hover={{ textDecoration: 'none' }} isExternal>
            LinkedIn
          </Link>
        </Stack>
      </Flex>

      <Flex
        as="footer"
        p={['5px', '10px']}
        alignItems="center"
        justifyContent="space-between"
        direction={['column', 'row']}
        textAlign="center"
      >
        <Link href="#privacy-policy" mb={['10px', '0']}>
          Privacy Policy
        </Link>

        <Box display={['none', 'block']} mt={['10px', '0']} mx="auto">
          <Image src="img/logo.png" alt="Image 1" height="50px" onClick={scrollToTop} cursor="pointer" ml={40}/>
        </Box>

        <Link href="#copyright">
          Copyright 2024 inplayin All rights reserved
        </Link>
      </Flex>
    </Box>
  );
}
