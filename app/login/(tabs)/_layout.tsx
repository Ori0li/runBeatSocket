import { Stack } from "expo-router";

export default function LoginLayout() {
  // useEffect(() => {
  //   const onBackPress = () => {
  //     BackHandler.exitApp();
  //     return true;
  //   };

  //   const subscription = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     onBackPress
  //   );

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
