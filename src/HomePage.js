import { useState, useEffect } from "react";

export default function GitHubSearch() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (search.trim() === "") return;
    
    const fetchUser = async () => {
      try {
        setError(null);
        const userRes = await fetch(`https://api.github.com/users/${search}`);
        if (!userRes.ok) throw new Error("User not found");
        const userData = await userRes.json();
        setUser(userData);

        const reposRes = await fetch(`https://api.github.com/users/${search}/repos?sort=updated&per_page=3`);
        const reposData = await reposRes.json();
        setRepos(reposData);
      } catch (err) {
        setUser(null);
        setRepos([]);
        setError(err.message);
      }
    };

    const delayDebounce = setTimeout(fetchUser, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
      <div className="container mx-auto p-6 max-w-lg">
        <div className="mb-6 flex bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search GitHub Username..."
            className="w-full p-3 text-gray-200 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-800 text-red-300 p-4 rounded-md shadow-sm text-center font-semibold">
            {error}
          </div>
        )}

        {user && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 transition-all">
            <div className="flex items-center gap-4">
              <img src={user.avatar_url} alt={user.login} className="w-16 h-16 rounded-full border-2 border-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">{user.name || user.login}</h1>
                <p className="text-gray-400">{user.bio}</p>
              </div>
            </div>

            <ul className="flex justify-between mt-4 bg-gray-700 p-3 rounded-md shadow-sm">
              <li className="text-center">
                <span className="block text-lg font-semibold">{user.followers}</span>
                <span className="text-gray-400 text-sm">Followers</span>
              </li>
              <li className="text-center">
                <span className="block text-lg font-semibold">{user.following}</span>
                <span className="text-gray-400 text-sm">Following</span>
              </li>
              <li className="text-center">
                <span className="block text-lg font-semibold">{user.public_repos}</span>
                <span className="text-gray-400 text-sm">Repos</span>
              </li>
            </ul>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Last Updated Repositories</h2>
              <div className="space-y-2">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-700 p-3 rounded-md shadow-sm hover:bg-gray-600 transition-all"
                  >
                    {repo.name}
                  </a>
                ))}
              </div>
            </div>

            <button
              onClick={() => window.open(user.html_url, "_blank")}
              className="bg-blue-600 text-white w-full mt-6 p-3 rounded-md shadow-md hover:bg-blue-700 transition-all"
            >
              Go to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
