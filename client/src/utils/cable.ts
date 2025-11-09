import { createConsumer } from "@rails/actioncable";
import type { Message } from "../types";

const CABLE_URL = "ws://localhost:3000/cable";

export const createCableConsumer = (
  teamId: string,
  callbacks: { onReceived: (message: Message) => void }
): (() => void) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Action Cable: 認証トークンが見つかりません");
    return () => {};
  }

  const consumer = createConsumer(`${CABLE_URL}?token=${token}`);

  const subscription = consumer.subscriptions.create(
    { channel: "TeamChatChannel", team_id: teamId },
    {
      connected() {
        console.log("Action Cable: 接続成功");
      },

      disconnected() {
        console.log("Action Cable: 切断");
      },

      received(data: Message) {
        callbacks.onReceived(data);
      }
    }
  );
  return () => {
    subscription.unsubscribe();
    consumer.disconnect();
  };
};