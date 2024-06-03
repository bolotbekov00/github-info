import React, { useState } from "react";
import "./App.css";

type UserType = {
  name: string;
  public_repos: number;
};

type RepoType = {
  full_name: string;
  stargazers_count: number;
};

const App: React.FC = () => {
  const [nickname, setNickname] = useState<string>("");
  const [type, setType] = useState<string>("user");
  const [data, setData] = useState<UserType | RepoType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setData(null);

    const endpoint =
      type === "user"
        ? `https://api.github.com/users/${nickname}`
        : `https://api.github.com/repos/${nickname}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      setError(
        "Failed to fetch data. Please check the nickname and try again."
      );
    }
  };

  return (
    <div className="App">
      <UserRepoForm
        nickname={nickname}
        type={type}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleSubmit}
      />
      <InfoDisplay data={data} error={error} type={type} />
    </div>
  );
};

interface UserRepoFormProps {
  nickname: string;
  type: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const UserRepoForm: React.FC<UserRepoFormProps> = ({
  nickname,
  type,
  onInputChange,
  onSelectChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={nickname}
        onChange={onInputChange}
        placeholder="Enter nickname or repo"
      />
      <select value={type} onChange={onSelectChange}>
        <option value="user">User</option>
        <option value="repo">Repository</option>
      </select>
      <button type="submit">Fetch Info</button>
    </form>
  );
};

interface InfoDisplayProps {
  data: UserType | RepoType | null;
  error: string | null;
  type: string;
}

const InfoDisplay: React.FC<InfoDisplayProps> = ({ data, error, type }) => {
  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  if (type === "user" && "public_repos" in data) {
    return (
      <div>
        <p>Full Name: {data.name}</p>
        <p>Number of Repos: {data.public_repos}</p>
      </div>
    );
  }
  if (type === "repo" && "stargazers_count" in data) {
    return (
      <div>
        <p>Repo Name: {data.full_name}</p>
        <p>Stars: {data.stargazers_count}</p>
      </div>
    );
  }
  return null;
};

export default App;
