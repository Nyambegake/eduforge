const mobile = process.env.BUILD_TARGET === "mobile";
module.exports = { reactStrictMode: true, eslint: { ignoreDuringBuilds: true }, ...(mobile ? { output: "export", images: { unoptimized: true } } : {}) };
