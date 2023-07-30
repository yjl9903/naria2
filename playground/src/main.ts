import { socket, client } from '~naria2/jsonrpc';

console.log('naria2 socket:', socket);
console.log('naria2 client:', client);

const app = document.querySelector('#app');
if (app && client) {
  const version = await client.version();
  app.innerHTML = `Aria2 verion = ${version.version}<br/>Enabled features = ${JSON.stringify(
    version.enabledFeatures
  )}`;
}
