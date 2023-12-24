import redisClient from "../config/redisClient";
import { Post } from "../interfaces/Post";
import User from "../interfaces/User";

const cacheDataInRedis = (
  url: string,
  time: number,
  data: Post | Post[] | User | User[]
) => redisClient.SETEX(url, time, JSON.stringify(data));

export default cacheDataInRedis;
