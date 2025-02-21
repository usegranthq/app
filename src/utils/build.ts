export function generateHash() {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

// random hash generated for build
const generateBuildHash = () => {
  if (process.env.BUILD_HASH) {
    return process.env.BUILD_HASH;
  }

  process.env.BUILD_HASH = generateHash();
  return process.env.BUILD_HASH;
};

export const BUILD_HASH = generateBuildHash();
