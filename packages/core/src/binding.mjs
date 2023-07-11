function getPackage() {
  const { platform, arch } = process;

  switch (platform) {
    case 'win32':
      if (['x64', 'ia32'].includes(arch)) {
        return `@naria2/win32-${arch}`;
      }
    case 'darwin':
      if (['x64', 'arm64'].includes(arch)) {
        return `@naria2/darwin-${arch}`;
      }
    case 'linux':
      if (['x64', 'arm64'].includes(arch)) {
        return `@naria2/linux-${arch}`;
      }
  }

  throw new Error('naria2 does not provide aria2 binary of your platform');
}

export const BINARY = getPackage();
