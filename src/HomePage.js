import { useState } from "react";
import axios from "axios";


const APIURL = "https://api.github.com/users/";

export default function GitHubSearch() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const getUser = async (username) => {
    try {
      setError(null);
      const { data } = await axios.get(`${APIURL}${username}`);
      setUser(data);
      getRepos(username);
    } catch (err) {
      setUser(null);
      setRepos([]);
      setError("No profile with this username");
    }
  };

  const getRepos = async (username) => {
    try {
      const { data } = await axios.get(`${APIURL}${username}/repos?sort=created`);
      setRepos(data.slice(0, 5));
    } catch (err) {
      setError("Problem fetching repos");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) getUser(search);
  };

  return (
    <div className="container mx-auto p-6 max-w-lg text-white">
  <form onSubmit={handleSubmit} className="mb-6 flex bg-gray-700 rounded-lg shadow-md">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search GitHub Username..."
      className="w-full p-3 text-black rounded-l-lg focus:outline-none"
    />
    <button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-r-lg hover:from-blue-600 hover:to-indigo-600 transition-all">
      Search
    </button>
  </form>
  
  {error && (
    <div className="bg-red-500 p-4 rounded-md shadow-md text-center font-semibold">
      {error}
    </div>
  )}
  
  {user && (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition-all">
      <div className="flex items-center gap-4">
        <img src={user.avatar_url} alt={user.login} className="w-16 h-16 rounded-full border-2 border-indigo-400" />
        <div>
          <h1 className="text-2xl font-bold">{user.name || user.login}</h1>
          <p className="text-gray-300">{user.bio}</p>
        </div>
      </div>
      
      <ul className="flex justify-between mt-4 bg-gray-700 p-3 rounded-md shadow-md">
        <li className="text-center">
          <span className="block text-lg font-semibold">{user.followers}</span>
          <span className="text-gray-300 text-sm">Followers</span>
        </li>
        <li className="text-center">
          <span className="block text-lg font-semibold">{user.following}</span>
          <span className="text-gray-300 text-sm">Following</span>
        </li>
        <li className="text-center">
          <span className="block text-lg font-semibold">{user.public_repos}</span>
          <span className="text-gray-300 text-sm">Repos</span>
        </li>
      </ul>
      
      <div className="mt-6 space-y-2">
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-700 p-3 rounded-md shadow-md hover:bg-gray-600 transition-all"
          >
            {repo.name}
          </a>
        ))}
      </div>
      
      <button
        onClick={() => window.open(user.html_url, "_blank")}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 w-full mt-6 p-3 rounded-md shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all"
      >
        Go to Profile
      </button>
    </div>
  )}
</div>

  );
}
