'use client';

export default function RegisterFail() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Registration Failed</h1>
            <p className="mb-4 text-red-500">Please try again.</p>
            {/* <button
                onClick={() => window.location.href = '/register'}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Retry Registration
            </button> */}
        </div>
    );
}