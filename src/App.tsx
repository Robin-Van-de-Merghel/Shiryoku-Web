import { useRoutes } from 'react-router-dom';
import { routes } from '@/app/router';
import { RootLayout } from '@/components/layout/root-layout';

export function App() {
  const element = useRoutes(routes);
  return <RootLayout>{element}</RootLayout>;
}

export default App;
