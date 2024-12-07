import React, { useState } from "react";
import {
  ChakraBaseProvider,
  Box,
  Text,
  Input,
  Button,
  Flex,
  Spacer,
} from "./component";
import { proposeLog } from "./kokoDao/02-propose";
const ProposalData = () => {
  const [proposalData, setproposalData] = useState("null");
  function handleData() {
    console.log("proposeLog: ", proposeLog);
    const targets = proposeLog[0].targets;

    setproposalData(proposeLog[0]);
  }

  return (
    <div>
      <ChakraBaseProvider>
        <Box
          border="1px solid #E2E8F0"
          borderRadius="md"
          padding="4"
          maxW="380px"
          maxH="1000px"
          margin="auto 20px"
          boxShadow="md"
        >
          <Text fontSize="12px" color="gray.500">
            {proposalData.timestamp}
          </Text>

          <Text fontSize="15px" marginTop="2">
            Proposal Description: {proposalData.description}
          </Text>
          <Text fontSize="13px" color="gray.500" marginTop="2">
            Proposal ID: {proposalData.proposalId}
          </Text>
          {/* <Flex marginTop="2"></Flex>

          <Text fontSize="sm" color="gray.500" marginTop="2">
            ⏰ POLL ENDED
          </Text>

          <Flex
            justifyContent="space-between"
            fontSize="sm"
            color="gray.400"
            marginTop="1"
          >
            <Text>79%</Text>
            <Text>0%</Text>
            <Text>2%</Text>
          </Flex> */}

          <Button
            size="md"
            variant="outline"
            marginTop="3"
            whiteSpace="normal"
            wordBreak="break-all"
          >
            Transaction Hash:{" "}
            {proposalData.transactionHash
              ? proposalData.transactionHash.slice(0, 9) + "..."
              : ""}{" "}
          </Button>
          <Box
            bg="gray.100"
            padding="3"
            borderRadius="md"
            marginTop="3"
            textAlign="center"
          >
            <Text fontSize="sm" fontWeight="bold">
              website
            </Text>
          </Box>
        </Box>
        <Button fontSize="18px" margin="10px" onClick={handleData}>
          refesh
        </Button>
      </ChakraBaseProvider>
    </div>
  );
};
// targets: targets,
// values: values,
// calldatas: calldatas,
// description: description,
// proposalId: proposalId,
// transactionHash: proposeTx.hash,
export default ProposalData;
