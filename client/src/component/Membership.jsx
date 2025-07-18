import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Link,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spinner,
} from '@chakra-ui/react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Membership() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [activePlan, setActivePlan] = useState(null);

  const [isLoadingActivePlan, setIsLoadingActivePlan] = useState(true); // Loader for active plan
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true); // Loader for subscriptions table

  const navigate = useNavigate();
  
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const accountCode = currentUser.user_id;

  const boxStyles = {
    bg: '#0A0A0A',
    borderRadius: '34px',
    p: '20px',
    mb: '4',
    color: 'white',
  };

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVER_URL}/subscription/account-subscription`,
          { accountCode }
        );

        console.log(res.data);
        const subscriptions = res.data;
        setMySubscriptions(subscriptions);
        setIsLoadingSubscriptions(false); // Data for subscriptions table is loaded

        // Find the active plan
        const activeSubscription = subscriptions.find(
          (sub) => sub.state === 'active'
        );
        setActivePlan(activeSubscription);
        setIsLoadingActivePlan(false); // Data for active plan is loaded
        console.log('Active Plan: ', activeSubscription);
        console.log('Active Plan Object: ', activePlan);
      } catch (error) {
        console.log('Error fetching the subscription details: ', error);
      }
    };

    loadSubscriptions();
  }, [currentUser.user_id]);

  const handleCancelMembership = async () => {
    console.log(activePlan.id);
    if (!activePlan) {
      toast({
        title: 'No active plan.',
        description: "You don't have an active plan to cancel.",
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_SERVER_URL}/subscription/${activePlan.id}/cancel`,
        {
          timeframe: 'term_end',
        }
      );

      toast({
        title: 'Membership Cancelled',
        description: `Your ${activePlan.plan.name} plan has been set to cancel at the end of the term.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Update state to reflect the canceled plan
      setActivePlan(null);
      setMySubscriptions((subs) =>
        subs.map((sub) =>
          sub.id === activePlan.id ? { ...sub, state: 'canceled' } : sub
        )
      );

      // Close the alert dialog
      onClose();
    } catch (error) {
      console.log('Error while cancelling membership: ', error);
    }
  };


  const handleInvoiceClick = async (invoiceId) => {
    console.log(invoiceId);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_SERVER_URL}/invoice/invoice-pdf/${invoiceId}`,
        { responseType: 'blob' } // Expect binary data (PDF file)
    );

    console.log(res.data);
    console.log(typeof res.data);

    const blob = new Blob([res.data], { type: 'application/pdf' });
    console.log(typeof blob);
    console.log(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `invoice-${invoiceId}.pdf`; // Set a default filename

    // Append the link to the body and trigger a click to download the PDF
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);


    // // Create a URL for the PDF Blob
    // const fileURL = URL.createObjectURL(res.data);
    // console.log(fileURL);

    // // Open the PDF in a new tab
    // window.open(fileURL, '_blank');

      // console.log(res.data);
      // const blob = new Blob([res.data], { type: 'application/pdf' });
      // console.log(blob);

      // const fileURL = window.URL.createObjectURL(blob);
        
      // console.log(fileURL);
      // const link = document.createElement('a');
      //   link.href = fileURL;
      //   link.download = `invoice-${invoiceId}.pdf`;
      //   link.click();

      //   // Clean up the URL object
      //   URL.revokeObjectURL(fileURL);
      
      // Create a URL for the PDF blob and open it in a new tab
    //   const fileURL = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    //   window.open(fileURL);
    } catch (error) {
      console.log('Error fetching the invoice PDF: ', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch the invoice PDF. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleOpenCancelDialog = () => {
    if (!activePlan) {
      toast({
        title: "No Active Plan",
        description: "You don't have any active plans.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } else {
      onOpen(); // Open the alert dialog if there is an active plan
    }
  };

  const handleChangePlan = () => {
    navigate('/select-subscription', { state: { subscriptionId: activePlan.id } });
  };

  return (
    <Box maxW="900px" mx="auto" mt="20px" mb="100px" p="20px" color="white">
      <Heading as="h1" fontSize={['2xl', '3xl']} mb="4">
        Membership
      </Heading>
      <Text fontSize={['md', 'lg']} mb="4">
        Your subscription details and payment info
      </Text>

      <Box {...boxStyles}>
        {isLoadingActivePlan ? (
          <Spinner color="purple.500" size="lg" />
        ) : activePlan ? (
          <>
            <Heading as="h2" fontSize={['xl', '2xl']} mb="4">
              Your Plan
            </Heading>
            <Text
              fontSize={['lg', 'xl']}
              color="#6F44E9"
              fontWeight="bold"
              mb="2"
            >
              {activePlan?.plan?.name} Plan ₹{activePlan?.total}/yr
            </Text>
            <Text fontSize={['sm', 'md']}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              faucibus et nisl sit amet feugiat.
            </Text>
            <Button
              mt="4"
              color="#6F44E9"
              fontSize={['sm', 'md']}
              variant="link"
              onClick={handleChangePlan}
            >
              Change Plan &gt;
            </Button>
          </>
        ) : (
          <Text fontSize={['lg', 'xl']} color="#FF0000" fontWeight="bold">
            No Active Plan
          </Text>
        )}
      </Box>

      <Box {...boxStyles}>
        <Heading as="h2" fontSize={['xl', '2xl']} mb="4">
          Redeem Coupons
        </Heading>
        <Text mb="4" fontSize={['sm', 'md']}>
          Have a promo code you’d like to redeem? You’re in the right place.
        </Text>
        <Flex direction={['column', 'row']}>
          <Input
            placeholder="Enter code"
            mb={['4', '0']}
            mr={['0', '4']}
            width={['100%', '300px']}
          />
          <Button bg="#C5B8E9" color="black" borderRadius="14px" width="100%">
            Get Started
          </Button>
        </Flex>
      </Box>

      <Box {...boxStyles}>
        <Heading as="h2" fontSize={['xl', '2xl']} mb="4">
          Billing & Redemption History
        </Heading>
        {isLoadingSubscriptions ? (
          <Spinner color="purple.500" size="lg" />
        ) : (
        <Box overflowX="auto">
          <Table variant="simple" size={['sm', 'md']}>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Description</Th>
                <Th>Service Period</Th>
                <Th>Plan Status</Th>
                <Th>Total</Th>
                <Th>Invoice</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mySubscriptions.map((sub, index) => (
                <Tr key={index}>
                  <Td>
                    {new Date(sub.currentPeriodStartedAt).toLocaleDateString()}
                  </Td>
                  <Td>{sub.plan.name} Plan</Td>
                  <Td>
                    {new Date(sub.currentPeriodStartedAt).toLocaleDateString()} -{' '}
                    {new Date(sub.currentTermEndsAt).toLocaleDateString()}
                  </Td>
                  <Td>{sub.state}</Td>
                  <Td>₹{sub.total}</Td>
                  <Td>
                    <Image
                      src="/img/pdf.jpg" // Update with your actual image path
                      alt="View Invoice"
                      cursor="pointer"
                      onClick={() => handleInvoiceClick(sub.activeInvoiceId)}
                      width="24px"
                      height="24px"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        )}
      </Box>

      <Button
        bg="transparent"
        color="red"
        border="1px"
        borderColor="red"
        borderRadius="14px"
        mt="4"
        onClick={handleOpenCancelDialog} // Use the new handler
        width="100%"
      >
        Cancel Membership
      </Button>

      {/* AlertDialog for cancel confirmation */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Membership
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to cancel your membership? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={handleCancelMembership} ml={3}>
                Yes, Cancel it
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
