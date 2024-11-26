import FullScreenImage from "@/components/ui/FullScreenImage";
import { AdsData } from "@/constants/Data";
import usePostStore from "@/hooks/store/useFetchPosts";
import { router } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";

interface Picture {
  id: number;
  post_id: number;
  filename: string;
  url: {
    full: string;
    small: string;
    medium: string;
    big: string;
  };
}

export default function FullScreenLayout() {
  const route = useRouteInfo();
  const { imageIndex, postId } = route.params;
  const { items } = usePostStore();
  const { pictures, count_pictures } = items[parseInt(postId.toString())];
  const index = pictures.findIndex(
    (picture, index) => index === parseInt(imageIndex.toString())
  );

  return (
    <FullScreenImage
      index={index}
      pictures={pictures}
      count_pictures={parseInt(count_pictures.toString())}
      onClose={() => router.back()}
    />
  );
}
