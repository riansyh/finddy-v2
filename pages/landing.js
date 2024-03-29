import { Box, Button, ButtonGroup, Flex, Text, Heading, Fade, Image } from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { onboarding } from "../data/onboard";
import { useRouter } from "next/router";
import useFirebaseAuth from "../feature/hook/useFirebaseAuth";

export default function Index() {
    const [slider, setSlider] = useState(0);
    const [isTransiting, setIsTransiting] = useState(false);

    useFirebaseAuth();

    const router = useRouter();

    const handleNext = (number) => {
        setTimeout(() => {
            setIsTransiting(false);
            setSlider(number == -1 ? slider + 1 : number);
        }, 200);
        setIsTransiting(true);
    };

    return (
        <div>
            <Head>
                <title>Finddy | Onboarding</title>
                <meta name="description" content="" />
                <link rel="icon" href="/logo.svg" />
            </Head>

            <Flex
                as="main"
                minH="100vh"
                minW="100vw"
                justify="center"
                alignItems="center"
                bg="primary.lightblue"
            >
                <Flex
                    minH={{ base: "100vh", md: "600px" }}
                    w="100vw"
                    maxW={{ md: "500px" }}
                    maxH={{ md: "400px" }}
                    borderRadius={{ md: "12px" }}
                    bg="white"
                    px="24px"
                    justify="center"
                    alignItems="center"
                    flexDir="column"
                    py="32px"
                    overflow="hidden"
                    position="relative"
                >
                    <Box
                        position="absolute"
                        w="668px"
                        h="668px"
                        borderRadius="100%"
                        bg="#F1F9FF"
                        top="-550px"
                    ></Box>

                    <Box
                        w="160px"
                        h="160px"
                        borderRadius="12px"
                        zIndex="2"
                        boxShadow="card"
                        overflow="hidden"
                    >
                        <Image src="/images/logo.png" alt="Logo Finddy"></Image>
                    </Box>

                    <Box
                        opacity={isTransiting ? "0.1" : "1"}
                        transition="ease-in"
                        transitionDuration="150ms"
                    >
                        <Heading
                            fontSize="h5"
                            fontWeight="normal"
                            letterSpacing="1.2px"
                            textAlign="center"
                            color="neutral.80"
                            mt="32px"
                        >
                            {onboarding[slider].title}
                        </Heading>

                        <Text fontSize="p2" color="neutral.80" mt="24px">
                            {onboarding[slider].desc}
                        </Text>
                    </Box>

                    <Flex alignItems="center" justify="center" gap="16px" mt="24px">
                        <Box
                            borderRadius="100px"
                            h="8px"
                            w="8px"
                            bg={slider == 0 ? "primary.calmblue" : "neutral.20"}
                        >
                            {" "}
                        </Box>
                        <Box
                            borderRadius="100px"
                            h="8px"
                            w="8px"
                            bg={slider == 1 ? "primary.calmblue" : "neutral.20"}
                        >
                            {" "}
                        </Box>
                        <Box
                            borderRadius="100px"
                            h="8px"
                            w="8px"
                            bg={slider == 2 ? "primary.calmblue" : "neutral.20"}
                        >
                            {" "}
                        </Box>
                    </Flex>

                    {slider == 2 ? (
                        <Flex gap="16px" flexDir="column" mt="60px" w="100%">
                            <Button
                                variant="primary"
                                size="full"
                                onClick={() => router.push("/login")}
                            >
                                Login
                            </Button>
                            <Button
                                variant="secondary"
                                size="full"
                                onClick={() => router.push("/register")}
                            >
                                Registrasi
                            </Button>
                        </Flex>
                    ) : (
                        <Flex gap="16px" flexDir="column" mt="60px" w="100%">
                            <Button size="full" variant="primary" onClick={() => handleNext(-1)}>
                                Lanjutkan
                            </Button>
                            <Button size="full" variant="secondary" onClick={() => handleNext(2)}>
                                Lewati
                            </Button>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </div>
    );
}
