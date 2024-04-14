import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { router } from 'router';

function App() {
  return (
    <main className="main-wrapper">
      <Toaster
        position="bottom-left"
        toastOptions={{ duration: 5000, className: 'custom-toast' }}
      />
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
