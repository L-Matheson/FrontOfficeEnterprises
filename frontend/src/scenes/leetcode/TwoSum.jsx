import React, { useState } from "react";

export default function TwoSum({ problem }) {
  const [step, setStep] = useState(0);
  const nums = problem.example?.nums || [2,7,11,15];
  const target = problem.example?.target || 9;

  const pairs = [];
  for (let i=0;i<nums.length;i++){
    for (let j=i+1;j<nums.length;j++){
      pairs.push({ i, j, sum: nums[i]+nums[j] });
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => setStep(s => Math.max(0, s-1))}>Prev</button>
        <button onClick={() => setStep(s => s+1)} style={{ marginLeft: 8 }}>Next</button>
        <span style={{ marginLeft: 12 }}>Step: {step}</span>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div>
          {nums.map((n, idx) => (
            <div key={idx} style={{ padding: 8, border: idx === pairs[step % pairs.length].i || idx === pairs[step % pairs.length].j ? "2px solid #0077ff" : "1px solid #ddd" }}>
              {n}
            </div>
          ))}
        </div>
        <div style={{ alignSelf: "center" }}>
          sum = {pairs[step % pairs.length].sum}
        </div>
      </div>
    </div>
  );
}
