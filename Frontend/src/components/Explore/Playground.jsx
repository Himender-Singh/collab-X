import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  FaGithub, 
  FaCode, 
  FaChartLine, 
  FaLink, 
  FaUnlink,
  FaLaptopCode
} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Playground = () => {
  const { user } = useSelector((store) => store.auth);
  const [profiles, setProfiles] = useState({
    leetcode: { username: '', connected: false, data: null },
    github: { username: '', connected: false, data: null }
  });
  const [loading, setLoading] = useState({
    leetcode: false,
    github: false
  });
  const [activeTab, setActiveTab] = useState('overview');

  // Auto-fetch data when component mounts or user changes
  useEffect(() => {
    if (user) {
      // Initialize profiles with user data
      const newProfiles = {
        leetcode: { 
          username: user.leetcode || '', 
          connected: !!user.leetcode, 
          data: null 
        },
        github: { 
          username: user.github || '', 
          connected: !!user.github, 
          data: null 
        }
      };
      setProfiles(newProfiles);

      // Auto-fetch if usernames exist
      if (user.leetcode) {
        fetchLeetCodeData(user.leetcode);
      }
      if (user.github) {
        fetchGitHubData(user.github);
      }
    }
  }, [user]);

  const fetchLeetCodeData = async (username) => {
    setLoading(prev => ({ ...prev, leetcode: true }));
    try {
      const response = await axios.post('https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql', {
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                ranking
              }
            }
            userContestRanking(username: $username) {
              rating
            }
          }
        `,
        variables: { username }
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = response.data.data;
      if (!data.matchedUser) {
        throw new Error('User not found on LeetCode');
      }

      const solvedStats = data.matchedUser.submitStats.acSubmissionNum;

      setProfiles(prev => ({
        ...prev,
        leetcode: {
          ...prev.leetcode,
          data: {
            totalSolved: solvedStats.find(d => d.difficulty === "All")?.count || 0,
            easySolved: solvedStats.find(d => d.difficulty === "Easy")?.count || 0,
            mediumSolved: solvedStats.find(d => d.difficulty === "Medium")?.count || 0,
            hardSolved: solvedStats.find(d => d.difficulty === "Hard")?.count || 0,
            ranking: data.matchedUser.profile.ranking,
            contestRating: data.userContestRanking?.rating || "N/A"
          },
          connected: true
        }
      }));
    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
      setProfiles(prev => ({
        ...prev,
        leetcode: {
          ...prev.leetcode,
          connected: false,
          error: error.response?.data?.error || error.message
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, leetcode: false }));
    }
  };

  const fetchGitHubData = async (username) => {
    setLoading(prev => ({ ...prev, github: true }));
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      const repoResponse = await axios.get(`https://api.github.com/users/${username}/repos`);
      const repos = repoResponse.data;

      let languageStats = {};
      for (let repo of repos) {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      }

      setProfiles(prev => ({
        ...prev,
        github: {
          ...prev.github,
          data: {
            publicRepos: response.data.public_repos,
            stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
            forks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
            languages: languageStats
          },
          connected: true
        }
      }));
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      setProfiles(prev => ({
        ...prev,
        github: {
          ...prev.github,
          connected: false,
          error: error.message
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, github: false }));
    }
  };

  const handleConnect = (platform) => {
    const username = profiles[platform].username;
    if (!username) return;

    switch (platform) {
      case 'leetcode':
        fetchLeetCodeData(username);
        break;
      case 'github':
        fetchGitHubData(username);
        break;
      default:
        break;
    }
  };

  const handleDisconnect = (platform) => {
    setProfiles(prev => ({
      ...prev,
      [platform]: {
        username: '',
        connected: false,
        data: null
      }
    }));
  };

  const handleUsernameChange = (platform, value) => {
    setProfiles(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        username: value
      }
    }));
  };

  // Chart data configurations
  const solvedProblemsChart = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Problems Solved',
        data: profiles.leetcode.data ? [
          profiles.leetcode.data.easySolved,
          profiles.leetcode.data.mediumSolved,
          profiles.leetcode.data.hardSolved
        ] : [0, 0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const githubLanguagesChart = {
    labels: profiles.github.data ? Object.keys(profiles.github.data.languages) : [],
    datasets: [
      {
        label: 'Repositories by Language',
        data: profiles.github.data ? Object.values(profiles.github.data.languages) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const codingScoresChart = {
    labels: ['LeetCode'],
    datasets: [
      {
        label: 'Contest Rating',
        data: [
          profiles.leetcode.data ? (typeof profiles.leetcode.data.contestRating === 'number' ? 
            profiles.leetcode.data.contestRating : 0) : 0
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#E5E7EB',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#E5E7EB'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#E5E7EB'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.1)'
        }
      }
    }
  };

  const ChartContainer = ({ title, children }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
          <FaLaptopCode className="mr-2" /> Developer Playground
        </h1>
        
        {/* Profile Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* LeetCode Card */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faCode} className="text-orange-500 text-2xl mr-2" />
              <h2 className="text-xl font-semibold text-white">LeetCode</h2>
            </div>
            {profiles.leetcode.connected ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Connected as:</span>
                  <span className="font-medium text-white">{profiles.leetcode.username}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Problems Solved:</span>
                    <span className="font-medium text-white">{profiles.leetcode.data?.totalSolved || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contest Rating:</span>
                    <span className="font-medium text-white">
                      {typeof profiles.leetcode.data?.contestRating === 'number' ? 
                       Math.round(profiles.leetcode.data.contestRating) : 'N/A'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDisconnect('leetcode')}
                  className="w-full flex items-center justify-center py-2 px-4 bg-red-900 text-red-100 rounded-md hover:bg-red-800 transition"
                >
                  <FaUnlink className="mr-2" /> Disconnect
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={profiles.leetcode.username}
                    onChange={(e) => handleUsernameChange('leetcode', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="leetcode_username"
                  />
                </div>
                <button
                  onClick={() => handleConnect('leetcode')}
                  disabled={loading.leetcode || !profiles.leetcode.username}
                  className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition ${loading.leetcode || !profiles.leetcode.username ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-900 text-blue-100 hover:bg-blue-800'}`}
                >
                  {loading.leetcode ? (
                    'Connecting...'
                  ) : (
                    <>
                      <FaLink className="mr-2" /> Connect
                    </>
                  )}
                </button>
                {profiles.leetcode.error && (
                  <p className="text-red-400 text-sm mt-2">{profiles.leetcode.error}</p>
                )}
              </div>
            )}
          </div>

          {/* GitHub Card */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <FaGithub className="text-gray-200 text-2xl mr-2" />
              <h2 className="text-xl font-semibold text-white">GitHub</h2>
            </div>
            {profiles.github.connected ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Connected as:</span>
                  <span className="font-medium text-white">{profiles.github.username}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Public Repos:</span>
                    <span className="font-medium text-white">{profiles.github.data?.publicRepos || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Stars:</span>
                    <span className="font-medium text-white">{profiles.github.data?.stars || 0}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDisconnect('github')}
                  className="w-full flex items-center justify-center py-2 px-4 bg-red-900 text-red-100 rounded-md hover:bg-red-800 transition"
                >
                  <FaUnlink className="mr-2" /> Disconnect
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={profiles.github.username}
                    onChange={(e) => handleUsernameChange('github', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="github_username"
                  />
                </div>
                <button
                  onClick={() => handleConnect('github')}
                  disabled={loading.github || !profiles.github.username}
                  className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition ${loading.github || !profiles.github.username ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-900 text-blue-100 hover:bg-blue-800'}`}
                >
                  {loading.github ? (
                    'Connecting...'
                  ) : (
                    <>
                      <FaLink className="mr-2" /> Connect
                    </>
                  )}
                </button>
                {profiles.github.error && (
                  <p className="text-red-400 text-sm mt-2">{profiles.github.error}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Performance Visualization */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 mb-8">
          <div className="flex items-center mb-6">
            <FaChartLine className="text-blue-500 text-2xl mr-2" />
            <h2 className="text-xl font-semibold text-white">Performance Analytics</h2>
          </div>

          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'problems' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('problems')}
            >
              Problems Solved
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'github' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('github')}
            >
              GitHub Stats
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartContainer title="Coding Scores">
                <Bar data={codingScoresChart} options={chartOptions} />
              </ChartContainer>
              <ChartContainer title="Problems Solved">
                <Line data={solvedProblemsChart} options={chartOptions} />
              </ChartContainer>
            </div>
          )}

          {activeTab === 'problems' && (
            <ChartContainer title="Problems Solved by Difficulty">
              <Bar data={solvedProblemsChart} options={chartOptions} />
            </ChartContainer>
          )}

          {activeTab === 'github' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartContainer title="Language Distribution">
                <Pie 
                  data={githubLanguagesChart} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        ...chartOptions.plugins.legend,
                        position: 'right'
                      }
                    }
                  }} 
                />
              </ChartContainer>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">GitHub Stats</h3>
                {profiles.github.data && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-gray-400">Public Repositories</div>
                      <div className="text-2xl font-bold text-white">{profiles.github.data.publicRepos}</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-gray-400">Total Stars</div>
                      <div className="text-2xl font-bold text-white">{profiles.github.data.stars}</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-gray-400">Total Forks</div>
                      <div className="text-2xl font-bold text-white">{profiles.github.data.forks}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-900 rounded-lg p-6 border border-blue-800">
            <div className="flex items-center mb-2">
              <FaCode className="text-blue-300 mr-2" />
              <h3 className="text-lg font-medium text-white">Total Problems Solved</h3>
            </div>
            <div className="text-3xl font-bold text-blue-200">
              {profiles.leetcode.data?.totalSolved || 0}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-2">
              <FaGithub className="text-gray-200 mr-2" />
              <h3 className="text-lg font-medium text-white">GitHub Repositories</h3>
            </div>
            <div className="text-3xl font-bold text-gray-200">
              {profiles.github.data?.publicRepos || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;