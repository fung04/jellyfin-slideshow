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
        return `https://${ApiConstant.baseUrl}:${ApiConstant.port}/Items/${videoId}/Images/${imageType}`;
    }

    static async _getUserId() {
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

    static async getVideoIds({ videoType, userId }) {
        userId = userId || await ApiClient._getUserId();
        const url = new URL(`https://${ApiConstant.baseUrl}:${ApiConstant.port}/Users/${userId}/Items`);
        url.searchParams.append('IncludeItemTypes', videoType);
        url.searchParams.append('Recursive', 'true');
        url.searchParams.append('api_key', ApiConstant.apiKey);
        const response = await fetch(url);
        if (response.ok) {
            const jsonData = await response.json();
            // console.log(jsonData['Items'][1]);
            
            const videoIds = jsonData['Items'].map((item) => ({
                'id': item['Id'],
                'name': item['Name'],
                'type': item['Type'],
                'blurhash': item['ImageBlurHashes']['Primary'],
            }));
            
            return videoIds;
        } else {
            throw new Error('Failed to get video ids');
        }
    }

    static async getAllVideoIds() {
        const userId = await ApiClient._getUserId();
        const list1 = await ApiClient.getVideoIds({ userId, videoType: VideoType.movie });
        const list2 = await ApiClient.getVideoIds({ userId, videoType: VideoType.series });
        const list3 = await ApiClient.getVideoIds({ userId, videoType: VideoType.audio });
        const list4 = await ApiClient.getVideoIds({ userId, videoType: VideoType.episode });

        // show all list length
        console.log(list1.length);
        console.log(list2.length);
        console.log(list3.length);
        console.log(list4.length);

        const combineList = [...list1, ...list2, ...list3, ...list4];
        combineList.sort(() => Math.random() - 0.5);
        return combineList;
    }
}