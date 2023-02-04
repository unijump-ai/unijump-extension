import * as fs from 'fs';
import archiver from 'archiver';

const SOURCE_DIRS = ['extension-mv2', 'extension-mv3'];
const RELEASE_DIR = 'releases';

(async () => {
  !fs.existsSync(RELEASE_DIR) && fs.mkdirSync(RELEASE_DIR);

  for (const sourceDir of SOURCE_DIRS) {
    try {
      const manifest = (
        await import(`./${sourceDir}/manifest.json`, {
          assert: { type: 'json' },
        })
      ).default;

      const fileName = `${manifest.name}-v${manifest.version}.zip`;
      const fileDir = `${RELEASE_DIR}/v${manifest.manifest_version}`;

      !fs.existsSync(fileDir) && fs.mkdirSync(fileDir);

      const filePath = `${fileDir}/${fileName}`;

      const output = fs.createWriteStream(filePath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      archive
        .directory(sourceDir, false)
        .pipe(output)
        .on('error', (error) => {
          throw error;
        });

      output.on('close', () => {
        console.log(`${filePath} - ${archive.pointer()} total bytes`);
        console.log(`${filePath} - Finalized`);
      });

      output.on('end', () => {
        console.log(`${filePath} - End`);
      });

      archive.on('warning', (error) => {
        if (error.code === 'ENOENT') {
          console.warn(error);
          return;
        }

        throw error;
      });

      await archive.finalize();
    } catch (error) {
      console.error(`Problem archiving ${sourceDir}`, error);
      continue;
    }
  }
})();
