import * as fs from 'fs';
import archiver from 'archiver';

const SOURCE_DIRS = ['dist/mv2', 'dist/mv3'];
const RELEASE_DIR = 'releases';

(async () => {
  !fs.existsSync(RELEASE_DIR) && fs.mkdirSync(RELEASE_DIR);

  for (const sourceDir of SOURCE_DIRS) {
    try {
      const manifestString = fs.readFileSync(`${sourceDir}/manifest.json`, 'utf-8');
      const manifest = JSON.parse(manifestString);
      const packageString = fs.readFileSync('./package.json', 'utf-8');
      const pkg = JSON.parse(packageString);

      const fileName = `${pkg.name}-v${manifest.version}.zip`;
      const fileDir = `${RELEASE_DIR}/mv${manifest.manifest_version}`;

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
