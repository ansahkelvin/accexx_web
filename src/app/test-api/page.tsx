'use client';

import { useState } from 'react';

export default function TestAPIPage() {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testAPI = async (endpoint: string) => {
        setLoading(true);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'test123'
                }),
            });

            const text = await response.text();
            setResult(`Endpoint: ${endpoint}\nStatus: ${response.status}\nResponse: ${text}`);
        } catch (error) {
            setResult(`Endpoint: ${endpoint}\nError: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">API Test</h1>
            <div className="space-y-2">
                <button 
                    onClick={() => testAPI('https://accexx-backend-gbn6c.ondigitalocean.app/api/auth/user/login')}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-2"
                >
                    Test with /api
                </button>
                <button 
                    onClick={() => testAPI('https://accexx-backend-gbn6c.ondigitalocean.app/auth/user/login')}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-2"
                >
                    Test without /api
                </button>
                <button 
                    onClick={() => testAPI('https://accexx-backend-gbn6c.ondigitalocean.app/')}
                    disabled={loading}
                    className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Test root
                </button>
            </div>
            <pre className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
                {result || 'Click a button to test the API'}
            </pre>
        </div>
    );
} 