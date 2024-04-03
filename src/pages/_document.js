import { Html, Head, Main, NextScript } from "next/document";

class LazyHead extends Head {
  getDynamicChunks(files) {
    const dynamicScripts = super.getDynamicChunks(files);
    try {
      // get chunk manifest from loadable
      const loadableManifest = __non_webpack_require__(
        '../../react-loadable-manifest.json',
      );
      // search and filter modules based on marker ID
      const chunksToExclude = Object.values(loadableManifest).filter(
        manifestModule => manifestModule?.id?.includes('lazy-hydrated') || false,
      );
      const excludeMap = chunksToExclude?.reduce?.((acc, chunks) => {
        if (chunks.files) {
          acc.push(...chunks.files);
        }
        return acc;
      }, []);
      const filteredChunks = dynamicScripts?.filter?.(
        script => !excludeMap?.includes(script?.key),
      );

      return filteredChunks;
    } catch (e) {
      // if it fails, return the dynamic scripts that were originally sent in
      return dynamicScripts;
    }
  }
}

// const backupScript = NextScript.getInlineScriptSource;

// NextScript.getInlineScriptSource = (props) => {
//   if (props?.__NEXT_DATA__?.dynamicIds) {
//     const filteredDynamicModuleIds = props?.__NEXT_DATA__?.dynamicIds?.filter?.(
//       moduleID => !moduleID?.includes?.('lazy-hydrated'),
//     );

//     if (filteredDynamicModuleIds) {
//       props.__NEXT_DATA__.dynamicIds = filteredDynamicModuleIds;
//     }
//   }
//   return backupScript(props);
// };

export default function Document() {
  return (
    <Html lang="en">
      {/* <Head /> */}
      <LazyHead />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
