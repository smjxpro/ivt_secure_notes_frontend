import React, { useState, useEffect } from 'react';
import { request } from '../api';

interface InterestGroup {
  interest: string;
  usersCount: number;
  users: { id: string; name: string; email: string }[];
}

export const AggregationsPage: React.FC = () => {
  const [interestGroups, setInterestGroups] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInterests = async () => {
      setLoading(true);
      try {
        const data = await request<InterestGroup[]>('/aggregations/interests');
        setInterestGroups(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#0f172a' }}>Aggregation Pipelines</h1>
      <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '14px' }}>
        Live view of users grouped by interests via a single MongoDB aggregation pipeline.
      </p>

      {loading ? (
        <p>Running aggregation pipeline...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {interestGroups.map((group) => (
            <div key={group.interest} style={{ border: '1px solid #e2e8f0', backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '16px', color: '#0f172a', textTransform: 'capitalize' }}>
                  {group.interest}
                </span>
                <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                  {group.usersCount} users
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#475569' }}>
                {group.users.map((u) => (
                  <li key={u.id} style={{ padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <strong>{u.name}</strong> ({u.email})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};