import { Box, Divider, Flex, Image, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useRef } from "react";
import { FiClipboard, FiPaperclip, FiSend } from "react-icons/fi";
import { useSelector } from "react-redux";
import { sendMessage } from "../../feature/sendMessage";
import { showMessageTime } from "../../feature/showMessageTime";

export const BubbleChat = ({ isMyChat, children, time, user, chatId, userId, file }) => {
    const ref = useRef();
    const authUser = useSelector((state) => state.authUser);

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [children]);

    const handleSendContact = async () => {
        await sendMessage(`Ini kontaknya ya ${user.kontak}`, chatId, authUser, userId);
    };

    return (
        <Flex flexDir="column" alignItems={isMyChat ? "flex-end" : "flex-start"} ref={ref}>
            {file && file.type != "png" && (
                <NextLink href={file.url} passHref>
                    <Link
                        target="_blank"
                        rel="noopener norefferer"
                        display="flex"
                        minW="100px"
                        px="10px"
                        py="8px"
                        w="fit-content"
                        borderRadius="4px"
                        maxW="90%"
                        mb="4px"
                        bg={isMyChat ? "accent.grass" : "#E5EBEE"}
                        fontSize="p3"
                        color="primary.calmblue"
                        alignItems="center"
                        gap="4px"
                    >
                        <FiPaperclip />
                        <Text>{file?.name}</Text>
                    </Link>
                </NextLink>
            )}

            {file && file.type == "png" && (
                <NextLink href={file.url} passHref>
                    <Link
                        target="_blank"
                        rel="noopener norefferer"
                        display="flex"
                        minW="100px"
                        px="10px"
                        py="8px"
                        w="fit-content"
                        borderRadius="4px"
                        maxW="90%"
                        mb="4px"
                        bg={isMyChat ? "accent.grass" : "#E5EBEE"}
                        fontSize="p3"
                        color="primary.calmblue"
                        alignItems="center"
                        gap="4px"
                    >
                        <Image
                            borderRadius="4px"
                            src={file.url}
                            alt={file.name}
                            height="200px"
                        ></Image>
                    </Link>
                </NextLink>
            )}

            <Box
                color="#333"
                bg={isMyChat ? "accent.grass" : "#E5EBEE"}
                fontSize="14px"
                borderRadius="4px"
                minW="100px"
                px="10px"
                py="8px"
                w="fit-content"
                maxW="90%"
            >
                {children}
                {children == "Halo, boleh minta kontaknya ga?" && !isMyChat && (
                    <>
                        <Divider borderColor="neutral.40" my="4px" />
                        <Box
                            bg={isMyChat ? "accent.grass" : "#E5EBEE"}
                            cursor="pointer"
                            onClick={handleSendContact}
                        >
                            <Flex
                                alignItems="center"
                                justifyContent="center"
                                gap="4px"
                                w="100%"
                                fontWeight="bold"
                                color="primary.calmblue"
                            >
                                <FiSend />
                                Kirim kontak
                            </Flex>
                        </Box>
                    </>
                )}
            </Box>
            <Text color="#7E7E7E" mt="2px" fontSize="10px">
                {showMessageTime(time, true)}
            </Text>
        </Flex>
    );
};
