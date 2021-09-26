import { Link } from "react-router-dom";

const Login = (props) => 
{
    return (
        <div>
                <div className="mt-36 w-max bg-gray-200 mx-auto rounded-lg p-10">
                    <h2 className="text-4xl text-green-900 font-bold text-left">Login</h2>
                    <div className="mt-5">
                        <label htmlFor="email" className="block text-left mb-2">Email</label>
                        <input type="text" htmlFor="email" className="py-1 border border-green-900 rounded px-4 w-72" placeholder="Email" />
                    </div>
                    <div className="mt-5">
                        <label htmlFor="password" className="block text-left mb-2">Password</label>
                        <input type="password" htmlFor="password" className="py-1 border border-green-900 rounded px-4 w-72" placeholder="Password" />
                    </div>

                    <button className="mt-5 bg-green-900 px-8 py-1 rounded text-white font-semibold w-full">Enter</button>

                    <p className="text-green-900 mt-5">Don't have an account? <Link to="/register" className="my-auto font-bold">Register here.</Link></p>
                </div>
        </div>
    );
}

export default Login