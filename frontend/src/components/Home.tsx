/* eslint-disable node/no-unpublished-import */
import React, { useState, useEffect, useRef } from "react";
import {
  ConnectWallet,
  useWallet,
  useWriteContract,
  useTransaction,
} from "@web3-ui/core";
// eslint-disable-next-line node/no-extraneous-import
import { NFT, NFTGallery } from "@web3-ui/components";
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
  Tooltip,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import EpicNFTAbi from "../../../artifacts/contracts/EpicNFT.sol/EpicNFT.json";
import { useReadOnlyProvider } from "@web3-ui/hooks";
// eslint-disable-next-line node/no-missing-import
import { trimInput } from "../utils/helpers";

const CONTRACT_ADDRESS = "0xef6cD47d5516A3bE7D868aCaAC58Eaae3C07c597";

function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [words, setWords] = useState("");
  const provider = useReadOnlyProvider(
    "https://eth-rinkeby.alchemyapi.io/v2/9PV3-6R3ofq4XeN_1gAB2SNEK2IKpY04"
  );
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const { connected, correctNetwork, switchToCorrectNetwork, connection } =
    useWallet();
  const [nftContract, isReady] = useWriteContract(
    CONTRACT_ADDRESS,
    EpicNFTAbi.abi
  );
  const [execute, loading] = useTransaction(nftContract?.makeNFT);

  useEffect(() => {
    nftContract?.on("NewEpicNFTMinted", (from, tokenId) => {
      console.log(from, tokenId.toNumber());
      setTokenId(tokenId);
      alert(
        `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
      );
    });
  }, [isReady]);

  const handleChangeWords = (event: any) => {
    setWords(event.target.value);
  };

  const onSubmitForm = async () => {
    try {
      // TODO: add word
      setTokenId(null);
      onClose();
      await execute(words.toUpperCase());
      setWords("");
    } catch (error) {
      console.warn(error);
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
      {!!connection.network && (
        <p>
          <strong>Current Network:</strong>{" "}
          <code>{connection?.network ?? "Unknown"}</code>
        </p>
      )}

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
          <Center>
            <Badge variant="outline" my="5%">
              Click the button again to disconnect the wallet.
            </Badge>
          </Center>
        ) : null}
        <Center my="5%">
          <ConnectWallet />
        </Center>

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
                      Write three words that come to your mind{" "}
                      <Badge colorScheme="purple">{words}</Badge>
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
              {!!tokenId && connected && (
                <Center my="5%">
                  <NFT
                    contractAddress={CONTRACT_ADDRESS}
                    tokenId={tokenId.toString()}
                    isTestnet
                    size="md"
                  />
                </Center>
              )}
            </Box>
          </Fade>
        ) : null}
      </Box>

      <Divider variant="dashed" my="5%" />

      {!!showGallery && connected && (
        <Box my="2%">
          <NFTGallery
            address={connection?.userAddress!}
            // @ts-ignore
            web3Provider={provider}
            gridWidth={3}
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
