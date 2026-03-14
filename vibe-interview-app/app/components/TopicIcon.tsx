import JavascriptIcon from "~/assets/icons/topic-javascript.svg?react";
import ReactIcon from "~/assets/icons/topic-react.svg?react";
import TypescriptIcon from "~/assets/icons/topic-typescript.svg?react";
import CssIcon from "~/assets/icons/topic-css.svg?react";
import NodejsIcon from "~/assets/icons/topic-nodejs.svg?react";
import TestingIcon from "~/assets/icons/topic-testing.svg?react";
import AlgorithmsIcon from "~/assets/icons/topic-algorithms.svg?react";
import EventLoopIcon from "~/assets/icons/topic-event-loop.svg?react";
import DefaultIcon from "~/assets/icons/topic-default.svg?react";

interface TopicIconProps {
  id: string;
  className?: string;
}

export function TopicIcon({ id, className = "w-8 h-8" }: TopicIconProps) {
  const props = { className };

  switch (id) {
    case "javascript":  return <JavascriptIcon {...props} />;
    case "react":       return <ReactIcon {...props} />;
    case "typescript":  return <TypescriptIcon {...props} />;
    case "css":         return <CssIcon {...props} />;
    case "nodejs":      return <NodejsIcon {...props} />;
    case "testing":     return <TestingIcon {...props} />;
    case "algorithms":  return <AlgorithmsIcon {...props} />;
    case "event-loop":  return <EventLoopIcon {...props} />;
    default:            return <DefaultIcon {...props} />;
  }
}
