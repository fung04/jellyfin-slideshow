const ImageType = {
    backdrop: 'backdrop',
    primary: 'primary',
};

const VideoType = {
    movie: 'Movie',
    series: 'Series',
    season: 'Season',
    audio: 'MusicAlbum',
    episode: 'Episode',
    boxset: 'BoxSet',
};

class ApiConstant {
    static baseUrl = '';
    static port = 443;
    static apiKey = '';
}

class ApiClient {
    static getImageUrl(videoId, imageType) {
        // console.log(`https://${ApiConstant.baseUrl}:${ApiConstant.port}/Items/${videoId}/Images/${imageType}`)
        return `https://${ApiConstant.baseUrl}:${ApiConstant.port}/Items/${videoId}/Images/${imageType}/?quality=50&fillHeight=720&fillWidth=1280`;
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
    
        if (videoType ===  VideoType.boxset|| videoType ===  VideoType.audio ) {
            const parentIds = jsonData['Items'].map(item => ({ id: item['Id'] }));
    
            const fetchChildItems = async (parentId) => {
                const childUrl = new URL(`https://${ApiConstant.baseUrl}:${ApiConstant.port}/Users/${userId}/Items`);
                childUrl.searchParams.append('ParentId', parentId.id);
                childUrl.searchParams.append('api_key', ApiConstant.apiKey);
    
                const childResponse = await fetch(childUrl);
                if (!childResponse.ok) {
                    throw new Error('Failed to get child video ids');
                }
    
                const childJsonData = await childResponse.json();
    
                if (videoType ===  VideoType.audio) {
                    const uniqueItems = {};
                    childJsonData['Items'].forEach(item => {
                        uniqueItems[item['Album']] = item;
                    });
                    childJsonData['Items'] = Object.values(uniqueItems);
                }
    
                return childJsonData['Items']
                    .filter(item => item['ImageTags'] && item['ImageBlurHashes'][hashtype])
                    .map(item => ({
                        id: item['Id'],
                        name: videoType === VideoType.audio ? item['Album'] : item['Name'],
                        type: item['Type'],
                        blurhash: item['ImageBlurHashes'][hashtype],
                        imageType: imageType,
                    }));
            };
    
            // Fetch all child items concurrently
            const childResults = await Promise.all(parentIds.map(fetchChildItems));
    
            // Flatten the results
            const combinedVideoIds = childResults.flat();
    
            return combinedVideoIds;
        }
    
        // Original code for non-series/boxset items
        const videoIds = jsonData['Items']
            .filter(item => item['ImageTags'] && item['ImageBlurHashes'][hashtype])
            .map(item => ({
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
        const boxset = await ApiClient.getVideoIds({ userId, imageType: ImageType.primary, videoType: VideoType.boxset });
        const season = await ApiClient.getVideoIds({ userId, imageType: ImageType.primary, videoType: VideoType.season });
        const audio = await ApiClient.getVideoIds({ userId, imageType: ImageType.primary, videoType: VideoType.audio });
        const movie_backdrop = await ApiClient.getVideoIds({ userId, imageType: ImageType.backdrop, videoType: VideoType.movie });
        const series_backdrop = await ApiClient.getVideoIds({ userId, imageType: ImageType.backdrop, videoType: VideoType.series });
        const boxset_backdrop = await ApiClient.getVideoIds({ userId, imageType: ImageType.backdrop, videoType: VideoType.boxset });

        // show all list length
        console.log('movie', movie.length);
        console.log('series', series.length);
        console.log('boxset', boxset.length);
        console.log('season', season.length);
        console.log('movie_backdrop', movie_backdrop.length);
        console.log('series_backdrop', series_backdrop.length);
        console.log('boxset_backdrop', boxset_backdrop.length);
        console.log('audio', audio.length);

        const combineList = [...movie, ...series, ...boxset, ...season, ...movie_backdrop, ...series_backdrop, ...boxset_backdrop, ...audio];
        console.log('combineList', combineList.length);
        combineList.sort(() => Math.random() - 0.5);
        
        return combineList;
    }
}