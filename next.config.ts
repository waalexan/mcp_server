import type { NextConfig } from "next";
import { baseURL } from "./src/baseUrl";

const nextConfig: NextConfig = {
  assetPrefix: baseURL, 
};

export default nextConfig;
