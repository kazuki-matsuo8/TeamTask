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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import type { User } from "../types";
import { getUsers } from "../api/user";
import { inviteUserToTeam } from "../api/team";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
};

const InviteMemberDrawer: React.FC<Props> = ({ isOpen, onClose, teamId }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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
            <Box textAlign="center">
              <Spinner />
            </Box>
          ) : (
            <Box maxH="60vh" overflowY="auto">
              {filteredUsers.map((user) => (
                <Box
                  key={user.id}
                  w="100%"
                  p={2}
                  mb={2}
                  borderWidth={1}
                  borderRadius="md"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text>{user.name}</Text>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleInvite(user.id)}
                  >
                    招待
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default InviteMemberDrawer;
