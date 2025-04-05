import { NextResponse } from 'next/server';

const mockDatabase: Record<string, { name: string; imageUrl: string }> = {
    "bmupz": { name: "Edmund Tong", imageUrl: "https://example.com/john.jpg" },
    "mniap": { name: "ALPHONSE HUGHUES ALBERT DUPONT", imageUrl: "https://ethglobal.b0bd725bc77a3ea7cd3826627d01fcb6.r2.cloudflarestorage.com/users/1dn91/images/2300976.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=dd28f7ba85ca3162a53d5c60b5f3dd05%2F20250405%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250405T075357Z&X-Amz-Expires=3600&X-Amz-Signature=6b0541ca17130d01bf87c676d9a45c7dd6f476e69be0918fcf217572f2d1b84a&X-Amz-SignedHeaders=host" },
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("registration_id");

    if (!registrationId || !mockDatabase[registrationId]) {
        return NextResponse.json({ error: "Registration ID not found" }, { status: 404 });
    }

    const { name, imageUrl } = mockDatabase[registrationId];
    return NextResponse.json({ name, imageUrl }, { status: 200 });
}
