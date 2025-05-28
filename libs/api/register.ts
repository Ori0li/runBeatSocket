import { useAuthStore } from "@/src/stores/useAuthStore";

const BASE_URL = "http://192.168.4.19:3050";

export const addUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await fetch(`${BASE_URL}/auth/signup/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "회원가입에 실패했습니다.");
  }

  return json.data;
};

export const addUserInfo = async (userInfoData: {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  memo: string;
}) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE_URL}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(userInfoData),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "프로필 정보 등록에 실패했습니다.");
  }

  return json.data;
};
