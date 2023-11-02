import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAria2 } from '@/aria2';

const ConnectSchema = z.object({
  host: z.string().optional(),
  port: z.coerce.number().min(0).optional(),
  secret: z.string().optional()
});

const getDefaultConnection = () => {
  try {
    const options = JSON.parse(window.localStorage.getItem('naria2/connection') ?? 'null') as {
      port?: number;
      secrect?: string;
    } | null;
    return {
      host: `${location.protocol}//${location.hostname}`,
      port: +`${options?.port ?? location.port}`,
      secret: options?.secrect ?? ''
    };
  } catch {
    return {
      host: `${location.protocol}//${location.hostname}`,
      port: +`${location.port}`,
      secret: ''
    };
  }
};

export default function Connect() {
  const aria2 = useAria2();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof ConnectSchema>>({
    resolver: zodResolver(ConnectSchema),
    defaultValues: getDefaultConnection()
  });

  async function onSubmit(values: z.infer<typeof ConnectSchema>) {
    try {
      const client = await aria2.connect({
        port: values.port,
        secret: values.secret ? values.secret : undefined
      });
      if (client) {
        navigate('/');
      } else {
        form.reset();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex h-screen w-screen">
      <div className="w-full sm:w-2/3 sm:border-r h-full flex items-center justify-center">
        <div className="w-[60%]">
          <h1 className="text-2xl font-bold mb-4 select-none">
            Connect{' '}
            <Link to="/" className="hover:underline decoration-dotted">
              naria2
            </Link>
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="http://127.0.0.1"
                        autoComplete="false"
                        autoCorrect="false"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is aria2 RPC server host.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="6800"
                        autoComplete="false"
                        autoCorrect="false"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is aria2 RPC server port.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        autoFocus={true}
                        autoComplete="false"
                        autoCorrect="false"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is aria2 RPC auth secret.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="select-none">
                Connect
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="flex-grow"></div>
    </div>
  );
}
