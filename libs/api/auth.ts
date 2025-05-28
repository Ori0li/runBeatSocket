import { useAuthStore } from "@/src/stores/useAuthStore";
import {
  deleteRefreshToken,
  getRefreshToken,
  saveRefreshToken,
} from "@/src/utils/secureToken";

export const BASE_URL = "http://192.168.4.19:3050";

export const authAccount = async (
  email: string,
  password: string,
  role: "trainer" | "user"
) => {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  const json = await res.json();

  if (!res.ok || !json.success || json.data.role != role) {
    throw new Error(json.message || "로그인 실패");
  }

  const { accessToken, refreshToken, accountId, role: serverRole } = json.data;
  useAuthStore.getState().setAuth(accessToken, accountId, serverRole);
  await saveRefreshToken(refreshToken);

  console.log("✅ 로그인 응답:", json.data);
  // 아래도 바로 찍어봐
  useAuthStore.getState().setAuth(accessToken, accountId, role);
  console.log("✅ 저장된 상태 확인:", useAuthStore.getState());

  return json.data;
};

export const updateUserPassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE_URL}/auth/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      oldPassword,
      newPassword,
      confirmPassword,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "비밀번호 변경에 실패했습니다.");
  }

  return json.data;
};

export const deleteUser = async () => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE_URL}/auth/withdraw`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "회원탈퇴에 실패했습니다.");
  }

  return json.data;
};

export const refreshToken = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error("리프레시 토큰 없음");

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "자동 로그인 실패");
  }

  return json.data;
};

export const logout = async () => {
  useAuthStore.getState().clearAuth();
  await deleteRefreshToken();
};
