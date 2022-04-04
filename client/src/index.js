import  ReactDOMClient from "react-dom/client";
import App from "./App"
import './index.css'
import { TransactionProvider } from "./context/TransactionProvider";


const container = document.getElementById("root");


const root = ReactDOMClient.createRoot(container);


root.render(<TransactionProvider> <App/> </TransactionProvider>);



