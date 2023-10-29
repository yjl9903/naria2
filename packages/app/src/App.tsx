import { ReactQueryDevtools } from 'react-query/devtools';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';

import { client } from '~naria2/jsonrpc';

import Home from './pages/Home';

function Layout(props: { children: React.ReactElement }) {
  const { data } = useQuery('naria2/version', async () => client!.version());

  return (
    <>
      <main>{props.children}</main>
      <footer>
        <p>
          <span>Aria2 version = {data?.version}</span>
        </p>
        <p>
          <span>Enabled features = {JSON.stringify(data?.enabledFeatures ?? 'null')}</span>
        </p>
      </footer>
    </>
  );
}

const queryClient = new QueryClient();

export default function App() {
  if (client) {
    return (
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Home></Home>
        </Layout>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  }
}
