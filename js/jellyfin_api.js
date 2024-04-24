const ImageType = {
    backdrop: 'backdrop',
    primary: 'primary',
};

const VideoType = {
    movie: 'Movie',
    series: 'Series',
    audio: 'MusicAlbum',
    episode: 'Episode',
};

class ApiConstant {
    static baseUrl = '';
    static port = 443;
    static apiKey = '';
}

class ApiClient {
    static getImageUrl(videoId, imageType) {
        // console.log(`https://${ApiConstant.baseUrl}:${ApiConstant.port}/Items/${videoId}/Images/${imageType}`)
        return `https://${ApiConstant.baseUrl}:${ApiConstant.port}/Items/${videoId}/Images/${imageType}`;
    }

    static async _getUserId() {
        ApiConstant.baseUrl = localStorage.getItem("base-url");
        ApiConstant.apiKey = localStorage.getItem("api-key");
        
        const url = new URL(`https://${ApiConstant.baseUrl}:${ApiConstant.port}/Users`);
        url.searchParams.append('api_key', ApiConstant.apiKey);
        const response = await fetch(url);
        if (response.ok) {
            const users = await response.json();
            return users[1]['Id'];
        } else {
            throw new Error('Failed to get user id');
        }
    }

    static async getVideoIds({ videoType, imageType, userId }) {
        userId = userId || await ApiClient._getUserId();
        const url = new URL(`https://${ApiConstant.baseUrl}:${ApiConstant.port}/Users/${userId}/Items`);
        url.searchParams.append('IncludeItemTypes', videoType);
        url.searchParams.append('Recursive', 'true');
        url.searchParams.append('api_key', ApiConstant.apiKey);
      
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to get video ids');
        }
      
            const jsonData = await response.json();

        const hashtype = imageType === 'primary' ? 'Primary' : 'Backdrop';
        const videoIds = jsonData['Items']
            .filter((item) => item['ImageBlurHashes'][hashtype]) // Filter items with non-empty blurhash for the specified imageType
            .map((item) => ({
                id: item['Id'],
                name: item['Name'],
                type: item['Type'],
                blurhash: item['ImageBlurHashes'][hashtype],
                imageType: imageType,
            }));
            
            return videoIds;
    }


    static async getAllVideoIds() {
        const userId = await ApiClient._getUserId();
        const movie = await ApiClient.getVideoIds({ userId, imageType: ImageType.primary, videoType: VideoType.movie });
        const series = await ApiClient.getVideoIds({ userId, imageType: ImageType.primary, videoType: VideoType.series });
        const audio = await ApiClient.getVideoIds({ userId, imageType: ImageType.primary, videoType: VideoType.audio });
        const movie_backdrop = await ApiClient.getVideoIds({ userId, imageType: ImageType.backdrop, videoType: VideoType.movie });
        const series_backdrop = await ApiClient.getVideoIds({ userId, imageType: ImageType.backdrop, videoType: VideoType.series });

        // show all list length
        console.log('movie', movie.length);
        console.log('series', series.length);
        console.log('movie_backdrop', movie_backdrop.length);
        console.log('series_backdrop', series_backdrop.length);
        console.log('audio', audio.length);

        const combineList = [...movie, ...series, ...movie_backdrop, ...series_backdrop, ...audio];
        console.log('combineList', combineList.length);
        combineList.sort(() => Math.random() - 0.5);
        
        return combineList;
    }
}