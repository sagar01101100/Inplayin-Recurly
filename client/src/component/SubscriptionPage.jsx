import React, { useState } from 'react';
import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import plans from '../plan.js';

export default function SubscriptionPage() {
    const [selected, setSelected] = useState("");
    const navigate = useNavigate();

    const location = useLocation();
    const { subscriptionId } = location.state || {};
    console.log("SubsId: ", subscriptionId);

    
    const boxStyles = {
        borderRadius: "10px",
        p: { base: "12px", md: "20px" },
        textAlign: "center",
        flexBasis: { base: "100%", sm: "48%", md: "22%" },
        mb: "4",
        position: "relative",
        overflow: "hidden",
        _before: {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgGradient: "linear(to-br, rgba(111, 68, 233, 0.5), rgba(93, 57, 129, 0.5))",
            opacity: 0.4,
            zIndex: 0,
        },
        _hover: {
            _before: {
                bgGradient: "linear(to-t, rgba(93, 57, 129, 0.5), rgba(111, 68, 233, 0.5))",
            },
        },
    };
    
    const handleSelect = (plan) => {
        console.log(selected);
        if (selected === plan) {
            setSelected(""); // Unselect if the same plan is clicked again
        } else {
            setSelected(plan); // Select the clicked plan
        }
    };

    const handleContinue = () => {
        const selectedPlan = selected || "Free-Trial"; // Default plan if none selected

        // Store selected plan in localStorage
        localStorage.setItem('selectedPlan', selectedPlan);

        // Navigate to the /payment page
        navigate('/payment', { state: { subscriptionId } }); 
    };

    const getPeriodText = (months) => {
        if (months === 1) return '/month';
        if (months === 6) return 'per 6 months';
        if (months === 12) return '/year';
        return `per ${months} months`;
    };

    const handleManageMembership = () => {
        navigate('/membership');
    };
    

    return (
        <Box mx={{ base: "16px", md: "144px" }} mt="20px" mb="100px" p="20px" color="white" borderRadius="8px" boxShadow="lg">
            {/* <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }} mb="4">Subscription</Heading> */}

            <Flex justifyContent="space-between" alignItems="center" mb="4">
                <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }}>Subscription</Heading>
                <Button 
                    bg="#C5B8E9" 
                    color="black" 
                    onClick={handleManageMembership}
                    borderRadius="14px"
                >
                    Manage Membership
                </Button>
            </Flex>
            <Text fontSize={{ base: "md", md: "lg" }} mb="4">Select the plan you want to subscribe to</Text>

            <Flex justifyContent="space-between" mt="4" wrap="wrap">
                {plans.map((plan, index) => (
                    <Box key={index} {...boxStyles}>
                        <Text fontSize="2xl" color="white" mb="2" fontWeight="bold">{plan.name}</Text>
                        <Text fontSize="3xl" color="#6F44E9" fontWeight="bold" borderRadius="8px" p="2px">Rs. {plan.price}</Text>
                        <Text fontSize="md" color="#6F44E9" borderRadius="8px" mb="2" fontWeight="bold">{getPeriodText(plan.month)}</Text> 
                        <Text fontSize="sm" color="white" textAlign="center">{plan.text}</Text>
                        <Button
                            mt="4"
                            bg={selected === plan.name ? 'white' : 'black'}
                            borderRadius="22px"
                            borderColor={selected === plan.name ? 'black' : 'white'}
                            border="1px"
                            color={selected === plan.name ? 'black' : 'white'}
                            onClick={() => handleSelect(plan.name)}
                        >
                            {selected === plan.name ? 'Selected' : 'Select'}
                        </Button>
                    </Box>
                ))}
            </Flex>
            <Flex justifyContent="flex-end" mt="4">
                <Button
                    bg="#C5B8E9"
                    borderRadius="14px"
                    color="black"
                    onClick={handleContinue}
                >
                    Continue
                </Button>
            </Flex>
        </Box>
    );
}
