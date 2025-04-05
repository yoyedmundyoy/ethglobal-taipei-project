import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { imageData } = await request.json();
        
        // Remove the data URL prefix
        const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');
        
        // Create a buffer from the base64 data
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Generate a unique filename
        const filename = `capture.jpg`;
        const filePath = path.join(process.cwd(), 'public', 'captures', filename);
        
        // Ensure the captures directory exists
        const dirPath = path.join(process.cwd(), 'public', 'captures');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        // Write the file
        fs.writeFileSync(filePath, buffer);
        
        return NextResponse.json({ 
            success: true, 
            path: `/captures/${filename}` 
        });
    } catch (error) {
        console.error('Error saving image:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to save image' 
        }, { status: 500 });
    }
} 