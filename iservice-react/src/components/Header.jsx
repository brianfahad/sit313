import { Link } from "react-router-dom";

const Header = (props) => 
{
    return (
        <div>
            <div className="bg-gray-200 mt-4 w-11/12 mx-auto rounded-lg">
                <div className="flex justify-center py-4">
                    <p className="text-lg font-bold mr-12 pt-1">iService</p>
                    <Link to="/new-task" className="my-auto"><button className="mx-4">Post a task</button></Link>
                    <button className="mx-4">Become an expert</button>
                    <button className="mx-4">Find tasks</button>
                    <button className="mx-4">How it works</button>
                    <Link to="/login" className="my-auto"><button className="ml-12 border-green-900 px-3 py-1 rounded border-2 text-green-900 font-semibold">Sign in</button></Link>
                </div>
            </div>
        </div>
    );
}

export default Header