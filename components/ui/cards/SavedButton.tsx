import { Button } from "@rneui/themed";

export default function SavedButton({
  onPress,
}: {
  onPress: (e: any) => void;
}) {
  return (
    <Button
      onPress={onPress}
      type="clear"
      icon={{ name: "bookmark", size: 24 }}
      buttonStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
    />
  );
}
