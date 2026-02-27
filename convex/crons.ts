import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "publish scheduled posts",
  { minutes: 1 }, // Check every minute
  api.posts.publishScheduledPosts,
);

export default crons;
