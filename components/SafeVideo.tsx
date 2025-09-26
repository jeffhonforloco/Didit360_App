import React from "react";
import { Video, VideoProps } from "expo-av";

type Props = Omit<VideoProps, "source"> & {
  uri?: string | null;
};

export default function SafeVideo({ uri, ...rest }: Props) {
  const good = typeof uri === "string" && uri.trim().length > 0;
  return <Video source={good ? { uri } : undefined} {...rest} />;
}