import { CustomerProvider } from "./context/CustomerContext";
import { CustomerTable } from "./components/CustomerTable";

function App() {
  return (
    <CustomerProvider>
      <div className="App">
        <CustomerTable />
      </div>
    </CustomerProvider>
  );
}

export default App;
