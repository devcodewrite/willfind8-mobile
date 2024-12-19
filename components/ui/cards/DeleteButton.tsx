import { Button, lightColors } from "@rneui/themed";

export default function DeleteButton({
  onPress,
  active,
}: {
  onPress?: (e: any) => void;
  active?: boolean;
}) {
  return (
    <Button
      onPress={onPress}
      type="clear"
      icon={{
        name: "close",
        size: 24,
        color: lightColors.error,
      }}
      buttonStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
    />
  );
}
