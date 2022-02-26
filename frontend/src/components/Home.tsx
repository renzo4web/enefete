import React, { useState, useEffect, useRef } from "react";
import { EpicNFT } from "../../../typechain/EpicNFT";
import {
  ConnectWallet,
  useWallet,
  useWriteContract,
  useTransaction,
} from "@web3-ui/core";
import { NFT, NFTGallery } from "@web3-ui/components";
import { ethers } from "ethers";
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Fade,
  Heading,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  useToast,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import EpicNFTAbi from "../../../artifacts/contracts/EpicNFT.sol/EpicNFT.json";
import { useReadOnlyProvider } from "@web3-ui/hooks";
import { trimInput } from "../utils/helpers";

const CONTRACT_ADDRESS = "0x06c21852E64639F30585865d12a5Be1AB1C55C30";

function Home() {
  // State / Props
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [address, setAddress] = useState("");
  const [words, setWords] = useState("");
  const provider = useReadOnlyProvider(
    "https://eth-rinkeby.alchemyapi.io/v2/9PV3-6R3ofq4XeN_1gAB2SNEK2IKpY04"
  );
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [nftGallery, setNftGallery] = useState<any>(null);
  const {
    connected,
    correctNetwork,
    switchToCorrectNetwork,
    connection,
    disconnectWallet,
  } = useWallet();
  const [nftContract, isReady] = useWriteContract<EpicNFT>(
    CONTRACT_ADDRESS,
    EpicNFTAbi.abi
  );
  const [execute, loading, error] = useTransaction(nftContract?.makeNFT);
  const toastId = useRef("tost");

  // Hooks
  useEffect(() => {
    console.log("correctNetwork", correctNetwork);
    console.log("contracts", nftContract);
    console.log("address", address);
  }, [correctNetwork, address]);

  useEffect(() => {
    nftContract?.on("NewEpicNFTMinted", (from, tokenId) => {
      console.log(from, tokenId.toNumber());
      setTokenId(tokenId);
      alert(
        `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
      );
    });
  }, [isReady]);

  // Functions
  const onChangeInputAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleChangeWords = (event) => {
    setWords(event.target.value);
  };

  const onSubmitForm = async () => {
    try {
      // TODO: add word
      onClose();
      await execute([]);
      setWords("");
    } catch (error) {
      console.warn(error);
    }
  };

  const onClickMint = async () => {
    if (nftContract && isReady) {
      const r = await execute([]);
      console.log(r);
    }
  };

  const onClickSwitchToCorrectNetwork = () => {
    switchToCorrectNetwork();
  };

  // Renders
  return (
    <Container
      maxW="container.lg"
      centerContent
      py="10"
      justifyContent="center"
    >
      <Badge colorScheme="purple" variant="subtle" rounded="md">
        ⚠️ Contract functions to be used on network: <code>rinkeby</code>{" "}
      </Badge>
      <Box alignItems="center" mt="auto">
        {loading && <Progress size="lg" isIndeterminate />}
        <Heading
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgClip="text"
          fontSize="6xl"
          fontWeight="extrabold"
        >
          NFT Gradient
        </Heading>
        {connected ? (
          <Badge variant="outline">
            Click the button again to disconnect the wallet.
          </Badge>
        ) : null}
        <Box>
          <ConnectWallet />
        </Box>

        {error &&
          toast({
            title: "Transaction failed",
            description: `${error?.message}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          })}

        {!correctNetwork && (
          <Box>
            <Tooltip label="You are on the wrong network change Rinkeby">
              <Button
                colorScheme="purple"
                variant="outline"
                onClick={onClickSwitchToCorrectNetwork}
              >
                Switch to Rinkeby
              </Button>
            </Tooltip>
          </Box>
        )}

        {connected && correctNetwork && !loading ? (
          <Fade in={connected}>
            <Box>
              <p>
                <strong>Current Network:</strong>{" "}
                <code>{connection?.network ?? "Unknown"}</code>
              </p>
              <Center>
                <Button onClick={onOpen} size="lg" colorScheme="blue">
                  Mint
                </Button>

                <Modal
                  isCentered
                  onClose={onClose}
                  isOpen={isOpen}
                  motionPreset="slideInBottom"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader margin="3%">
                      Write three words that come to your mind
                      {words}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Input
                        isInvalid={trimInput(words).split(" ").length > 3}
                        value={words}
                        onChange={handleChangeWords}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="gray" mr={3} onClick={onClose}>
                        Close
                      </Button>
                      {words.length > 0 && (
                        <Button
                          variant="outline"
                          colorScheme="purple"
                          onClick={onSubmitForm}
                        >
                          Mint
                        </Button>
                      )}
                    </ModalFooter>
                  </ModalContent>
                </Modal>

                <Button
                  ml="5%"
                  size="lg"
                  onClick={() => setShowGallery((b) => !b)}
                  colorScheme={showGallery ? "gray" : "teal"}
                >
                  {showGallery ? "Hide my NFT's" : "Show my NFT's"}
                </Button>
              </Center>
              {!!tokenId && (
                <NFT
                  contractAddress={CONTRACT_ADDRESS}
                  tokenId={tokenId.toString()}
                  isTestnet
                  size="md"
                />
              )}
            </Box>
          </Fade>
        ) : null}
      </Box>

      {!!showGallery && (
        <Box>
          <NFTGallery
            address={connection.userAddress}
            web3Provider={provider}
            gridWidth={4}
            isTestnet
          />
        </Box>
      )}

      <Box mt="auto" mb="5%">
        <Heading as="h4" size="lg">
          tinkering by{" "}
          <Link color="teal.400" href="https://github.com/renzo4web" isExternal>
            @ren
          </Link>
        </Heading>
      </Box>
    </Container>
  );
}

export default Home;
