import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Flex direction="column" alignItems="center" justifyContent="center">
      <p>{currentUser?.user_id}</p>
      <Link to="/select-subscription">
        <Button colorScheme="blue" mt={4} mb={10}>
          Select Subscription
        </Button>
      </Link>

      {currentUser && <Link to="/membership">
        <Button colorScheme="blue" mt={4} mb={10}>
          Your Membership
        </Button>
      </Link>}
    </Flex>
  );
}
