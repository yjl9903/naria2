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
    <div className="h-screen flex flex-col">
      <header className="relative z-40 border-b text-primary px-3 sm:px-12">
        <div className="mx-auto">
          <div className="flex items-center pb-2 pt-3 md:pb-3 md:pt-4">
            <div className="hidden items-center rounded px-1 py-2 text-2xl font-medium leading-none text-primary transition hover:bg-secondary sm:flex select-none">
              naria2
            </div>
            <div className="flex-grow"></div>
          </div>
          <div></div>
        </div>
      </header>

      <main className="px-3 sm:px-12 flex-grow">{props.children}</main>

      <footer className="px-3 sm:px-12 mt-12 pb-4 text-gray-500">
        <p>
          <span>aria2 version = {data?.version}</span>
        </p>
        <p>
          <span>Features = {JSON.stringify(data?.enabledFeatures ?? 'null')}</span>
        </p>
      </footer>
    </div>
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
