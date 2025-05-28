import { useAuthStore } from "@/src/stores/useAuthStore";
import dayjs from "dayjs";

export const BASE_URL = "http://192.168.4.19:3050";

export const getScheduleToday = async () => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const today = dayjs().format("YYYY-MM-DD");
  console.log("오늘 날짜:", today);
  const res = await fetch(`${BASE_URL}/reservations/trainer?date="${today}"`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "트레이너 오늘 예약 목록 조회 실패");
  }

  return json.data;
};

export const getTrainerProfile = async () => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE_URL}/profile/trainer`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "프로필 정보를 가져오는데 실패했습니다.");
  }

  return json.data;
};

export const getTrainerReservations = async (date: string) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE_URL}/reservations/trainer?date="${date}"`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "트레이너 예약 목록 조회 실패");
  }

  return json.data;
};
