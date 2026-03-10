import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route(":topicId/theory", "routes/topic-theory.tsx"),
  route(":topicId/practice", "routes/topic-practice.tsx"),
  route("event-loop", "routes/event-loop.tsx"),
] satisfies RouteConfig;
