// src/components/ChatBox.jsx
import React, { useState } from "react";
import styled from "styled-components";

const ChatBox = ({ onSubmit }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
    }
  };

  return (
    <StyledWrapper>
      <form onSubmit={handleSubmit} className="search-container">
        <div className="inner-search">
            <span className="material-symbols-outlined search-icon">search</span>
            <input 
              placeholder="DECRYPT TELEMETRY QUERY..." 
              className="abyssal-input" 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="abyssal-submit">
                Execute
            </button>
        </div>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .search-container {
    width: 100%;
    position: relative;
    padding: 2px;
    background: linear-gradient(90deg, #a5e7ff, #d0bcff);
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(165, 231, 255, 0.2);
  }

  .inner-search {
    display: flex;
    align-items: center;
    background: #0c1324;
    border-radius: 10px;
    padding: 10px 15px;
    gap: 15px;
  }

  .search-icon {
    color: #a5e7ff;
    font-size: 24px;
  }

  .abyssal-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #dce1fb;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.05em;
  }

  .abyssal-input::placeholder {
    color: #4b5563;
    font-style: italic;
  }

  .abyssal-submit {
    background: #a5e7ff;
    color: #0c1324;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 11px;
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Manrope', sans-serif;
  }

  .abyssal-submit:hover {
    background: #fff;
    box-shadow: 0 0 15px #a5e7ff;
    transform: scale(1.02);
  }

  .abyssal-submit:active {
    transform: scale(0.98);
  }
`;

export default ChatBox;
