import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

/**
 * This script is used to unpack the client directory from the frontend build directory.
 * Remix SPA mode builds the client directory into the build directory. This function
 * moves the contents of the client directory to the build directory and then removes the
 * client directory.
 *
 * This script is used in the buildEnd function of the Vite config.
 */
const unpackClientDirectory = async () => {
  if (process.env.VERCEL) {
    // Vercel's React Router builder reads static assets from build/client.
    return;
  }

  const fs = await import("fs");
  const path = await import("path");

  const buildDir = path.resolve(__dirname, "build");
  const clientDir = path.resolve(buildDir, "client");

  const files = await fs.promises.readdir(clientDir);
  await Promise.all(
    files.map((file) =>
      fs.promises.rename(
        path.resolve(clientDir, file),
        path.resolve(buildDir, file),
      ),
    ),
  );

  await fs.promises.rmdir(clientDir);
};

export default {
  appDirectory: "src",
  buildEnd: unpackClientDirectory,
  presets: [vercelPreset()],
  ssr: false,
} satisfies Config;
