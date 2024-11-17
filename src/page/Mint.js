// Mint.js
"use client";
import React, { useState } from "react";

import NavBar from "./00-NavBar";
import MintCoin from "./01-mintCoin";

function Mint({ accounts, setAccounts }) {
  return (
    <div>
      <NavBar accounts={accounts} setAccounts={setAccounts} />
      <MintCoin />
    </div>
  );
}

export default Mint;
