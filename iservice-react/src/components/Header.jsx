import HeaderImg from '../images/deakin_header.png'

const Header = (props) => 
{
    return (
        <div>
            <div className="bg-gray-200 mt-4 w-11/12 mx-auto rounded-lg">
                <div className="flex justify-center py-4">
                    <p className="text-lg font-bold mr-12 pt-1">iService</p>
                    <button className="mx-4">Post a task</button>
                    <button className="mx-4">Become an expert</button>
                    <button className="mx-4">Find tasks</button>
                    <button className="mx-4">How it works</button>
                    <button className="ml-12 border-green-900 px-3 py-1 rounded border-2 text-green-900 font-semibold">Sign in</button>
                </div>
            </div>
            <img src={HeaderImg} alt="Header" className="mt-4 w-11/12 mx-auto rounded-lg" />
        </div>
    );
}

export default Header