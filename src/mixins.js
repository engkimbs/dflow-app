import axios from "axios";

export default {
    methods: {
        async $api(url, method, data) {
            return (await axios({
                method: method,
                url,
                data
            }).catch(e => {
                console.log(e);
            })).data;
        },
        async $getNAVERMapItemList(url, keyword, page=1, displayCount=100) {
            return (await axios.get(url, {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': '*/*'
                },
                params: {
                    'caller':'pcweb',
                    'query': keyword,
                    'type':'place',
                    'displayCount': displayCount,
                    'isPlaceRecommendationReplace':'true',
                    'page': page,
                    'lang':'ko'
                }
            }).catch(e => {
                console.log(e)
            })).data
        }
    }
}
