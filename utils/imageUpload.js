export async function uploadToImgur(base64Image) {
  // Remove the data:image/jpeg;base64, prefix
  const base64Data = base64Image.split(',')[1];

  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      'Authorization': `Client-ID YOUR_IMGUR_CLIENT_ID`, // You'll need to sign up for a free Imgur account
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Data,
      type: 'base64'
    })
  });

  const data = await response.json();
  return data.data.link;
}
