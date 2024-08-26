const { version } = require("./package.json");
const path = require("path");
const fs = require("fs").promises;

class LazyModulePrefixPlugin {
  constructor({ lazyTargets }) {
    this.lazyTargets = lazyTargets;
    this.origin = '';
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap("LazyModulePrefixPlugin", async (compilation) => {
      const manifestFilePath = path.join(
        compilation.outputOptions.path,
        "react-loadable-manifest.json"
      );

      const isEmpty = (obj) => {
        if (Array.isArray(obj)) return obj.length <= 0;
        return Object.keys(obj).length <= 0;
      };

      try {
        const manifestFileContent = await fs.readFile(manifestFilePath, "utf8");
        const manifest = JSON.parse(manifestFileContent);

        if (isEmpty(manifest)) return;

        this.origin = manifest;
        for (const moduleId in manifest) {
          const isLazyTargets = this.lazyTargets.some((lazyTarget) => moduleId.includes(lazyTarget));
          if (isLazyTargets) {
            const id = moduleId.replace(/\/([^/]+)$/, '/lazy-hydrated-$1');
            manifest[moduleId].id = id;
          }
        }

        fs.writeFile(manifestFilePath, JSON.stringify(manifest, null, 2), 'utf8').catch(() => {
          fs.writeFile(this.origin, JSON.stringify(manifest, null, 2), 'utf8');
        });
      } catch (error) {}
    });
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
    domains: ["shop.zumst.com", "static.hubzum.zumst.com", "via.placeholder.com"],
  },
  publicRuntimeConfig: {
    version,
  },
  webpack: (config) => {
    config.plugins.push(
      new LazyModulePrefixPlugin({
        lazyTargets: ["@/components/expensive-component"],
      })
    );

    return config;
  },
};

module.exports = nextConfig;
