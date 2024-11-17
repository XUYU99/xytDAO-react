import React, { useState, useEffect } from "react";
import {
  ChakraBaseProvider,
  Box,
  Text,
  Input,
  Button,
  Flex,
  Spacer,
  Progress,
} from "../setting/component";
import NavBar from "./00-NavBar";
import { proposeLog } from "../kokoDao/02-propose";
import { voteLog } from "../kokoDao/03-vote";
import ProposalData from "./proposalData";
const ProposalDetail = ({ accounts, setAccounts }) => {
  return (
    <div>
      <NavBar accounts={accounts} setAccounts={setAccounts} />
      <ChakraBaseProvider>
        <h1>detail page</h1>
        <ProposalData></ProposalData>
      </ChakraBaseProvider>
    </div>
  );
};

export default ProposalDetail;
