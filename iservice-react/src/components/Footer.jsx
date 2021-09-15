import Facebook from '../images/facebook.png'
import Instagram from '../images/instagram.png'
import Twitter from '../images/twitter.png'

const Footer = (props) => 
{
    return (
        <div className="flex mb-4 w-11/12 mx-auto">
            <div className="bg-gray-200 w-3/4 mr-2 rounded-lg">
                <div className="flex justify-center py-4">
                    <p className="text-lg font-bold mr-4 pt-1">Newsletter Sign-up</p>
                    <input type="text" className="mr-4 border border-green-900 rounded px-4" placeholder="Email" />
                    <button className="border-green-900 px-3 py-1 rounded border-2 text-green-900 font-semibold">Subscribe</button>
                </div>
            </div>
            <div className="bg-gray-200 w-1/4 ml-2 rounded-lg">
                <div className="flex justify-center py-4">
                    <p className="text-lg font-bold mr-4 pt-1">Connect to us</p>
                    <img src={Facebook} alt="Facebook" className="w-6 h-6 mt-1" />
                    <img src={Instagram} alt="Instagram" className="w-6 h-6 mx-4 mt-1" />
                    <img src={Twitter} alt="Twitter" className="w-6 h-6 mt-1" />
                </div>
            </div>
        </div>
    );
}

export default Footer