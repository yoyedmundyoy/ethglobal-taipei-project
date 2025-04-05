'use client';

import { countries, getUniversalLink } from '@selfxyz/core';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';

export default function Home() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const userId = v4();

  useEffect(() => {
    const storedDetails = localStorage.getItem('userDetails');
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
    }
  }, []);

  const selfApp = new SelfAppBuilder({
    appName: "Self Workshop",
    scope: "self-workshop",
    endpoint: `${process.env.NEXT_PUBLIC_SELF_ENDPOINT}/api/verify/`,
    logoBase64: userDetails?.imageUrl || "https://pluspng.com/img-png/images-owls-png-hd-owl-free-download-png-png-image-485.png",
    userId: userId,
    disclosures: {
      minimumAge: 20,
      ofac: true,
      excludedCountries: [countries.FRANCE],
      name: true,
    }
  }).build();

  console.log('Universal link:', getUniversalLink(selfApp));

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center gap-4">
      {userDetails && (
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold">Welcome, {userDetails.name}</h2>
          <img 
            src={userDetails.imageUrl} 
            alt="User" 
            className="w-32 h-32 rounded-full mt-4"
          />
        </div>
      )}
      <SelfQRcodeWrapper
        selfApp={selfApp}
        onSuccess={() => {
          window.location.href = '/verified';
        }}
      />
      <button
        onClick={() => {
          window.alert(getUniversalLink(selfApp));
        }}
        className="mt-4 bg-black text-white p-2 px-3 rounded-md"
      >
        Open Self app
      </button>
    </div>
  );
}
