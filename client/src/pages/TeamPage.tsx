import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
  Text,
  Container,
} from "@chakra-ui/react";
import InviteMemberDrawer from "../components/InviteMemberDrawer";
import type { Team, TeamMember } from "../types";
import { getTeam, getTeamMembers } from "../api/team";
import TaskBoard from "../components/TaskBoard";
import Chat from "../components/Chat";
import MemberManagement from "../components/MemberManagement";
import AppHeader from "../components/AppHeader";

const TeamPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
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
    <Container maxW="container.xl">
      <AppHeader title={team?.name || "チーム読み込み中..."}>
        <Button colorScheme="blue" onClick={onOpen}>
          ＋ メンバーを招待
        </Button>
      </AppHeader>

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
                <TaskBoard teamId={teamId!} members={members} />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box p={4}>
                <Chat teamId={teamId!} />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box p={4}>
                <MemberManagement
                  teamId={teamId!}
                  members={members}
                  setMembers={setMembers}
                />
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
    </Container>
  );
};

export default TeamPage;
