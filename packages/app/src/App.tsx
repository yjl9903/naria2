import { useQuery, QueryClient, QueryClientProvider } from 'react-query';

import { client } from '~naria2/jsonrpc';

function Info() {
  const { data } = useQuery('naria2/version', async () => client!.version());

  return (
    <>
      <p>
        <span>Aria2 version = {data?.version}</span>
      </p>
      <p>
        <span>Enabled features = {JSON.stringify(data?.enabledFeatures ?? 'null')}</span>
      </p>
    </>
  );
}

const queryClient = new QueryClient();

export default function App() {
  if (client) {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
          <Info></Info>
        </div>
      </QueryClientProvider>
    );
  }
}
