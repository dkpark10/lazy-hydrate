const { version } = require("./package.json");

const mapModuleIds = (fn) => (compiler) => {
  const { context } = compiler.options;

  compiler.hooks.compilation.tap("ChangeModuleIdsPlugin", (compilation) => {
    compilation.hooks.beforeModuleIds.tap("ChangeModuleIdsPlugin", (modules) => {
      const { chunkGraph } = compilation;

      for (const mod of modules) {
        if (mod.libIdent) {
          const origId = mod.libIdent({ context });
          if (!origId) continue;

          const namedModuleId = fn(origId, mod.debugId);

          if (namedModuleId) {
            chunkGraph.setModuleId(mod, namedModuleId);
          }
        }
      }
    });
  });
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === "development",
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  images: {
    domains: ["shop.zumst.com", "static.hubzum.zumst.com"],
  },
  publicRuntimeConfig: {
    version,
  },
  webpack: (config, options) => {
    const lazyTargets = [
      "@/components/lazy-component",
    ];

    config.plugins.push(
      mapModuleIds((id, debugId) => {
        const isTarget = lazyTargets.some((target) => target.includes(id));
        if (isTarget) return `lazy-${debugId}`

        return false;
      })
    );

    return config;
  },
};

module.exports = nextConfig;
