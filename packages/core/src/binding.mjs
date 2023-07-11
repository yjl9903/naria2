// import path from 'node:path';

function getPackage() {
  const { platform, arch } = process;
  switch (platform) {
    case 'win32':
      break;
    case 'darwin':
      break;
    case 'linux':
      break;
    default:
      throw new Error('naria2 does not provide aria2 binary of your platform');
  }
  return '@naria2/win32-x64';
}

export const BINARY = getPackage();
