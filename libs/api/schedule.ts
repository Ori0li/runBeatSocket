import { useAuthStore } from "@/src/stores/useAuthStore";

const BASE_URL = "http://192.168.4.19:3050";

export const getSchedule = async () => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE_URL}/reservations/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "스케쥴 정보를 가져오는데 실패했습니다.");
  }

  return json.data;
};

export const updateSchedule = async (scheduleData: {
  date: string;
  time: string;
}) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(scheduleData),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "스케쥴 예약에 실패했습니다.");
  }

  return json.data;
};

export const deleteSchedule = async (reservationId: number) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE_URL}/reservations/${reservationId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("스케쥴 취소에 실패했습니다.");
  }

  return res.json();
};

export const getScheduleByDate = async (selectedDate: string) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(
    `${BASE_URL}/schedules/available?date=${selectedDate}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "스케쥴 예약에 실패했습니다.");
  }

  return json.data;
};
