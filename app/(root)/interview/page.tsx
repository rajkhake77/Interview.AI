// app/interview/page.tsx
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
import React from 'react';

const InterviewPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <p>Please login to access the interview page.</p>;
  }

  return (
    <>
      <h3>Interview Generation</h3>
      <Agent
        userName={user?.name!}
        userId={user?.id}
        profileImage={user?.profileURL}
        type="generate"
      />
    </>
  );
};

export default InterviewPage;
