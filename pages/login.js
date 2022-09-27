import {
    Box,
    Button,
    Input,
    InputGroup,
    InputRightElement,
    Flex,
    Text,
    Heading,
    FormControl,
    Image,
    FormLabel,
    useToast,
} from "@chakra-ui/react";

import { FiEye, FiEyeOff } from "react-icons/fi";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../app/firebase";
import useFirebaseAuth from "../feature/hook/useFirebaseAuth";
import { useSelector } from "react-redux";

export default function Home() {
    const [isPasswordShowed, setIsPasswordShowed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    });

    useFirebaseAuth();
    const router = useRouter();
    const toast = useToast();
    const authUser = useSelector((state) => state.authUser);

    useEffect(() => {
        if (authUser.uid) router.push("/home");
    }, [authUser]);

    const showPassword = () => {
        setIsPasswordShowed(!isPasswordShowed);
    };

    const handleSubmit = async () => {
        if (formValues.email !== "" && formValues.password !== "") {
            console.log(formValues);
            setLoading(true);

            try {
                const res = await signInWithEmailAndPassword(
                    auth,
                    formValues.email,
                    formValues.password
                );

                toast({
                    variant: "subtle",
                    title: "Berhasil login!",
                    description: "Silakan mulai cari teman belajarmu di sini!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                setLoading(false);
                router.push("/home");
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast({
                    variant: "subtle",
                    title: "Terjadi kesalahan",
                    description: errorMessage,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <Head>
                <title>Finddy | Login</title>
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
                    flexDir="column"
                    py="32px"
                    overflowY="scroll"
                    position="relative"
                >
                    <Box w="40px" h="40px" borderRadius="12px" zIndex="2" overflow="hidden">
                        <Image src="/images/logo.png" alt="Logo Finddy"></Image>
                    </Box>

                    <Box mt="40px">
                        <Heading fontWeight="bold" fontSize="h3">
                            Selamat datang kembali!
                        </Heading>
                        <Text fontSize="p3" color="neutral.60" mt="12px">
                            Mulai temukan teman belajarmu di sini!
                        </Text>
                    </Box>

                    <Flex alignItems="stretch" gap="20px" mt="40px" flexDir="column">
                        <FormControl>
                            <FormLabel fontWeight="bold" color="neutral.60">
                                Email
                            </FormLabel>
                            <Input
                                placeholder="finddy@gmail.com"
                                type="email"
                                id="email"
                                value={formValues.email}
                                onChange={(e) =>
                                    setFormValues((prev) => ({
                                        ...prev,
                                        [e.target.id]: e.target.value,
                                    }))
                                }
                            ></Input>
                        </FormControl>
                        <FormControl>
                            <FormLabel fontWeight="bold" color="neutral.60">
                                Password
                            </FormLabel>
                            <InputGroup>
                                <Input
                                    placeholder="******"
                                    type={isPasswordShowed ? "text" : "password"}
                                    id="password"
                                    value={formValues.password}
                                    onChange={(e) =>
                                        setFormValues((prev) => ({
                                            ...prev,
                                            [e.target.id]: e.target.value,
                                        }))
                                    }
                                ></Input>
                                <InputRightElement>
                                    <Box cursor="pointer">
                                        {isPasswordShowed ? (
                                            <FiEye color="#333333" onClick={showPassword} />
                                        ) : (
                                            <FiEyeOff color="#333333" onClick={showPassword} />
                                        )}
                                    </Box>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </Flex>

                    <Flex gap="16px" flexDir="column" mt="40px" w="100%">
                        <Button
                            variant="primary"
                            size="full"
                            onClick={handleSubmit}
                            isLoading={loading}
                        >
                            Login
                        </Button>
                    </Flex>
                    <Flex gap="8px" flexDir="column" mt="60px" w="100%">
                        <Text fontSize="p3" color="neutral.60" textAlign="center">
                            Belum memiliki akun?
                        </Text>
                        <Button
                            variant="secondary"
                            size="full"
                            onClick={() => router.push("/register")}
                        >
                            Registrasi Sekarang
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </div>
    );
}
