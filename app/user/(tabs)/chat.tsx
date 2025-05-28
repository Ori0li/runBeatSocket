import { BASE_URL } from "@/libs/api/auth";
import ChatRoomScreen from "@/src/screens/common/ChatRoomScreen";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function ChatPageScreen() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [chatId, setChatId] = useState<number | null>(null);

  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        const res = await fetch(`${BASE_URL}/chats/my`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const json = await res.json();
        if (res.ok && json.success) {
          setChatId(json.data.chatId);
        } else {
          console.error("채팅방 조회 실패:", json.message);
        }
      } catch (err) {
        console.error("채팅방 정보 불러오기 실패:", err);
      }
    };

    fetchChatRoom();
  }, []);

  if (!chatId) {
    return <Text>채팅방을 불러오는 중입니다...</Text>;
  }

  return <ChatRoomScreen roomId={chatId} />;
}
