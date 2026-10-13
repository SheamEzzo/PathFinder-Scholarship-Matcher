import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { NotificationProvider } from "./context/NotificationContext";
import store from "./store/store";
import App from "./App";
import "./styles.css";
import "./pathy.css";
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </Provider>
      </BrowserRouter>
    </StrictMode>,
  );
}