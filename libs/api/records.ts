import { useAuthStore } from "@/src/stores/useAuthStore";

const BASE_URL = "http://192.168.4.19:3050";

export const getRecords = async (date: string) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const [mealRes, exerciseRes] = await Promise.all([
    fetch(`${BASE_URL}/records/meal?date=${date}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    fetch(`${BASE_URL}/records/exercise?date=${date}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  ]);

  const [mealJson, exerciseJson] = await Promise.all([
    mealRes.json(),
    exerciseRes.json(),
  ]);

  if (!mealRes.ok || !mealJson.success) {
    throw new Error(mealJson.message || "식단 기록을 가져오는데 실패했습니다.");
  }

  if (!exerciseRes.ok || !exerciseJson.success) {
    throw new Error(
      exerciseJson.message || "운동 기록을 가져오는데 실패했습니다."
    );
  }

  const mealRecords = mealJson.data.records.map((record: any) => ({
    id: record.id,
    tag: "식단" as const,
    date: record.date,
    content: record.memo,
    image: record.photoUrl,
  }));

  const exerciseRecords = exerciseJson.data.records.map((record: any) => ({
    id: record.id,
    tag: "운동" as const,
    date: record.date,
    content: record.memo,
    image: record.photoUrl,
  }));

  return [...mealRecords, ...exerciseRecords];
};

export const createRecord = async (recordData: {
  date: string;
  content: string;
  tag: "식단" | "운동";
  image?: string;
}) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const endpoint =
    recordData.tag === "식단" ? "/records/meal" : "/records/exercise";

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      date: recordData.date,
      memo: recordData.content,
      photoUrl: recordData.image,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "기록 생성에 실패했습니다.");
  }

  return json.data;
};

export const deleteRecord = async (recordId: number, tag: "식단" | "운동") => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const endpoint = tag === "식단" ? "/records/meal" : "/records/exercise";

  const res = await fetch(`${BASE_URL}${endpoint}/${recordId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "기록 삭제에 실패했습니다.");
  }

  return json.data;
};
