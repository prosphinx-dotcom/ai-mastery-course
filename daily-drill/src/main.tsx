import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { DemoReview } from './screens/DemoReview';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoReview />
  </StrictMode>,
);
