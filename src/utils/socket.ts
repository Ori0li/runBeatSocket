import { BASE_URL } from "@/libs/api/auth";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
  // useEffect(() => {
  //   connectSocket();
  //   return () => {
  //     disconnectSocket();
  //   };
  // }, []);

  const token = useAuthStore.getState().accessToken;
  console.log("소켓 연결 시도, 토큰:", token);

  if (!token) {
    console.warn("접속 실패: 토큰이 없습니다.");
    return;
  }

  if (!socket) {
    socket = io(`${BASE_URL}/chats`, {
      transports: ["websocket", "polling"],
      query: {
        token: `Bearer ${token}`, // 꼭 Bearer 붙여야 함!
      },
    });

    socket.on("connect", () => {
      console.log("Socket 연결됨:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket 연결 끊김");
    });

    socket.on("auth.error", (payload) => {
      console.error("인증 오류:", payload);
    });

    socket.on("connect_error", (err) => {
      console.error("소켓 연결 에러:", err);
    });
  }
  console.log("소켓 연결 상태:", socket?.connected);
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
