import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Spinner,
  Button,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tag,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import type { TeamMember } from "../types";
import { removeMemberFromTeam } from "../api/team";
import { jwtDecode } from "jwt-decode";

type Props = {
  teamId: string;
  members: TeamMember[]; 
  setMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>; 
};

type JwtPayload = {
  user_id: number;
};

const MemberManagement: React.FC<Props> = ({ teamId, members, setMembers }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setCurrentUserId(decoded.user_id);
      } catch (e) {
        console.error("JWTデコードエラー:", e);
      }
    }
  }, []);

  const currentUserRole = members.find(m => m.id === currentUserId)?.role;

  const handleRemoveMember = async (teamUserId: number, name: string) => {
    if (!window.confirm(`メンバー「${name}」をチームから削除してもよろしいですか？`)) {
      return;
    }

    try {
      setLoading(true);
      await removeMemberFromTeam(teamId, teamUserId);
      toast({
        title: "メンバーを削除しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setMembers(prevMembers => prevMembers.filter(m => m.team_user_id !== teamUserId));
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        toast({
          title: "削除に失敗しました",
          description: e.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>名前</Th>
              <Th>Email</Th>
              <Th>役割</Th>
              <Th>アクション</Th>
            </Tr>
          </Thead>
          <Tbody>
            {members.map((member) => (
              <Tr key={member.id}>
                <Td>
                  <Text fontWeight="bold">{member.name}</Text>
                  {member.id === currentUserId && (
                    <Tag size="sm" colorScheme="blue" ml={2}>あなた</Tag>
                  )}
                </Td>
                <Td>{member.email}</Td>
                <Td>
                  {member.role === "admin" ? (
                    <Tag colorScheme="purple">管理者</Tag>
                  ) : (
                    <Tag>メンバー</Tag>
                  )}
                </Td>
                <Td>
                  {currentUserRole === "admin" && member.id !== currentUserId && (
                    <Button
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveMember(member.team_user_id, member.name)}
                      isLoading={loading}
                    >
                      削除
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MemberManagement;