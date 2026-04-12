"use client";

import { useState } from "react";
import { votePost } from "@/actions/votes";
import { ChevronUp, ChevronDown } from "lucide-react";

interface VoteControlsProps {
  postId: string;
  initialVotes: number;
  initialUserVote?: number;
}

export default function VoteControls({ postId, initialVotes, initialUserVote }: VoteControlsProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(initialUserVote || 0);

  async function handleVote(type: number) {
    // Optimistic Update
    const oldUserVote = userVote;
    const oldVotes = votes;
    
    let newVotes = votes;
    let newUserVote = type;

    if (userVote === type) {
      newUserVote = 0;
      newVotes -= type;
    } else if (userVote !== 0) {
      newVotes += (type * 2);
    } else {
      newVotes += type;
    }

    setVotes(newVotes);
    setUserVote(newUserVote);

    const res = await votePost(postId, type);
    if (res.error) {
      setVotes(oldVotes);
      setUserVote(oldUserVote);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 bg-white/5 p-2 rounded-2xl border border-white/5">
      <button 
        onClick={() => handleVote(1)}
        className={`p-1 rounded-lg transition-all ${userVote === 1 ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "text-zinc-500 hover:text-emerald-400"}`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>
      
      <span className={`font-black text-sm font-mono ${userVote === 1 ? "text-emerald-400" : userVote === -1 ? "text-red-400" : "text-white"}`}>
        {votes}
      </span>

      <button 
        onClick={() => handleVote(-1)}
        className={`p-1 rounded-lg transition-all ${userVote === -1 ? "bg-red-500 text-black shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "text-zinc-500 hover:text-red-400"}`}
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </div>
  );
}
