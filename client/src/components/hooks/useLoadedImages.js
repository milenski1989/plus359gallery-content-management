import { useEffect, useState } from "react";

export const useLoadedImages = (searchResults) => {
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);

    useEffect(() => {
        const allImages = searchResults.map(result => result.image_url);
        const imagePromises = allImages.map(imageUrl => {
            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => resolve();
                img.src = imageUrl;
            });
        });

        Promise.all(imagePromises).then(() => {
            setAllImagesLoaded(true);
        });
    }, [searchResults]);

    return [allImagesLoaded]
}