const IMGUR_CLIENT_ID = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID;

if (!IMGUR_CLIENT_ID) {
  console.warn('Missing IMGUR_CLIENT_ID environment variable');
}

export const uploadToImgur = async (base64Image) => {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Upload error response:', data);
      throw new Error(data.error || 'Upload failed');
    }

    if (!data.url) {
      throw new Error('No URL returned from upload');
    }

    return data.url;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error(error.message || 'Image upload failed');
  }
};
