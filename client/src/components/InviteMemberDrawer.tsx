import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  Button,
  Input,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import type { User } from "../types";
import { getUsers } from "../api/user";
import { inviteUserToTeam } from "../api/team";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  currentMembers: User[];
};

const InviteMemberDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  teamId,
  currentMembers,
}) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const memberIds: number[] = currentMembers.map((member) => member.id);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const data = await getUsers();
          setAllUsers(data);
        } catch (error) {
          console.error("Failed to fetch users:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = async (userId: number) => {
    try {
      await inviteUserToTeam(teamId, userId);
      alert("招待に成功しました");
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>メンバーを招待</DrawerHeader>
        <DrawerBody>
          <Box position="relative" mb={4}>
            <Input
              placeholder="名前またはEmailで検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              pl="40px"
            />
            <Box position="absolute" left={3} top={3}>
              <SearchIcon color="gray.300" />
            </Box>
          </Box>

          {loading ? (
            <Spinner />
          ) : (
            <VStack align="start" spacing={1} overflowY="auto">
              {filteredUsers.map((user) => {
                const isAlreadyMember = memberIds.includes(user.id);

                return (
                  <Box
                    key={user.id}
                    w="full"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: "gray.50" }}
                  >
                    <Box>
                      <Text fontWeight="bold">{user.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {user.email}
                      </Text>
                    </Box>

                    {isAlreadyMember ? (
                      <Text fontSize="sm" color="gray.500">
                        参加済み
                      </Text>
                    ) : (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleInvite(user.id)}
                      >
                        招待
                      </Button>
                    )}
                  </Box>
                );
              })}
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default InviteMemberDrawer;
