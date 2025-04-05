import { NextResponse } from 'next/server';

const mockDatabase: Record<string, { name: string; imageUrl: string }> = {
    "1": { name: "John Doe", imageUrl: "https://example.com/john.jpg" },
    "2": { name: "Jane Smith", imageUrl: "https://example.com/jane.jpg" },
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("registration_id");

    if (!registrationId || !mockDatabase[registrationId]) {
        return NextResponse.json({ error: "Registration ID not found" }, { status: 404 });
    }

    const { name, imageUrl } = mockDatabase[registrationId];
    return NextResponse.json({ name, imageUrl });
}
