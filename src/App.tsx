import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useRoutes } from 'react-router-dom';
import routesConfig from './routesConfig';

const AppRoutes: React.FC = () => {
  const routes = useRoutes(routesConfig);
  return routes;
};

const App = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://app.beetroot.finance/tonconnect-manifest.json">
      <AppRoutes/>
    </TonConnectUIProvider>
  );
}

export default App
