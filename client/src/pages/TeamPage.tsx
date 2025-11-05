import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
  Text,
} from "@chakra-ui/react";
import InviteMemberDrawer from "../components/InviteMemberDrawer";
import type { Team, User } from "../types";
import { getTeam, getTeamMembers } from "../api/team";

const TeamPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const [teamData, membersData] = await Promise.all([
          getTeam(teamId!),
          getTeamMembers(teamId!),
        ]);
        setTeam(teamData);
        setMembers(membersData);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, [teamId]);

  if (loading) {
    return (
      <Box
        p={8}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Heading>{team?.name}</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          ＋ メンバーを招待
        </Button>
      </Box>

      <Box as="section">
        <Tabs>
          <TabList>
            <Tab _selected={{ color: "blue.500", borderBottom: "2px solid" }}>
              タスク一覧
            </Tab>
            <Tab _selected={{ color: "blue.500", borderBottom: "2px solid" }}>
              チームチャット
            </Tab>
            <Tab _selected={{ color: "blue.500", borderBottom: "2px solid" }}>
              メンバー管理
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box p={4}>
                <p>ここにタスク一覧のコンポーネント</p>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box p={4}>
                <p>ここにチームチャットのコンポーネント</p>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box p={4}>
                <p>ここにメンバー管理のコンポーネント</p>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* 招待用ドロワー */}
      <InviteMemberDrawer
        isOpen={isOpen}
        onClose={onClose}
        teamId={teamId!}
        currentMembers={members}
      />
    </Box>
  );
};

export default TeamPage;
