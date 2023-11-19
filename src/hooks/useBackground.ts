import {useEffect, useState} from "react";

export function useBackground(): string {
    const [bingURL, setURL] = useState<string>('');
    useEffect(() => {
        fetch('https://proxy.thoughtflow.org/proxy/www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US', {
            method: 'GET',
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            }
        }).then(resp => resp.json()).then(json => {
            const baseURL = "https://www.bing.com";
            const {images: [{url}]} = json;
            setURL(baseURL + url);
        }).catch(err => console.log(err.message))
    }, []);
    return bingURL;
}
