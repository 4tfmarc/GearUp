import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { image } = await request.json();
    
    // Clean the base64 string
    const base64Image = image.split(',')[1] || image;

    // Using URLSearchParams as Imgur prefers this format
    const params = new URLSearchParams();
    params.append('image', base64Image);

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    const data = await response.json();
    console.log('Imgur API response:', data); // Debug log

    if (!data.success) {
      return NextResponse.json({ 
        error: data.data.error || 'Upload failed',
        details: data 
      }, { 
        status: 400 
      });
    }

    return NextResponse.json({ url: data.data.link });
  } catch (error) {
    console.error('Server upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed',
      details: error.message 
    }, { 
      status: 500 
    });
  }
}
