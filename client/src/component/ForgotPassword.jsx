import React, { useState } from 'react';
import { Box, Heading, Text, Input, Button, useToast, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [referenceId, setReferenceId] = useState(null);
  const [userId, setUserId] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/generate-otp`, {
        email,
      });

      if (!res.data.error) {
        setOtpSent(true);
        setReferenceId(res.data.data.reference_id);

        toast({
          title: 'OTP Sent',
          description: res.data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify-otp`, {
        email,
        otp,
        reference_id: referenceId,
      });

      if (!res.data.error) {
        setOtpVerified(true);
        setUserId(res.data.data.updateStatusObj.user_id);

        toast({
          title: 'OTP Verified',
          description: res.data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reset-password`,
        {
          user_id: userId,
          password: newPassword,
        }
      );

      if (!res.data.error) {
        toast({
          title: 'Password Reset',
          description: res.data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        navigate('/sign-in');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxW={{ base: '90%', sm: '400px' }}
      mx='auto'
      mt='10px'
      mb='100px'
      p={{ base: '10px', sm: '20px' }}
      bg='black'
      color='white'
      borderRadius='8px'
      boxShadow='lg'
    >
      <Heading as='h1' fontSize={{ base: 'xl', sm: '2xl' }} mb='4'>
        Forgot Password
      </Heading>
      <Text fontSize={{ base: 'md', sm: 'lg' }} mb='4'>
        {otpVerified ? 'Enter your new password' : 'Enter your email to receive a password reset OTP'}
      </Text>

      <form onSubmit={otpVerified ? handleResetPassword : otpSent ? handleVerifyOtp : handleForgotPassword}>
        {!otpVerified && (
          <>
            <Input
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color='white'
              mb='2'
              isDisabled={otpSent}
              size={{ base: 'sm', sm: 'md' }}
            />

            {otpSent && (
              <Input
                type='text'
                placeholder='Enter OTP'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                color='white'
                mb='2'
                size={{ base: 'sm', sm: 'md' }}
              />
            )}
          </>
        )}

        {otpVerified && (
          <>
            <Input
              type='password'
              placeholder='New Password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              color='white'
              mb='2'
              size={{ base: 'sm', sm: 'md' }}
            />
            <Input
              type='password'
              placeholder='Confirm New Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              color='white'
              mb='2'
              size={{ base: 'sm', sm: 'md' }}
            />
          </>
        )}

        {error && <Text color='red.500' mb='4'>{error}</Text>}

        <Button
          type='submit'
          bg='#FF0D17'
          color='white'
          isLoading={isLoading}
          width='full'
          size={{ base: 'sm', sm: 'md' }}
        >
          {otpVerified ? 'Reset Password' : otpSent ? 'Verify OTP' : 'Send Reset Link'}
        </Button>
      </form>
    </Box>
  );
}
