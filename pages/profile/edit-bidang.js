import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Input,
    Flex,
    Text,
    Heading,
    InputGroup,
    InputRightElement,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    ListItem,
    OrderedList,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { addBidang } from "../../feature/register/registerSlice";
import Head from "next/head";
import { FiChevronLeft, FiSearch } from "react-icons/fi";
import { useRouter } from "next/router";
import useFirebaseAuth from "../../feature/hook/useFirebaseAuth";
import useOutsideAlerter from "../../feature/hook/useOutsideAlerter";
import { BidangCard } from "../../components/register/BidangCard";
import { SelectBidang } from "../../components/register/SelectBidang";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../app/firebase";
import { withProtected } from "../../utils/authRoute";

function EditBidang({ authUser }) {
    const [searchKey, setSearchKey] = useState("");
    const [bidangMinat, setBidangMinat] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const form = useSelector((state) => state.register);
    const dispatch = useDispatch();
    const router = useRouter();

    const wrapperRef = useRef(null);

    useEffect(() => {
        authUser.data?.bidangMinat.forEach((bidang) => {
            dispatch(
                addBidang({
                    id: bidang.id,
                    name: bidang.name,
                    skill: bidang.skill,
                })
            );
        });
    }, [authUser]);

    const handleAddBidang = (bidang, id) => {
        if (form.bidangMinat.length < 3) {
            dispatch(
                addBidang({
                    id,
                    name: bidang,
                    skill: "Pemula",
                })
            );
            setSearchKey("");
        } else {
            toast({
                variant: "subtle",
                position: "top",
                title: "Terjadi kesalahan",
                description: "Silahkan coba lagi",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const removeSelectedBidang = (item) => {
        let unselected = true;
        form.bidangMinat.forEach((selectedBidang) => {
            if (item.id == selectedBidang.id) {
                unselected = false;
            }
        });
        return unselected;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await updateDoc(doc(db, "users", authUser.uid), {
                bidangMinat: form.bidangMinat,
            });

            toast({
                variant: "subtle",
                position: "top",
                title: "Berhasil",
                description: "Bidang/minat belajar berhasil diperbarui!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setLoading(false);
            router.push("/profile");
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast({
                variant: "subtle",
                position: "top",
                title: "Terjadi kesalahan",
                description: errorMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch(`/api/bidangminat`)
            .then((response) => response.json())
            .then((result) => {
                const filteredResult = result.filter((item) =>
                    item.name.toLowerCase().includes(searchKey.toLowerCase())
                );

                const removeSelectedResult = filteredResult.filter((item) =>
                    removeSelectedBidang(item)
                );

                return setBidangMinat(removeSelectedResult);
            });
    }, [searchKey]);

    useOutsideAlerter(wrapperRef, () => setSearchKey(""));

    return (
        <>
            <Head>
                <title>Finddy | Edit Bidang Minat</title>
                <meta name="description" content="" />
                <link rel="icon" href="/logo.svg" />
            </Head>

            <Flex
                as="main"
                minH="100vh"
                minW="100%"
                justify="center"
                alignItems="center"
                bg="primary.lightblue"
            >
                <Flex
                    minH={{ base: "100vh", md: "600px" }}
                    w="100%"
                    bg="white"
                    px="24px"
                    flexDir="column"
                    py="32px"
                    overflowY="auto"
                    position="relative"
                    maxW={{ md: "600px" }}
                >
                    <Box transition="ease-in" transitionDuration="150ms">
                        <Box>
                            <Flex alignItems="center" gap="8px" color="neutral.80">
                                <FiChevronLeft
                                    onClick={() => router.back()}
                                    size="16px"
                                    cursor="pointer"
                                />

                                <Heading fontWeight="bold" fontSize="h6">
                                    Edit Bidang Minat
                                </Heading>
                            </Flex>
                        </Box>

                        <Flex
                            flexDir="column"
                            alignItems="center"
                            justifyContent={form.bidangMinat > 0 ? "space-between" : "start"}
                            minH="100vh"
                        >
                            <Box w="100%">
                                <Flex
                                    alignItems="stretch"
                                    gap="20px"
                                    mt="40px"
                                    flexDir="column"
                                    position="relative"
                                    ref={wrapperRef}
                                >
                                    <InputGroup>
                                        <Input
                                            placeholder="Cari bidang/minat"
                                            type="text"
                                            value={searchKey}
                                            onChange={(e) => {
                                                setSearchKey(e.target.value);
                                            }}
                                            isDisabled={form.bidangMinat.length > 2}
                                        ></Input>
                                        <InputRightElement>
                                            <FiSearch color="#333333" />
                                        </InputRightElement>
                                    </InputGroup>

                                    {searchKey !== "" && (
                                        <Flex
                                            py="12px"
                                            px="8px"
                                            w="100%"
                                            maxH="160px"
                                            overflowY="auto"
                                            flexDir="column"
                                            gap="6px"
                                            position="absolute"
                                            bg="white"
                                            top="56px"
                                            borderRadius="8px"
                                            boxShadow="card"
                                            border="1px"
                                            borderColor="neutral.10"
                                            zIndex="10"
                                        >
                                            {bidangMinat.length > 0 ? (
                                                bidangMinat.map((bidang, i) => (
                                                    <SelectBidang
                                                        key={i}
                                                        clickHandler={() =>
                                                            handleAddBidang(bidang.name, bidang.id)
                                                        }
                                                    >
                                                        {bidang.name}
                                                    </SelectBidang>
                                                ))
                                            ) : (
                                                <Text>Masukkan kata kunci lain</Text>
                                            )}
                                        </Flex>
                                    )}

                                    {form.bidangMinat.length > 0 && (
                                        <Text fontSize="14" color="neutral.60">
                                            Bingung saat memilih tingkat kemampuan? Baca panduannya{" "}
                                            <Box
                                                display="inline"
                                                fontWeight="bold"
                                                textDecoration="underline"
                                                onClick={onOpen}
                                                cursor="pointer"
                                                color="primary.calmblue"
                                            >
                                                di sini
                                            </Box>
                                        </Text>
                                    )}
                                </Flex>
                            </Box>

                            <Flex
                                flexDir="column"
                                w="100%"
                                gap="20px"
                                mt="40px"
                                alignItems="stretch"
                                minH="240px"
                            >
                                {form.bidangMinat.map((value, i) => (
                                    <BidangCard
                                        key={`bidang-minat-${i}`}
                                        name={value.name}
                                        skill={value.skill}
                                        id={value.id}
                                        index={i}
                                    />
                                ))}

                                {form.bidangMinat.length == 0 && (
                                    <Flex justifyContent="center">
                                        <Text
                                            textAlign="center"
                                            fontSize="p2"
                                            color="neutral.20"
                                            maxW="200px"
                                        >
                                            Belum ada bidang/minat yang dipilih
                                        </Text>
                                    </Flex>
                                )}
                            </Flex>

                            <Flex gap="16px" flexDir="column" mt="40px" w="100%">
                                <Button
                                    variant="primary"
                                    size="full"
                                    onClick={handleSubmit}
                                    isLoading={loading}
                                >
                                    Simpan perubahan
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="full"
                                    onClick={() => router.back()}
                                >
                                    Batalkan
                                </Button>
                            </Flex>
                        </Flex>
                    </Box>
                </Flex>
            </Flex>

            <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent mx="24px">
                    <ModalHeader>Kriteria tingkat kemampuan</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex flexDir="column" gap="12px" mb="24px">
                            <Box>
                                <Heading fontSize="h6">Pemula</Heading>
                                <OrderedList fontSize="p3">
                                    <ListItem>
                                        Belum memiliki pengalaman profesional seperti magang,
                                        freelance, atau bekerja
                                    </ListItem>
                                    <ListItem>
                                        Baru mempelajari selama kurang dari <b>3 bulan</b>
                                    </ListItem>
                                </OrderedList>
                            </Box>
                            <Box>
                                <Heading fontSize="h6">Menengah</Heading>
                                <OrderedList fontSize="p3">
                                    <ListItem>
                                        Memiliki pengalaman profesional seperti magang, freelance,
                                        atau bekerja &lt; <b>3 kali</b>.
                                    </ListItem>
                                    <ListItem>
                                        Sudah mempelajari selama <b>3 - 12 bulan</b>
                                    </ListItem>
                                </OrderedList>
                            </Box>
                            <Box>
                                <Heading fontSize="h6">Ahli</Heading>
                                <OrderedList fontSize="p3">
                                    <ListItem>
                                        Memiliki pengalaman profesional seperti magang, freelance,
                                        atau bekerja &gt; <b>3 kali</b>.
                                    </ListItem>
                                    <ListItem>
                                        Sudah mempelajari lebih dari <b>1 tahun</b>
                                    </ListItem>
                                    <ListItem>Bisa menjadi mentor bagi pengguna lain</ListItem>
                                </OrderedList>
                            </Box>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default withProtected(EditBidang)