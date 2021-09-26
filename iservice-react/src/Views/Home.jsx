import CardList from "../components/CardList";
import ExpertList from "../ExpertList"

import Header from "../components/Header"
import Footer from "../components/Footer"

import HeaderImg from '../images/deakin_header.png'

const Home = (props) => 
{
    return (
        <div>
            <Header />
            <img src={HeaderImg} alt="Header" className="mt-4 w-11/12 mx-auto rounded-lg" />
            <h1 className="text-4xl font-bold mt-12">Featured Experts</h1>
            <div className="grid grid-cols-4 w-2/3 mx-auto">
                <CardList experts={ExpertList} />
            </div>
            <Footer />
        </div>
    );
}

export default Home