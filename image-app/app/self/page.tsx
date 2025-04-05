'use client';

import { countries, getUniversalLink } from '@selfxyz/core';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [userDetails, setUserDetails] = useState<any>(null);
    const userId = v4();
    const [pause, setPause] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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

    const handleVerify = async () => {
        try {   
            const response = await fetch('/api/verify', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const result = await response.json();
            console.log(`${result.name[0]} ${result.name[1]}`);
            const storedDetails = localStorage.getItem('userDetails');
            if (storedDetails) {
                const details = JSON.parse(storedDetails);
                console.log('Name from localStorage:', details.name);
                
                // Compare the names
                if (result.name) {
                    const verifiedName = `${result.name[0]} ${result.name[1]}`;
                    console.log('Comparing names:');
                    console.log('- Verified name:', verifiedName);
                    console.log('- Stored name:', details.name);
                    
                    if (verifiedName === details.name) {
                        console.log('✅ Names match!');
                        window.location.href = '/verified';
                    } else {
                        console.log('❌ Names do not match');
                        setError('Name verification failed - names do not match');
                    }
                }
            } else {
                console.log('No user details found in localStorage');
                setError('Missing name data for verification');
            }
        } catch (err) {
            setError('Error fetching user details');
            console.error('Error:', err);
        }
        
        setLoading(true);
        setError(null);
    };
    
    return (
        <div style={{
            background: "linear-gradient(to right, #fff2e1, #f1ecfc, #ebfdf7)",
            minHeight: "100vh",
            fontFamily: "Arial, sans-serif",
        }}>
            {/* Top Bar */}
            <div style={{
                width: "100%",
                padding: "0px 30px",
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            }}>
                <img
                    src="/ethglobal-logo-vector.png"
                    alt="Logo"
                    style={{ width: "160px" }}
                />
            </div>

            {/* Page Title Section */}
            <div style={{ textAlign: "center", padding: "40px 20px 10px" }}>
                <h1 className="text-4xl mb-2 lg:mb-3 lg:text-6xl font-bold">
                    Self Verification
                </h1>
                <p className="lg:text-lg text-black-500 font-medium">
                    Use Self Protocol to prove your identity
                </p>
            </div>

            {/* Main Card */}
            <div className="flex justify-center items-center p-4">
                <div style={{
                    backgroundColor: "#ffffff",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    width: "600px",
                    border: "2px solid black"
                }}>
                    <h2 className="text-2xl font-bold text-center mb-4">Verify with Self</h2>

                    {userDetails && (
                        <div className="text-center mb-6 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#c6c9f6] shadow-lg">
                                <img
                                    src={userDetails.imageUrl}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xl font-bold mt-3 text-gray-800">
                                {userDetails.name}
                            </p>
                        </div>
                    )}

                    <div className="rounded-2xl p-4 w-full mb-4" style={{ backgroundImage: 'url(/self.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <SelfQRcodeWrapper selfApp={selfApp} onSuccess={handleVerify} />
                    </div>

                    <button
                        onClick={() => window.alert(getUniversalLink(selfApp))}
                        className="bg-[#c6c9f6] text-black font-bold py-2 px-6 rounded-full w-full mb-2"
                    >
                        Open Self App
                    </button>

                    {loading && (
                        <p className="text-blue-500 font-medium mt-2">Verifying...</p>
                    )}

                    {error && (
                        <p className="text-red-500 font-medium mt-2">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
