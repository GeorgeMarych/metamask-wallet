import { Button, Paper, Stack, Typography } from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [accountAddress, setAccountAddress] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [networkName, setNetworkName] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", chainChanged);
    }
  }, []);

  const connectHandler = async () => {
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const chainID = await window.ethereum.request({
          method: "eth_chainId",
        });
        const data = await ethers.providers.getNetwork(parseInt(chainID));
        setNetworkName(data.name);
        const result = await res[0];
        accountsChanged(result);
        setAccountAddress(result);
      } catch (err) {
        console.error(err);
        setErrorMessage("There was a problem connecting to MetaMask");
      }
    } else {
      setErrorMessage("Install MetaMask extension");
    }
  };

  const accountsChanged = async (newAccount) => {
    setAccountAddress(newAccount);
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [newAccount.toString(), "latest"],
      });
      setAccountBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  };

  const chainChanged = async (_chainId) => {
    const data = await ethers.providers.getNetwork(parseInt(_chainId));
    setNetworkName(data.name);
    setAccountAddress(null);
    setAccountBalance(null);
    setErrorMessage(null);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack
        sx={{ width: 1 / 2 }}
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Typography variant="h5">Network: {networkName}</Typography>
        <Typography variant="h5">Account: {accountAddress}</Typography>
        <Typography variant="h5">Balance: {accountBalance}</Typography>
        <Button
          onClick={connectHandler}
          sx={{ width: 1 / 2 }}
          variant="contained"
        >
          Connect to a wallet
        </Button>
        {errorMessage ? (
          <Typography variant="body1" color="red">
            Error: {errorMessage}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default WalletCard;
