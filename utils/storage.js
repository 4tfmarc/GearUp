import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadProductImages(files) {
  const imageUrls = [];
  
  for (const file of files) {
    // Create a unique file name
    const timestamp = Date.now();
    const fileName = `products/${timestamp}-${file.name}`;
    const storageRef = ref(storage, fileName);

    try {
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      // Get the download URL
      const downloadUrl = await getDownloadURL(snapshot.ref);
      imageUrls.push(downloadUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  return imageUrls;
}
