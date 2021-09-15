// import logo from './logo.svg';
import './App.css';

import Header from './components/Header'
import CardList from './components/CardList'
import ExpertList from './ExpertList';
import Footer from './components/Footer'

function App() {
  return (
    <div className="App">
      <Header />
      <h1 className="text-4xl font-bold mt-12">Featured Experts</h1>
      <div className="grid grid-cols-4 w-2/3 mx-auto">
        <CardList experts={ExpertList} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
