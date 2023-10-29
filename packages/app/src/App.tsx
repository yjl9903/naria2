import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './pages/Home';
import { useAria2 } from './aria2';

function Layout(props: { children: React.ReactElement }) {
  const { client } = useAria2();
  const { data } = useQuery({
    queryKey: ['naria2/version'],
    queryFn: async () => await client?.version()
  });

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
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Home></Home>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
