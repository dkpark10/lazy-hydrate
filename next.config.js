const { version } = require("./package.json");

class LazyModulePrefixPlugin {
  constructor({ target }) {
    this.target = target;
  }

  apply(compiler) {
    const { context } = compiler.options;

    compiler.hooks.compilation.tap("LazyModulePrefixPlugin", (compilation) => {
      compilation.hooks.beforeModuleIds.tap(
        "LazyModulePrefixPlugin",
        (modules) => {
          const { chunkGraph } = compilation;

          for (const mod of modules) {
            if (mod.libIdent) {
              const origId = mod.libIdent({ context });
              if (!origId) continue;

              const namedModuleId = this.setPrefix(origId, mod.debugId);

              if (namedModuleId) {
                chunkGraph.setModuleId(mod, namedModuleId);
              }
            }
          }
        }
      );
    });
  }

  setPrefix(id, debugId) {
    const isTarget = this.target.some((target) => target.includes(id));
    if (isTarget) return `lazy-${debugId}`;

    return false;
  }
}

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
  webpack: (config) => {
    config.plugins.push(
      new LazyModulePrefixPlugin({
        target: ["@/components/lazy-component"],
      })
    );

    return config;
  },
};

module.exports = nextConfig;
