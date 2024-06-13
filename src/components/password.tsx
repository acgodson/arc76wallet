import React, { useState } from "react";

const PasswordPrompt = ({ onSubmit }: { onSubmit: (password: string) => void }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(password);
  };

  return (
    <div>
      <h2>Enter your password to unlock the wallet</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Unlock</button>
      </form>
    </div>
  );
};

export default PasswordPrompt;
